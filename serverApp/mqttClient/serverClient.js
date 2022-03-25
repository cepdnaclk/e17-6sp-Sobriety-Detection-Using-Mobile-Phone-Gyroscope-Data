
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const mqtt = require('mqtt')
var mongoose = require('mongoose');

// importing the mongoose models ///////////////////////////////////////////////////////////////////////////////

const users = require('../models/users');  // importing the mongoose model for the collection 'users'
const gyroReadings = require('../models/gyroReadings');  // importing the mongoose model for the collection 'users'
const acceleroReadings = require('../models/acceleroReadings');  // importing the mongoose model for the collection 'users'


// options for connecting to mqtt broker
// const host = 'broker.hivemq.com'
// const port = '1883'
// const clientId = `mqtt_ServerClient`

// const connectUrl = `mqtt://${host}:${port}`
// const connectUrl = `mqtt://${host}`
////////////////////////////////
// to connect to atlas mongoDB
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to mongoose... (SERVER CLIENT)'));




// options for writing a csv file
const csvWriter = createCsvWriter({
  path: 'out.csv',
  header: [
    {id: 'x', title: 'XVal'},
    {id: 'y', title: 'YVal'},
    {id: 'z', title: 'ZVal'},
  ]
});

// const client = mqtt.connect(connectUrl, {
//   clientId,
//   clean: true,
//   connectTimeout: 4000,
//   username: 'emqx',  // ???
//   password: 'public',  // ???
//   reconnectPeriod: 1000,  // ???
// })

// const ServerClient = mqtt.connect(connectUrl)
// console.log(process.env.MQTT_HOST);
// console.log(process.env.MQTT_PORT);
// console.log(process.env.MQTT_PROTOCOL);
// console.log(process.env.MQTT_USERNAME);
// console.log(process.env.MQTT_PASSWORD);


var options = {
  host: process.env.MQTT_HOST || '',   
  port: process.env.MQTT_PORT || 3000,
  protocol: process.env.MQTT_PROTOCOL || '',
  username: process.env.MQTT_USERNAME || '',
  password: process.env.MQTT_PASSWORD || '',
  useSSL: true
}

// var options = process.env.MQTT_OPTIONS || {};  // MIGHT HAVE TO PARSE THE MQTT_OPTIONS USING JSON.parse()


var ServerClient = mqtt.connect(options);


// const topic = '/nodejs/mqtt'
const topic = process.env.MQTT_TOPIC+'+'   // 'gyroData/user/id'
// console.log('ammatsiri topic: '+ topic);

// ServerClient.on('connect', () => {
//   console.log('Connected')
//   ServerClient.subscribe([topic], () => {
//     console.log(`Subscribe to topic '${topic}'`)
//   })
// })

ServerClient.on('connect', () => {
  console.log('Successfully connected to mqtt broker')
  ServerClient.subscribe([topic], () => {
    console.log(`Successfully subscribed to topic '${topic}'`)
  })
})

/**
 * Note:
 * Separate thread used for each message.
 * Error occurs when 2 (or more) such threads try to access the same document in the database
 */
ServerClient.on('message', (topic, payload) => {
    // console.log('Received Message:', topic, payload.toString())
    // csvWriter
    // .writeRecords(JSON.parse(payload))  // TRY WRITING WITHOUT PARSING TO JSON
    // .then(()=> console.log('The CSV file was written successfully'));

    const uid_str = topic.split("/")[2]
    try {
      // const uid = mongoose.Types.ObjectId(uid_str);
      console.log(uid_str);

      // checking whether the user is a registered user
      gyroReadings.findOne({user_ref: uid_str})//.select('+password')  // finds the admin by email
      .then(readingsDoc => {
        if(readingsDoc) {
          var newData = JSON.parse(payload)
          console.log(newData);
          if(readingsDoc.readings.length+newData.length > 20){           // USE A THREAD POOL
            readingsDoc.readings.splice(0, readingsDoc.readings.length+newData.length-20);
          }
          readingsDoc.readings = readingsDoc.readings.concat(newData)  // WILL HAVE TO CHANGE DEPENDING ON THE RECEIVING DATA FORMAT

          // saving the readings document
          readingsDoc.save()
          .then(() =>{
            console.log('Now total: ' + readingsDoc.readings.length);

          })
          .catch(err =>{
            console.log('Error while trying to save readingsDoc -->');
            console.error(String(err));
          })
        }
        else{
          /**
           * write what to do if the person sending the data is not a user
           */
          console.log('User not yet registered');
        }
      })
      .catch(err => {
        // console.log('arbudayata mama wagakiyanne na');
        console.log('Error while trying to find the user from the database -->');
        console.error(String(err));
        // res.status(400).json({status: 'failure', message: 'Error occured while trying to find the admin with the given email', error: String(err)})  // CHECK THE STATUS CODE
      });
    }
    catch (err) {
      console.error(String(err));
    }

    
  })
  


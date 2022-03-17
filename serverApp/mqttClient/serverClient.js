
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const mqtt = require('mqtt')

// importing the mongoose models ///////////////////////////////////////////////////////////////////////////////

const users = require('../models/users');  // importing the mongoose model for the collection 'users'

// options for connecting to mqtt broker
// const host = 'broker.hivemq.com'
// const port = '1883'
// const clientId = `mqtt_ServerClient`

// const connectUrl = `mqtt://${host}:${port}`
// const connectUrl = `mqtt://${host}`


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

ServerClient.on('message', (topic, payload) => {
    // console.log('Received Message:', topic, payload.toString())
    csvWriter
    .writeRecords(JSON.parse(payload))  // TRY WRITING WITHOUT PARSING TO JSON
    .then(()=> console.log('The CSV file was written successfully'));

    const uid = topic.split("/")[2]
    console.log(uid);

    // checking whether the user is a registered user
    users.findOne({uid}).select('+password')  // finds the admin by email
    .then(user => {
      if(user) {
        if(user.isRegistered){
          var newData = JSON.parse(payload)
          if(user.gyroData.length > 20){           // USE A THREAD POOL
            user.gyroData.splice(0, newData.length);
          }
          user.gyroData = user.gyroData.concat(newData)  // WILL HAVE TO CHANGE DEPENDING ON THE RECEIVING DATA FORMAT
        }
        else {
          /**
           * write what to do if the user sending data is not registered
           */
        }
      }
      else{
        /**
         * write what to do if the person sending the data is not a user
         */
      }
    })
    .catch(err => {
      console.error(String(err));
      // res.status(400).json({status: 'failure', message: 'Error occured while trying to find the admin with the given email', error: String(err)})  // CHECK THE STATUS CODE
    });
  })
  


const fastcsv = require('fast-csv');
const fs = require('fs');
const mqtt = require('mqtt')


// options for connecting to mqtt broker
const host = 'broker.hivemq.com'
const port = '1883'
const clientId = `mqtt_ServerClient`

const connectUrl = `mqtt://${host}:${port}`
// const connectUrl = `mqtt://${host}`




// const client = mqtt.connect(connectUrl, {
//   clientId,
//   clean: true,
//   connectTimeout: 4000,
//   username: 'emqx',  // ???
//   password: 'public',  // ???
//   reconnectPeriod: 1000,  // ???
// })

// const ServerClient = mqtt.connect(connectUrl)

var options = {
  host: 'd7ddd60285be4c0285af25bef2ac7d5e.s2.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: 'e17251',
  password: '@Mahanama1998'
}

var ServerClient = mqtt.connect(options);


// const topic = '/nodejs/mqtt'
const topic = 'ClassifierOutput'

// ServerClient.on('connect', () => {
//   console.log('Connected')
//   ServerClient.subscribe([topic], () => {
//     console.log(`Subscribe to topic '${topic}'`)
//   })
// })

ServerClient.on('connect', () => {
  console.log('Connected')
  ServerClient.subscribe([topic], () => {
    console.log(`Successfully subscribed to topic '${topic}'`)
  })
})

ServerClient.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString())
    // csvWriter
    // .writeRecords(payload.toString())
    // .then(()=> console.log('The CSV file was written successfully'));
    const ws = fs.createWriteStream("out.csv");
    fastcsv
    .write(payload, { headers: true })
    .pipe(ws);
  })
  


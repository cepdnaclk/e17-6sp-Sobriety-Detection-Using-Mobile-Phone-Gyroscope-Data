const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const mqtt = require('mqtt')


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

var options = {
  host: 'd7ddd60285be4c0285af25bef2ac7d5e.s2.eu.hivemq.cloud',   
  port: 8883,
  protocol: 'mqtts',
  username: 'e17251',
  password: '@Mahanama1998',
  useSSL: true
}

var ServerClient = mqtt.connect(options);


// const topic = '/nodejs/mqtt'
const topic = 'gyro/savindu'

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
    // console.log('Received Message:', topic, payload.toString())
    csvWriter
    .writeRecords(JSON.parse(payload))
    .then(()=> console.log('The CSV file was written successfully'));
  })
  


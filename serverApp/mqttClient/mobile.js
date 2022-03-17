const mqtt = require('mqtt')
var toBuffer = require('typedarray-to-buffer')

// const host = 'broker.hivemq.com'
// const port = '1883'
// const clientId = `mqtt_MobileClient`

// setting environment variables
require('dotenv').config({path: '../'});

// const connectUrl = `mqtt://${host}:${port}`
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


// var options = {
//   host: process.env.MQTT_HOST || '',   
//   port: process.env.MQTT_PORT || 3000,
//   protocol: process.env.MQTT_PROTOCOL || '',
//   username: process.env.MQTT_USERNAME || '',
//   password: process.env.MQTT_PASSWORD || '',
//   useSSL: true
// }

var MobileClient = mqtt.connect(options);


// const topic = '/nodejs/mqtt'   'gyroData/user/'
// const topic = process.env.MQTT_TOPIC+'6233161be54d65b84ea6acb6'
const topic = 'gyroData/user/'+'6233161be54d65b84ea6acb6'

console.log({topic});

// ServerClient.on('connect', () => {
//   console.log('Connected')
//   ServerClient.subscribe([topic], () => {
//     console.log(`Subscribe to topic '${topic}'`)
//   })
// })

MobileClient.on('connect', () => {
  console.log('Connected')
  MobileClient.subscribe([topic], () => {
    console.log(`Successfully subscribed to topic '${topic}'`)
  })
})

const data = [
  {
    x: 'xval1',
    y: 'yval1',
    z: 'zval1'
  }, {
    x: 'xval2',
    y: 'yval2',
    z: 'zval2',
  }, {
    x: 'xval3',
    y: 'yval3',
    z: 'zval3'
  }
];
// var arr = new Uint8Array(data)
// var arr = toBuffer(data)
var arr = JSON.stringify(data);


MobileClient.publish(topic, arr, { qos: 2, retain: true }, (error) => {
  console.log('Published data: \n', arr);
  if (error) {
    console.error(error)
  }
})
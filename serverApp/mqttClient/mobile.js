const mqtt = require('mqtt')
var toBuffer = require('typedarray-to-buffer')

const host = 'broker.hivemq.com'
const port = '1883'
const clientId = `mqtt_MobileClient`

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

var MobileClient = mqtt.connect(options);


// const topic = '/nodejs/mqtt'
const topic = 'ClassifierOutput'

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
    time: 'time1',
    xval: 'xval1',
    yval: 'yval1',
    zval: 'zval1'
  }, {
    time: 'time2',
    xval: 'xval2',
    yval: 'yval2',
    zval: 'zval2',
  }, {
    time: 'time3',
    xval: 'xval3',
    yval: 'yval3',
    zval: 'zval3'
  }
];
// var arr = new Uint8Array(data)
// var arr = toBuffer(data)
var arr = JSON.stringify(data);


MobileClient.publish(topic, arr, { qos: 2, retain: true }, (error) => {
  if (error) {
    console.error(error)
  }
})
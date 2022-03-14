const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
const fs = require('fs');
const csvWriter = require('csv-write-stream');
const proto_data = require('./data_pb');

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use('/', router);

router.post('/gyroscope', (req, res) => {
    var data = req.body;
    console.log(data.pid + ' has sent gyroscope data');
    const filePath = './data/gyroscope/' + data.pid + '.csv';
    var writer;
    if (!fs.existsSync(filePath))
        writer = csvWriter({ headers: ["timestamp", "x", "y", "z"] });
    else
        writer = csvWriter({ sendHeaders: false });
    writer.pipe(fs.createWriteStream(filePath, { flags: 'a' }));
    data.data.forEach(function (item) {
        writer.write({
            timestamp: item.timestamp,
            x: item.x,
            y: item.y,
            z: item.z
        });
    });
    writer.end();
    res.send({success: true, message: "Data recieved successfully"});
});

router.post('/accelerometer', (req, res) => {
    var data = req.body;
    console.log(data.pid + ' has sent accelerometer data');
    const filePath = './data/accelerometer/' + data.pid + '.csv';
    var writer;
    if (!fs.existsSync(filePath))
        writer = csvWriter({ headers: ["timestamp", "x", "y", "z"] });
    else
        writer = csvWriter({ sendHeaders: false });
    writer.pipe(fs.createWriteStream(filePath, { flags: 'a' }));
    data.data.forEach(function (item) {
        writer.write({
            timestamp: item.timestamp,
            x: item.x,
            y: item.y,
            z: item.z
        });
    });
    writer.end();
    res.send({success: true, message: "Data recieved successfully"});
});

router.get('/prediction/:pid', (req, res) => {
    const pid = req.params.pid;
    console.log(pid + ' has requested prediction');
    // TODO: Predict
    // ...
    res.send({success: true, message: "Sober history for this person isn't available yet", prediction_history: null});
});

app.listen(3000, () => {
    console.log("Server started on PORT 3000");
});
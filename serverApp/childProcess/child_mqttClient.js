var { spawn } = require('child_process');

const childPython = spawn('node', ['../mqttClient/serverClient.js'])

childPython.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

childPython.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
})

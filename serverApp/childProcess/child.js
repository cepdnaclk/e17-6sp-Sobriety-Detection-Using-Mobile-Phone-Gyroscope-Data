var { spawn } = require('child_process');

const childPython = spawn('python3', ['samplcode.py'])

childPython.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

childPython.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
})

// module.exports = router;

const http = require('http');
const fs = require('fs');

// Function to get the EC2 instance ID from meta-data
function getInstanceId(callback) {
    fs.readFile('/sys/devices/virtual/dmi/id/board_asset_tag', 'utf8', (err, data) => {
        if (err) callback('Unknown');
        else callback(data.trim());
    });
}

const server = http.createServer((req, res) => {
    getInstanceId((instanceId) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<h1>Welcome to My Scalable Web Application</h1>');
        res.write('<p>This is running on EC2 instance: <b>' + instanceId + '</b></p>');
        res.end();
    });
});

server.listen(80, () => {
    console.log('Server is listening on port 80');
});

'use strict';

const http = require('http');

const config = {};
config.services = require('./config/services.js');
config.application = require('./config/application.js');

let app = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`test2:Hello World, someKey:${config.application.someKey}`);
});

const port = config.services.http.port;
app.listen(port);
console.log(`Node server listening on port ${port}`);


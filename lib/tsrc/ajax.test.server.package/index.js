'use strict';

//https://nodejs.org/api/http.html

const assert = require('assert');
const http = require('http');
const url = require('url');

const config = {};
config.services = require('./config/services.js');
config.application = require('./config/application.js');

let requestCounter = 0;
let response = config.application.response;

let app = http.createServer((req, res) => {
    //console.log('req:'); console.dir(req);
    if(req.method == 'POST') {
        //console.log('----------------- POST --------------');
        //const queryData = url.parse(req.url, true).query;
        //console.log('queryData:'); console.dir(queryData);
        let body = '';
        req.on('data', (data)=>{
            body += data;
            //console.log('Partial body: ' + body)
        });
        req.on('end', ()=>{
            //console.log('Body: ' + body)
            res.writeHead(200, {'Content-Type': 'text/html'});
            response = JSON.parse(body); // Update response
            const r = JSON.parse(JSON.stringify(response));
            r.value = r.value + '-' + (requestCounter++);
            res.end(JSON.stringify(r));
        });
    } else if(req.method == 'GET') {
        //console.log('----------------- GET --------------');
        res.writeHead(200, {'Content-Type': 'text/html'});
        const r = JSON.parse(JSON.stringify(response));
        r.value = r.value + '-' + (requestCounter++);
        res.end(JSON.stringify(r));
    } else if(req.method == 'DELETE') {
        //console.log('----------------- DELETE --------------');
    } else {
    }
});

const port = config.services.http.port;
app.listen(port);
console.log(`Node server listening on port ${port}`);


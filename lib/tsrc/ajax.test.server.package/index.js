'use strict';

const express = require('express');

const config = {};
config.services = require('./config/services.js');
config.application = require('./config/application.js');
let response = config.application.response;




const app = express();




const text = {
    getCounter: 0,
    postCounter: 0,
    deleteCounter: 0
};




app.get('/text', function(req, res){
    const r = JSON.parse(JSON.stringify(response.get));
    r.value = r.value + '-' + (text.getCounter++);
    res.status(200).end(JSON.stringify(r));
});




app.post('/text', function(req, res){
    let body = '';
    req.on('data', (data)=>{
        body += data;
    });
    req.on('end', ()=>{
        //res.writeHead(200, {'Content-Type': 'text/html'});
        const r = JSON.parse(body);
        r.value = r.value + '-' + (text.postCounter++);
        res.status(200).end(JSON.stringify(r));
    });
});




app.delete('/text', function(req, res){
    const r = JSON.parse(JSON.stringify(response.delete));
    r.value = r.value + '-' + (text.deleteCounter++);
    res.status(200).end(JSON.stringify(r));
});




app.all('/text/error500', (req, res) => {
    res.status(500).send('Error 500 has happend');
});




const json = {
    getCounter: 0,
    postCounter: 0,
    deleteCounter: 0
};




app.get('/json', function(req, res){
    const r = JSON.parse(JSON.stringify(response.get));
    r.value = r.value + '-' + (json.getCounter++);
    res.status(200).send(r);
});




app.post('/json', function(req, res){
    let body = '';
    req.on('data', (data)=>{
        body += data;
    });
    req.on('end', ()=>{
        const r = JSON.parse(body);
        r.value = r.value + '-' + (json.postCounter++);
        res.status(200).send(r);
    });
});




app.delete('/json', function(req, res){
    const r = JSON.parse(JSON.stringify(response.delete));
    r.value = r.value + '-' + (json.deleteCounter++);
    res.status(200).send(r);
});




app.all('/json/error500', (req, res) => {
    res.status(500).send('Error 500 has happend');
});




const port = config.services.http.port;
app.listen(port);
console.log(`Node server listening on port ${port}`);


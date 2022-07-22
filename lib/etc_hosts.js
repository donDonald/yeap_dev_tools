'use strict';

// Q, What is it for?
// It's simple tool for updating /etc/hosts to help resolve app domain names.

const assert = require('assert');
const exec = require('child_process').exec;
const hostile = require('hostile');

const hosts = {};
module.exports = hosts;

///\brief Add given name and address to /etc/hosts
hosts.add = (name, addr, cb)=>{
    if(typeof addr == 'function') {
        cb = addr;
        addr = '127.0.0.1';
    }

//  console.log(`etc_hosts.add(), name:${name}, addr:${addr}`);
    hostile.set(addr, name, (err)=>{
        cb(err);
    });
}

///\brief Remove given name and address to /etc/hosts
hosts.remove = (name, addr, cb)=>{
//  console.log(`etc_hosts.remove(), name:${name}, addr:${addr}`);
    if(typeof addr == 'function') {
        cb = addr;
        addr = '127.0.0.1';
    }

    hostile.remove(addr, name, (err)=>{
        cb(err);
    });
}

//const cmd = [
//    'cp /etc/hosts ~/hosts',
//    'if grep -q \"' + appHostName + '\" ~/hosts; then',
//    '    sed -i \"s/.*' + appHostName + '/' + hostIp + '    ' + appHostName + '/g\" ~/hosts',
//    'else',
//    '    echo "' + hostIp + '    ' + appHostName + '\" >> ~/hosts',
//    'fi',
//    'cp ~/hosts /etc/hosts'
//].join("\n");;


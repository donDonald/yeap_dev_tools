'use strict';

// Q, What is it for?
// It's simple tool for updating /etc/hosts to help resolve docker container.

const assert = require('assert');
const exec = require('child_process').exec;
const hostile = require('hostile');

const hosts = {};
module.exports = hosts;

const collectContainerInfo = (containerName, cb)=>{
    const container = {};
    const commands = [
        {cmd: `docker exec -t ${containerName} sh -c "hostname -i" | head -c-2`, handler:(stdout)=>{container.addr=stdout;}},
        //{cmd: `docker exec -t ${containerName} sh -c "hostname" | head -c-2`, handler:(stdout)=>{container.host=stdout;}},
        {cmd: `docker exec -t ${containerName} sh -c "hostname" | head -c-2`, handler:(stdout)=>{container.host=containerName;}},
    ];

    const execCmd = function(index, commands, cb) {
        if (index < commands.length) {
            const cmd = commands[index];
//          console.log('cmd:'); console.log(cmd.cmd);
            
            exec(cmd.cmd, {encoding: 'utf8', maxBuffer: 200*1024}, (error, stdout, stderr)=>{
//              console.log('error:  ' + error);
//              console.log('stdout: ' + stdout);
//              console.log('stderr: ' + stderr);
                error = error || stderr;
                if (error) {
                    cb(error)
                } else {
                    cmd.handler(stdout);
                    execCmd(index+1, commands, cb);
                }
            });
        } else {
            cb();
        }
    }

    execCmd(0, commands, (err)=>{
        cb(err, container);
    });
}

///\brief Add given containers' name and address to /etc/hosts
hosts.add = (containerName, cb)=>{
//  console.log('etc_hosts_docker.add(), containerName:' + containerName);
    collectContainerInfo(containerName, (err, container)=>{
        if(err) {
            cb(err);
        } else {
            assert(container.addr);
            assert(container.host);
//          console.log('etc_hosts_docker.add, container:'); console.dir(container);
            hostile.set(container.addr, container.host, (err)=>{
                cb(err);
            });
        }
    });
}

hosts.remove = (containerName, cb)=>{
//  console.log(`etc_hosts_docker.remove(), name:${containerName}`);
    collectContainerInfo(containerName, (err, container)=>{
        if(err) {
            cb(err);
        } else {
            assert(container.addr);
            assert(container.host);
//          console.log('etc_hosts_docker.remove, container:'); console.dir(container);
            hostile.remove(container.addr, container.host, (err)=>{
                cb(err);
            });
        }
    });
}


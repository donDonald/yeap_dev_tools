'use strict';

module.exports = (api)=>{
    const assert = require('assert');
    assert(api);
    const exec = require('child_process').exec;
    const readline = require('readline');
    const stream = require('stream');

    class Pm2 {
        static create(options) {
            let self;
            self = new Pm2();
            return self;
        }

        constructor() {
        }

        get exec() {
            const exec2 = this.exec_ ? this.exec_ : exec;
            return exec2;
        }

        set exec(exec) {
            this.exec_ = exec;
        }

        ps(cb) {
            const cmd = 'pm2 ps';
            this.exec(cmd, /*this.execOptions,*/ (error, stdout, stderr)=>{
                if (error) {
                    cb(error);
                } else {
                    Pm2.parse(stdout, (result)=> {
                        cb(undefined, result);
                    });
                }
            });
        }

        status(name, cb) {
            assert(name);
            assert(cb);
            this.ps((err, result)=>{
                if(err) {
                    cb(err);
                } else {
                    let indexFound = -1;
                    for(let i = 0; i<result.length; ++i) {
                        const e = result[i];
                        if (e.name == name) {
                            indexFound = i;
                            break;
                        }
                    }
                    if(indexFound == -1) {
                        cb(`Given app ${name} is not even started`);
                    } else {
                        const e = result[indexFound];
                        cb(undefined, e.status);
                    }
                }
            });
        }

        start(name, options, cb) {
            assert(name);
            assert(options);
            assert(options.cwd);
            assert(cb);
            this.ps((err, result)=>{
                if(err) {
                    cb(err);
                } else {
                    let indexFound = -1;
                    for(let i = 0; i<result.length; ++i) {
                        const e = result[i];
                        if (e.name == name) {
                            indexFound = i;
                            break;
                        }
                    }
                    if(indexFound == -1) {
                        const cmd = `pm2 --name ${name} start npm -- start`;
                        this.exec(cmd, options, (error, stdout, stderr)=>{
                            if (error) {
                                cb(error);
                            } else {
                                setTimeout(cb, 2000);
                            }
                        });
                    } else {
                        cb(`Given app ${name} is already running`);
                    }
                }
            });
        }

        stop(name, cb) {
            // pm2 delete 0
            assert(name);
            assert(cb);
            this.ps((err, result)=>{
                if(err) {
                    cb(err);
                } else {
                    let indexFound = -1;
                    for(let i = 0; i<result.length; ++i) {
                        const e = result[i];
                        if (e.name == name) {
                            indexFound = i;
                            break;
                        }
                    }
                    if(indexFound == -1) {
                        //cb(`Given app ${name} is not found`);
                        cb();
                    } else {
                        const id = result[indexFound].id;
                        const cmd = `pm2 delete ${id}`;
                        this.exec(cmd, /*this.execOptions,*/ (error, stdout, stderr)=>{
                            if (error) {
                                cb(error);
                            } else {
                                setTimeout(cb, 2000);
                            }
                        });
                    }
                }
            });
        }

        static parse(text, cb) {
            const collectLines = (text, cb)=>{
                const buf = Buffer.from(text);
                const bufferStream = new stream.PassThrough();
                bufferStream.end(buf);

                const rl = readline.createInterface({
                    input: bufferStream,
                });

                let count = 0;
                const lines = [];
                rl.on('line', (line)=>{
                    line = line.replace(/ /g, "");
                    lines.push(line);
                });

                rl.on('close', (line)=>{
                    cb(lines);
                });
            }

            const entries = [];
            collectLines(text, (lines)=>{
                //console.log('---------- lines:');
                //console.dir(lines);
                //assert(lines.length % 2 == 1);
                if(lines.length > 3) {
                    for(let i=3; i<lines.length; ++i) {
                        let line = lines[i];
                        //console.log('---------- line:' + line);
                        const elements = line.split('│');
                        //console.log('---------- elements:');
                        //console.dir(elements);
                        //assert(elements.length == 15);
                        if(elements.length == 15) {
                            const entry = {
                                id: elements[1],
                                name: elements[2],
                                namespace: elements[3],
                                version: elements[4],
                                mode: elements[5],
                                pid: elements[6],
                                uptime: elements[7],
                                smth: elements[8],
                                status: elements[9],
                                cpu: elements[10],
                                mem: elements[11],
                                user: elements[12],
                                watching: elements[13]
                            };
                            //console.log('---------- entry:');
                            //console.dir(entry);
                            entries.push(entry);
                        }
                    }
                    cb(entries);
                } else {
                    cb(entries);
                }
            });
        }
    }

    return Pm2;
}


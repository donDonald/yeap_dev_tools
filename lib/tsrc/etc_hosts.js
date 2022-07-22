'use strict';

describe("yeap_dev_tools.etc_hosts, System helper for updating /etc/hosts.", ()=>{

    const assert = require('assert');
    const exec = require('child_process').exec;
    const re = (module)=>{ return require('../' + module); }

    let hosts, checkRecordExists;
    before(()=>{
        hosts = re('etc_hosts.js');
        checkRecordExists = (name, addr, cb)=>{
            const str = `${addr} ${name}`;

            const cmd = [
                'grep \"' + str + '\" /etc/hosts',
            ].join("\n");
        //  console.log(cmd);

            const execOptions = {
                env: Object.assign({}, process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
            };

            exec(cmd, execOptions, function(error, stdout, stderr) {
        //      console.log('error:  ' + error);
        //      console.log('stdout: ' + stdout);
        //      console.log('stderr: ' + stderr);
                error = error || stderr;
                if (error) {
                    //cb(error);
                    cb(undefined, false);
                } else {
                    cb(error, stdout.includes(str));
                }
            });
        }
    });

    it('Check here is no such record for aaaaaa.bbbb', (done)=>{
        checkRecordExists('aaaaaa.bbbb', '127.0.0.1', (err, found)=>{
            assert(!err);
            assert(!found);
            done();
        });
    });

    it('Add host aaaaaa.bbbb, no ip is given', (done)=>{
        hosts.add('aaaaaa.bbbb', (err)=>{
            assert(!err);
            done();
        });
    });

    it('Check record for aaaaaa.bbbb exists', (done)=>{
        checkRecordExists('aaaaaa.bbbb', '127.0.0.1', (err, found)=>{
            assert(!err);
            assert(found);
            done();
        });
    });

    it('Check here is no such record for cccccc.dddd', (done)=>{
        checkRecordExists('cccccc.dddd', '1.1.1.1', (err, found)=>{
            assert(!err);
            assert(!found);
            done();
        });
    });

    it('Add host cccccc.dddd', (done)=>{
        hosts.add('cccccc.dddd', '1.1.1.1' , (err)=>{
            assert(!err);
            done();
        });
    });

    it('Check record for cccccc.dddd exists', (done)=>{
        checkRecordExists('cccccc.dddd', '1.1.1.1', (err, found)=>{
            assert(!err);
            assert(found);
            done();
        });
    });

    it('Remove host aaaaaa.bbbb, no ip is given', (done)=>{
        hosts.remove('aaaaaa.bbbb', (err)=>{
            assert(!err);
            done();
        });
    });

    it('Check NO record for aaaaaa.bbbb exists', (done)=>{
        checkRecordExists('aaaaaa.bbbb', '127.0.0.1', (err, found)=>{
            assert(!err);
            assert(!found);
            done();
        });
    });

    it('Remove host cccccc.dddd, no ip is given', (done)=>{
        hosts.remove('cccccc.dddd', '1.1.1.1', (err)=>{
            assert(!err);
            done();
        });
    });

    it('Check NO record for cccccc.dddd exists', (done)=>{
        checkRecordExists('cccccc.dddd', '1.1.1.1', (err, found)=>{
            assert(!err);
            assert(!found);
            done();
        });
    });
});


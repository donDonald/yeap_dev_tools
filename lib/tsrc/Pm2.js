'use strict';

const assert = require('assert');
const Pm2 = require('../Pm2.js')(1);

describe('yeap_dev_tools.Pm2', ()=>{

    describe('#Pm2.parse', (done)=>{

        it('0 services', (done)=>{
            const stdout =
                `┌─────┬───────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
                 │ id  │ name      │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
                 └─────┴───────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘`;

            Pm2.parse(stdout, (entries)=>{
                assert(entries);
                assert.equal(entries.length, 0);
                done();
            });
        });

        it('1 service', (done)=>{
            const stdout =
               `┌─────┬───────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
                │ id  │ name          │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
                ├─────┼───────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
                │ 0   │ HelloWorld    │ default     │ N/A     │ fork    │ 75767    │ 0s     │ 0    │ online    │ 0%       │ 19.0mb   │ ptaranov │ disabled │
                └─────┴───────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘`;

            Pm2.parse(stdout, (entries)=>{
                assert(entries);
                assert.equal(entries.length, 1);

                const e = entries[0];
                assert.equal(e.id, 0);
                assert.equal(e.name, 'HelloWorld');
                assert.equal(e.namespace, 'default');
                assert.equal(e.version, 'N/A');
                assert.equal(e.mode, 'fork');
                assert.equal(e.pid, 75767);
                assert.equal(e.uptime, '0s');
                assert.equal(e.smth, 0);
                assert.equal(e.status, 'online');
                assert.equal(e.cpu, '0%');
                assert.equal(e.mem, '19.0mb');
                assert.equal(e.user, 'ptaranov');
                assert.equal(e.watching, 'disabled');

                done();
            });
        });

        it('2 services', (done)=>{
            const stdout =
                `┌─────┬───────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
                 │ id  │ name          │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
                 ├─────┼───────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
                 │ 0   │ AppServer     │ default     │ N/A     │ fork    │ 103381   │ 1s     │ 14   │ online    │ 0%       │ 53.5mb   │ ptaranov │ disabled │
                 │ 1   │ HelloWorld    │ default     │ N/A     │ fork    │ 103469   │ 0s     │ 11   │ online    │ 0%       │ 34.4mb   │ ptaranov │ disabled │
                 └─────┴───────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘`;
            Pm2.parse(stdout, (entries)=>{
                assert(entries);
                assert.equal(entries.length, 2);

                let e = entries[0];
                assert.equal(e.id, 0);
                assert.equal(e.name, 'AppServer');
                assert.equal(e.namespace, 'default');
                assert.equal(e.version, 'N/A');
                assert.equal(e.mode, 'fork');
                assert.equal(e.pid, 103381);
                assert.equal(e.uptime, '1s');
                assert.equal(e.smth, 14);
                assert.equal(e.status, 'online');
                assert.equal(e.cpu, '0%');
                assert.equal(e.mem, '53.5mb');
                assert.equal(e.user, 'ptaranov');
                assert.equal(e.watching, 'disabled');

                e = entries[1];
                assert.equal(e.id, 1);
                assert.equal(e.name, 'HelloWorld');
                assert.equal(e.namespace, 'default');
                assert.equal(e.version, 'N/A');
                assert.equal(e.mode, 'fork');
                assert.equal(e.pid, 103469);
                assert.equal(e.uptime, '0s');
                assert.equal(e.smth, 11);
                assert.equal(e.status, 'online');
                assert.equal(e.cpu, '0%');
                assert.equal(e.mem, '34.4mb');
                assert.equal(e.user, 'ptaranov');
                assert.equal(e.watching, 'disabled');

                done();
            });
        });
    });

    describe('#Pm2.ps', (done)=>{
        it('error case', (done)=>{
            const pm2 = Pm2.create();
            pm2.exec = (cmd, cb)=>{
                cb('some error', '', '');
            }
            pm2.ps((err, result)=>{
                assert.equal(err, 'some error');
                assert(!result);
                done();
            })
        });

        it('0 services', (done)=>{
            const pm2 = Pm2.create();
            pm2.exec = (cmd, cb)=>{
                const stdout =
                    `┌─────┬───────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
                     │ id  │ name      │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
                     └─────┴───────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘`;
                cb(undefined, stdout, '');
            }
            pm2.ps((err, result)=>{
                assert(!err);
                assert(result);
                assert.equal(result.length, 0);
                done();
            })
        });

        it('1 service', (done)=>{
            const pm2 = Pm2.create();
            pm2.exec = (cmd, cb)=>{
                const stdout =
                   `┌─────┬───────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
                    │ id  │ name          │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
                    ├─────┼───────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
                    │ 0   │ HelloWorld    │ default     │ N/A     │ fork    │ 75767    │ 0s     │ 0    │ online    │ 0%       │ 19.0mb   │ ptaranov │ disabled │
                    └─────┴───────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘`;
                cb(undefined, stdout, '');
            }
            pm2.ps((err, result)=>{
                assert(!err);
                assert(result);
                assert.equal(result.length, 1);

                const e = result[0];
                assert.equal(e.id, 0);
                assert.equal(e.name, 'HelloWorld');
                assert.equal(e.namespace, 'default');
                assert.equal(e.version, 'N/A');
                assert.equal(e.mode, 'fork');
                assert.equal(e.pid, 75767);
                assert.equal(e.uptime, '0s');
                assert.equal(e.smth, 0);
                assert.equal(e.status, 'online');
                assert.equal(e.cpu, '0%');
                assert.equal(e.mem, '19.0mb');
                assert.equal(e.user, 'ptaranov');
                assert.equal(e.watching, 'disabled');
                done();
            })
        });

        it('2 services', (done)=>{
            const pm2 = Pm2.create();
            pm2.exec = (cmd, cb)=>{
                const stdout =
                    `┌─────┬───────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
                     │ id  │ name          │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
                     ├─────┼───────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
                     │ 0   │ AppServer     │ default     │ N/A     │ fork    │ 103381   │ 1s     │ 14   │ online    │ 0%       │ 53.5mb   │ ptaranov │ disabled │
                     │ 1   │ HelloWorld    │ default     │ N/A     │ fork    │ 103469   │ 0s     │ 11   │ online    │ 0%       │ 34.4mb   │ ptaranov │ disabled │
                     └─────┴───────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘`;
                cb(undefined, stdout, '');
            }
            pm2.ps((err, result)=>{
                assert(!err);
                assert(result);
                assert.equal(result.length, 2);

                let e = result[0];
                assert.equal(e.id, 0);
                assert.equal(e.name, 'AppServer');
                assert.equal(e.namespace, 'default');
                assert.equal(e.version, 'N/A');
                assert.equal(e.mode, 'fork');
                assert.equal(e.pid, 103381);
                assert.equal(e.uptime, '1s');
                assert.equal(e.smth, 14);
                assert.equal(e.status, 'online');
                assert.equal(e.cpu, '0%');
                assert.equal(e.mem, '53.5mb');
                assert.equal(e.user, 'ptaranov');
                assert.equal(e.watching, 'disabled');

                e = result[1];
                assert.equal(e.id, 1);
                assert.equal(e.name, 'HelloWorld');
                assert.equal(e.namespace, 'default');
                assert.equal(e.version, 'N/A');
                assert.equal(e.mode, 'fork');
                assert.equal(e.pid, 103469);
                assert.equal(e.uptime, '0s');
                assert.equal(e.smth, 11);
                assert.equal(e.status, 'online');
                assert.equal(e.cpu, '0%');
                assert.equal(e.mem, '34.4mb');
                assert.equal(e.user, 'ptaranov');
                assert.equal(e.watching, 'disabled');
                done();
            })
        });
    });

    describe('Real package', (done)=>{
        let pm2, appName;
        before(()=>{
            pm2 = Pm2.create();
            appName = 'SuperDuper';
        });

        it('Check app status', (done)=>{
            pm2.status(appName, (err, status)=>{
                assert.equal(err, `Given app ${appName} is not even started`);
                assert(!status);
                done();
            });
        });

        it('Start test app', (done)=>{
            pm2.start(appName, {cwd:__dirname+'/Pm2.test1.package'}, (err)=>{
                assert(!err, err);
                done();
            });
        });

        it('Start test app 2nd time', (done)=>{
            pm2.start(appName, {cwd:__dirname+'/Pm2.test1.package'}, (err)=>{
                assert(err);
                assert.equal(err, `Given app ${appName} is already running`);
                done();
            });
        });

        it('Check app status', (done)=>{
            pm2.status(appName, (err, status)=>{
                assert(!err);
                assert.equal(status, 'online');
                done();
            });
        });

        it('Stop test app', (done)=>{
            pm2.stop(appName, (err)=>{
                assert(!err, err);
                done();
            });
        });

        it('Check app status', (done)=>{
            pm2.status(appName, (err, status)=>{
                assert.equal(err, `Given app ${appName} is not even started`);
                assert(!status);
                done();
            });
        });

        it('Stop test app 2nd time', (done)=>{
            pm2.stop(appName, (err)=>{
                assert(!err);
                done();
            });
        });

        it('Check app status', (done)=>{
            pm2.status(appName, (err, status)=>{
                assert.equal(err, `Given app ${appName} is not even started`);
                assert(!status);
                done();
            });
        });
    });
});


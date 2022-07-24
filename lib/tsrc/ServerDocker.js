'use strict';

describe("yeap_dev_tools.ServerDocker, System helper to manipulate server in docker case.", ()=>{

    const assert = require('assert');
    const re = (module)=>{ return require('../' + module); }
    let api = {};
    let server, DB_CRIDENTIALS, ajax;
    before(()=>{
        api.zlib = require('zlib');
        api.stream = require('stream');
        api.logger = require('yeap_logger');
        api.log = api.logger.Logger;
        api.dev_tools = {};
        api.dev_tools.etc_hosts = re('etc_hosts');
        api.dev_tools.Pm2 = re('Pm2')(api);
        api.dev_tools.options = re('options');
        api.dev_tools.Server = re('Server')(api);
        api.dev_tools.ServerDocker = re('ServerDocker')(api);
        api.dev_tools.ajax = re('ajax')(api);
        ajax = api.dev_tools.ajax;
        const yeap_db = require('yeap_db');
        const dbHelpers = yeap_db.mysql.helpers;
        DB_CRIDENTIALS = JSON.parse(JSON.stringify(dbHelpers.DB_CRIDENTIALS));
    });

    describe("Single case.", ()=>{
        let server;
        let config;
        before(()=>{
            server = new api.dev_tools.ServerDocker();
            config = {
                databases: {
                    main: {}
                },
                services: {
                    http: {
                        port:10000
                    },
                },
                application: {
                    someKey:'SomeValue'
                },
                scale: {
                    cloud: {
                        name:'TBR',
                    },
                    clusters: [
                        {
                            id:'c1',
                        }
                    ]
                },
                balancer: {
                    periodMs: 60*1000,
                    trackingLengthMs: 24*60*60*1000,
                    logResult: false
                }
            };
        });

        after(()=>{
            server = undefined;
        });

        it('Stop server', (done)=>{
            server.stop((err)=>{
                assert(!err);
                done();
            });
        });

        it('Check server status', (done)=>{
            server.status((err, status)=>{
                assert(!err);
                assert.equal('Stopped', status);
                done();
            });
        });

        it('Add not existing app', (done)=>{
            DB_CRIDENTIALS.database = 'not_existing';
            config.databases.main = DB_CRIDENTIALS;
            server.addApp('notExistingApp', __dirname + '/notExistingApp/', config, (err)=>{
                assert(err);
                done();
            });
        });

        const app1 = 'sys/tsrc/Pm2.test1.package';
        it('Add ' + app1 + ' app', (done)=>{
            DB_CRIDENTIALS.database = app1.split('/').join('_');
            config.databases.main = DB_CRIDENTIALS;
            server.addApp(app1, __dirname + '/Pm2.test1.package/', config, (err)=>{
                assert(!err);
                done();
            });
        });

        it('Add ' + app1 + ' app again', (done)=>{
            DB_CRIDENTIALS.database = app1.split('/').join('_');
            config.databases.main = DB_CRIDENTIALS;
            server.addApp(app1, __dirname + '/Pm2.test1.package/', config, (err)=>{
                assert(!err);
                done();
            });
        });

        it('Start server', (done)=>{
            server.start((err)=>{
                assert(!err);
                done();
            });
        });

        it('Check server server is running', (done)=>{
            server.status((err, status)=>{
                assert(!err);
                assert.equal('Running', status);
                done();
            });
        });

        it('Make ' + app1 + 'call for many times', (done)=>{
            const call = (index, times, cb)=>{
                if(index<times) {
                    const url = server.application(app1).peekUrl();
                    ajax.get(undefined, url, undefined, undefined, undefined, (err, session, result)=>{
                        if(err) {
                            cb(err);
                        } else {
                            assert(!session);
                            assert(result);
                            assert.equal('test1:Hello World, someKey:SomeValue', result);
                            call(index+1, times, cb);
                        }
                    });
                } else {
                    cb();
                }
            }

            call(0, 100, done);
        });

        it('Stop server', (done)=>{
            server.stop((err)=>{
                assert(!err);
                done();
            });
        });

        it('Check server status', (done)=>{
            server.status((err, status)=>{
                assert(!err);
                assert.equal('Stopped', status);
                done();
            });
        });
    });




    describe("Cloud, 2 clusters case.", ()=>{
        let server;
        const app1 = 'sys/tsrc/Pm2.test1.package';
        let config1;
        before(()=>{
            server = new api.dev_tools.ServerDocker();
            config1 = {
                databases: {
                    main: {}
                },
                services: {
                    http: {
                        port:100
                    },
                },
                application: {
                    someKey:'SomeValue'
                },
                scale: {
                    cloud: {
                        name: 'TBR',
                    },
                    clusters: [
                        {
                            id:'c1',
                        },
                        {
                            id:'c2',
                        }
                    ]
                },
                balancer: {
                    periodMs: 60*1000,
                    trackingLengthMs: 24*60*60*1000,
                    logResult: false
                }
            };
        });

        after(()=>{
            server = undefined;
        });

        it('Stop server', (done)=>{
            server.stop((err)=>{
                assert(!err);
                done();
            });
        });

        it('Check server status', (done)=>{
            server.status((err, status)=>{
                assert(!err);
                assert.equal('Stopped', status);
                done();
            });
        });

        it('Add not existing app', (done)=>{
            DB_CRIDENTIALS.database = 'not_existing';
            config1.databases.main = DB_CRIDENTIALS;
            server.addApp('notExistingApp', __dirname + '/notExistingApp/', config1, (err)=>{
                assert(err);
                done();
            });
        });

        it('Add ' + app1 + ' app', (done)=>{
            DB_CRIDENTIALS.database = app1.split('/').join('_');
            config1.databases.main = DB_CRIDENTIALS;
            config1.services.http.port = 10000;
            server.addApp(app1, __dirname + '/Pm2.test1.package/', config1, (err)=>{
                assert(!err);
                done();
            });
        });

        it('Start server', (done)=>{
            server.start((err)=>{
                assert(!err);
                done();
            });
        });

        it('Check server server is running', (done)=>{
            server.status((err, status)=>{
                assert(!err);
                assert.equal('Running', status);
                done();
            });
        });

        it('Make ' + app1 + 'call for many times', (done)=>{
            const call = (index, times, cb)=>{
                if(index<times) {
                    const url = server.application(app1).peekUrl();
                    ajax.get(undefined, url, undefined, undefined, undefined, (err, session, result)=>{
                        if(err) {
                            cb(err);
                        } else {
                            assert(!session);
                            assert(result);
                            assert.equal('test1:Hello World, someKey:SomeValue', result);
                            call(index+1, times, cb);
                        }
                    });
                } else {
                    cb();
                }
            }

            call(0, 100, done);
        });

        it('Stop server', (done)=>{
            server.stop((err)=>{
                assert(!err);
                done();
            });
        });

        it('Check server status', (done)=>{
            server.status((err, status)=>{
                assert(!err);
                assert.equal('Stopped', status);
                done();
            });
        });
    });




    describe("Cloud, app1 - 2 clusters, app2 - 4 clusters  case.", ()=>{
        let server;
        const app1 = 'sys/tsrc/Pm2.test1.package';
        let config1;
        const app2 = 'sys/tsrc/Pm2.test2.package';
        let config2;
        before(()=>{
            server = new api.dev_tools.ServerDocker();
            config1 = {
                databases: {
                    main: {}
                },
                services: {
                    http: {
                        port:100
                    },
                },
                application: {
                    someKey:'SomeValue'
                },
                scale: {
                    cloud: {
                        name: 'TBR',
                    },
                    clusters: [
                        {
                            id:'c1',
                        },
                        {
                            id:'c2',
                        }
                    ]
                },
                balancer: {
                    periodMs: 60*1000,
                    trackingLengthMs: 24*60*60*1000,
                    logResult: false
                }
            };
            config2 = {
                databases: {
                    main: {}
                },
                services: {
                    http: {
                        port:100
                    },
                },
                application: {
                    someKey:100500
                },
                scale: {
                    cloud: {
                        name: 'TBR',
                    },
                    clusters: [
                        {
                            id:'b1',
                        },
                        {
                            id:'b2',
                        },
                        {
                            id:'b3',
                        },
                        {
                            id:'b4',
                        }
                    ]
                },
                balancer: {
                    periodMs: 60*1000,
                    trackingLengthMs: 24*60*60*1000,
                    logResult: false
                }
            };
        });

        after(()=>{
            server = undefined;
        });

        it('Stop server', (done)=>{
            server.stop((err)=>{
                assert(!err);
                done();
            });
        });

        it('Check server status', (done)=>{
            server.status((err, status)=>{
                assert(!err);
                assert.equal('Stopped', status);
                done();
            });
        });

        it('Add not existing app', (done)=>{
            DB_CRIDENTIALS.database = 'not_existing';
            config1.databases.main = DB_CRIDENTIALS;
            server.addApp('notExistingApp', __dirname + '/notExistingApp/', config1, (err)=>{
                assert(err);
                done();
            });
        });

        it('Add ' + app1 + ' app', (done)=>{
            DB_CRIDENTIALS.database = app1.split('/').join('_');
            config1.databases.main = DB_CRIDENTIALS;
            config1.services.http.port = 10000;
            server.addApp(app1, __dirname + '/Pm2.test1.package/', config1, (err)=>{
                assert(!err);
                done();
            });
        });

        it('Add ' + app2 + ' app', (done)=>{
            DB_CRIDENTIALS.database = app2.split('/').join('_');
            config2.databases.main = DB_CRIDENTIALS;
            config2.services.http.port = 20000;
            server.addApp(app2, __dirname + '/Pm2.test2.package/', config2, (err)=>{
                assert(!err);
                done();
            });
        });

        it('Start server', (done)=>{
            server.start((err)=>{
                assert(!err);
                done();
            });
        });

        it('Check server server is running', (done)=>{
            server.status((err, status)=>{
                assert(!err);
                assert.equal('Running', status);
                done();
            });
        });

        it('Make ' + app1 + 'call for many times', (done)=>{
            const call = (index, times, cb)=>{
                if(index<times) {
                    const url = server.application(app1).peekUrl();
                    ajax.get(undefined, url, undefined, undefined, undefined, (err, session, result)=>{
                        if(err) {
                            cb(err);
                        } else {
                            assert(!session);
                            assert(result);
                            assert.equal('test1:Hello World, someKey:SomeValue', result);
                            call(index+1, times, cb);
                        }
                    });
                } else {
                    cb();
                }
            }

            call(0, 100, done);
        });

        it('Make ' + app2 + 'call for many times', (done)=>{
            const call = (index, times, cb)=>{
                if(index<times) {
                    const url = server.application(app2).peekUrl();
                    ajax.get(undefined, url, undefined, undefined, undefined, (err, session, result)=>{
                        if(err) {
                            cb(err);
                        } else {
                            assert(!session);
                            assert(result);
                            assert.equal('test2:Hello World, someKey:100500', result);
                            call(index+1, times, cb);
                        }
                    });
                } else {
                    cb();
                }
            }

            call(0, 100, done);
        });

        it('Stop server', (done)=>{
            server.stop((err)=>{
                assert(!err);
                done();
            });
        });

        it('Check server status', (done)=>{
            server.status((err, status)=>{
                assert(!err);
                assert.equal('Stopped', status);
                done();
            });
        });
    });

});


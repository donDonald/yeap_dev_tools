'use strict';

describe("yeap_dev_tools.ServerHost, System helper to manipulate server in host case.", ()=>{

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
        api.dev_tools.ServerHost = re('ServerHost')(api);
        api.dev_tools.ajax = re('ajax')(api);
        ajax = api.dev_tools.ajax;
        const yeap_db = require('yeap_db');
        const dbHelpers = yeap_db.mysql.helpers;
        DB_CRIDENTIALS = JSON.parse(JSON.stringify(dbHelpers.DB_CRIDENTIALS));
        server = new api.dev_tools.ServerHost();
    });

    it('Stop server', (done)=>{
        server.stop((err)=>{
            assert(!err, err);
            done();
        });
    });

    it('Check server status', (done)=>{
        server.status((err, status)=>{
            assert(!err, err);
            assert.equal('Stopped', status);
            done();
        });
    });

    it('Add not existing app', (done)=>{
        DB_CRIDENTIALS.database = 'not_existing';
        const config = {
            databases: {
                main: DB_CRIDENTIALS
            },
            services: {
                http: {
                    port:10000
                },
            },
            application: {
            },
            scale: {
                cloud: {
                    name:'TBR',
                },
                clusters: [
                    {
                        id:'a1',
                    }
                ]
            },
            balancer: {
                periodMs: 60*1000,
                trackingLengthMs: 24*60*60*1000,
                logResult: false
            }
        };
        server.addApp('notExistingApp', __dirname + '/notExistingApp/', config, (err)=>{
            assert(err);
            done();
        });
    });

    const app1 = 'sys/tsrc/Pm2.test1.package';
    it('Add ' + app1 + ' app', (done)=>{
        DB_CRIDENTIALS.database = app1.split('/').join('_');
        const config = {
            databases: {
                main: DB_CRIDENTIALS
            },
            services: {
                http: {
                    port:10000
                },
            },
            application: {
            },
            scale: {
                cloud: {
                    name:'TBR',
                },
                clusters: [
                    {
                        id:'a1',
                    }
                ]
            },
            balancer: {
                periodMs: 60*1000,
                trackingLengthMs: 24*60*60*1000,
                logResult: false
            }
        };
        server.addApp(app1, __dirname + '/Pm2.test1.package/', config, (err)=>{
            assert(!err);
            assert.equal(1, server._appList.length);
            const app = server._appList[0];
            assert.equal(__dirname + '/Pm2.test1.package/', app.path);
            done();
        });
    });

    it('Add ' + app1 + ' app again', (done)=>{
        DB_CRIDENTIALS.database = app1.split('/').join('_');
        const config = {
            databases: {
                main: DB_CRIDENTIALS
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
                        id:'a1',
                    }
                ]
            },
            balancer: {
                periodMs: 60*1000,
                trackingLengthMs: 24*60*60*1000,
                logResult: false
            }
        };
        server.addApp(app1, __dirname + '/Pm2.test1.package/', config, (err)=>{
            assert(!err);
            assert.equal(1, server._appList.length);
            const app = server._appList[0];
            assert.equal(__dirname + '/Pm2.test1.package/', app.path);
            done();
        });
    });

    it('Start server', (done)=>{
        server.start((err)=>{
            assert(!err, err);
            done();
        });
    });

    it('Check server server is running', (done)=>{
        server.status((err, status)=>{
            assert(!err, err);
            assert.equal('Running', status);
            done();
        });
    });

    it('Make ' + app1 + 'call', (done)=>{
        const url = server.application(app1).peekUrl();
        ajax.get(undefined, url, undefined, undefined, undefined, (err, session, result)=>{
            assert(!err, err);
            assert(!session);
            assert(result);
            assert.equal('test1:Hello World, someKey:SomeValue', result);
            done();
        });
    });

    it('Stop server', (done)=>{
        server.stop((err)=>{
            assert(!err, err);
            done();
        });
    });

    it('Check server status', (done)=>{
        server.status((err, status)=>{
            assert(!err, err);
            assert.equal('Stopped', status);
            done();
        });
    });

    it('Stop server again', (done)=>{
        server.stop((err)=>{
            assert(!err, err);
            done();
        });
    });

    it('Check server status', (done)=>{
        server.status((err, status)=>{
            assert(!err, err);
            assert.equal('Stopped', status);
            done();
        });
    });

    const app2 = 'sys/tsrc/Pm2.test2.package';
    it('Add ' + app2 + ' app', (done)=>{
        DB_CRIDENTIALS.database = app2.split('/').join('_');
        const config = {
            databases: {
                main: DB_CRIDENTIALS
            },
            services: {
                http: {
                    port:10001
                },
            },
            application: {
                someKey:100500
            },
            scale: {
                cloud: {
                    name:'TBR',
                },
                clusters: [
                    {
                        id:'b1',
                    }
                ]
            },
            balancer: {
                periodMs: 60*1000,
                trackingLengthMs: 24*60*60*1000,
                logResult: false
            }
        };
        server.addApp(app2, __dirname + '/Pm2.test2.package/', config, (err)=>{
            assert(!err);
            assert.equal(2, server._appList.length);
            let app = server._appList[0];
            assert.equal(__dirname + '/Pm2.test1.package/', app.path);
            app = server._appList[1];
            assert.equal(__dirname + '/Pm2.test2.package/', app.path);
            done();
        });
    });

    it('Start server', (done)=>{
        server.start((err)=>{
            assert(!err, err);
            done();
        });
    });

    it('Check server server is running', (done)=>{
        server.status((err, status)=>{
            assert(!err, err);
            assert.equal('Running', status);
            done();
        });
    });

    it('Make ' + app1 + ' call', (done)=>{
        const url = server.application(app1).peekUrl();
        ajax.get(undefined, url, undefined, undefined, undefined, (err, session, result)=>{
            assert(!err, err);
            assert(!session);
            assert(result);
            assert.equal('test1:Hello World, someKey:SomeValue', result);
            done();
        });
    });

    it('Make ' + app2 + ' call', (done)=>{
        const url = server.application(app2).peekUrl();
        ajax.get(undefined, url, undefined, undefined, undefined, (err, session, result)=>{
            assert(!err, err);
            assert(!session);
            assert(result);
            assert.equal('test2:Hello World, someKey:100500', result);
            done();
        });
    });

    it('Stop server', (done)=>{
        server.stop((err)=>{
            assert(!err, err);
            done();
        });
    });

    it('Check server status', (done)=>{
        server.status((err, status)=>{
            assert(!err, err);
            assert.equal('Stopped', status);
            done();
        });
    });
});


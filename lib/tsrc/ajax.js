'use strict';

describe('yeap_dev_tools.ajax', ()=>{

    const assert = require('assert');
    const Pm2 = require('../Pm2.js')(1);

    let api, ajax, pm2, appName;
    before(()=>{
        api = {};
        api.zlib = require('zlib');
        api.stream = require('stream');
        ajax = require('../ajax.js')(api);
        pm2 = Pm2.create();
        appName = 'AjaxTest';
    });

    describe('Start server', ()=>{
        it('Check app status', (done)=>{
            pm2.status(appName, (err, status)=>{
                assert.equal(err, `Given app ${appName} is not even started`);
                assert(!status);
                done();
            });
        });

        it('Start test app', (done)=>{
            pm2.start(appName, {cwd:__dirname+'/ajax.test.server.package'}, (err)=>{
                assert(!err, err);
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
    });


    describe('ajax.json.get', ()=>{
        it('Make ajax.json.get 1 time', (done)=>{
            ajax.json.get(undefined, 'http://localhost:10000', '/', {}, {}, (err, session, result)=>{
                assert(!err, err);
                assert(!session);
                assert(result);
                assert.equal(typeof result, 'object');
                assert.equal(result.value, 'SomeValue-0');
                done();
            });
        });

        it('Make ajax.json.get 10 more time', (done)=>{
            let value = 1;
            const call = (index, times, cb)=>{
                if(index<times) {
                    ajax.json.get(undefined, 'http://localhost:10000', '/', {}, {}, (err, session, result)=>{
                        if(err) {
                            cb(err);
                        } else {
                            assert(!session);
                            assert(result);
                            assert.equal(typeof result, 'object');
                            assert.equal(result.value, `SomeValue-${value++}`);
                            call(index+1, times, cb);
                        }
                    });
                } else {
                    cb();
                }
            }

            call(0, 10, (err)=>{
                assert(!err);
                done();
            });
        });
    });

    describe('Make ajax.json.delete', ()=>{
        it('Make ajax.json.post 1 time', (done)=>{
            const data = {
                value:'NewValue'
            };
            ajax.json.post(undefined, 'http://localhost:10000', '', {}, data, (err, session, result)=>{
                assert(!err, err);
                assert(!session);
                assert(result);
                assert.equal(typeof result, 'object');
                assert.equal(result.value, 'NewValue-11');
                done();
            });
        });

        it('Make ajax.json.post 10 times', (done)=>{
            const call = (index, times, cb)=>{
                if(index<times) {
                    const data = {
                        value:'SuperNewValue'
                    };
                    data.value = `${data.value}-${index}`
                    ajax.json.post(undefined, 'http://localhost:10000', '', {}, data, (err, session, result)=>{
                        assert(!err, err);
                        assert(!session);
                        assert(result);
                        assert.equal(typeof result, 'object');
                        assert.equal(result.value, `SuperNewValue-${index}-${12+index}`);
                        done();
                    });
                } else {
                    cb();
                }
            }

            call(0, 10, (err)=>{
                assert(!err);
                done();
            });
        });
    });

    describe('Start server', ()=>{
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
    });
});













if(0) {
const libRe = (module)=>{ return require('../../' + module); }

const api                              = {};
api.lib                                = {};

/*
libRe('core/builtins.js')(api);

api.lib.log                            = libRe('core/log.js');
api.lib.core                           = libRe('core/exports.js');

api.lib.db                             = {};
api.lib.db.Connection                  = libRe('db/Connection.js')(api);
api.lib.db.helpers                     = libRe('db/helpers.js')(api);

api.lib.sys                            = {};
api.lib.sys.hosts                      = libRe('sys/hosts.js')(api);

api.lib.sys.ias                        = {};
api.lib.sys.ias.scale                  = libRe('sys/ias.scale.js')(api);

api.lib.tools                          = {};
api.lib.tools.ajax                     = libRe('tools/ajax.js')(api);

//----------------------------------------------------------------------------

const server                           = libRe('sys/server.host.js')(api);
const APP_NAME                         = 'structures/test';

//----------------------------------------------------------------------------
*/
describe('lib.tools.ajax, AJAX helper.', ()=>{

//  describe('Get server up since AJAX tests need the server, to be reviewed!', ()=>{
//      it('Stop server', (done)=>{
//          api.lib.log.warning('Get server up since AJAX tests need the server, to be reviewed!');
//          server.stop((err)=>{
//              assert(!err, 'Server.stop() has failed:' + err);
//              done();
//          });
//      });

//      it('Unlink all apps', (done)=>{
//          server.removeAllApps((err)=>{
//              assert(!err, 'Server.removeAllApps() has failed: ' + err);
//              done();
//          });
//      });

//      it('Link test app', (done)=>{
//          const properties = {
//              databases: [
//                  {
//                      alias: 'dbmain',
//                      user:  'root',
//                      host:  'localhost',
//                      name:  'dbTest1',
//                  }
//              ]
//          };
//          server.addApp(APP_NAME, properties, (err)=>{
//              if(err) {
//                  api.lib.log.error('Server.addApp() has failed:' + err);
//              }
//              assert(!err, 'Server.addApp() has failed:' + err);
//              done();
//          });
//      });

//      it('Start server', (done)=>{
//          server.start((err)=>{
//              if(err) {
//                  api.lib.log.error('Server.start() has failed:' + err);
//              }
//              assert(!err, 'Server.start() has failed:' + err);
//              done();
//          });
//      });
//  });

    describe('Parsing cookies.', ()=>{
        it('ajax.json.get', (done)=>{
            api.zlib = {};
            api.stream = {};
            const ajax = libRe('lib/ajax.js')(api);
            const session = ['__Host-GAPS=1:eiE6IfJJGwb0JZbVLUVuKSUZ_uxlow:q_GRlA_68LmLY0Av;Path=/;Expires=Thu, 07-Dec-2023 11:20:18 GMT;Secure;HttpOnly;Priority=HIGH'];
            const cookies = ajax.parseCookies(session);
            console.log('parsed cookies:');
            console.log(cookies);
            done();
        });
    });
/*
    describe('Test ajax itself.', ()=>{
        it('ajax.json.get', (done)=>{
            api.lib.tools.ajax.json.get(undefined, server.application(APP_NAME).peekUrl(), 'ajax.json', {}, {}, (err, session, result)=>{
                assert(!err);
                assert(!session);
                assert(result);
                assert.equal('This is some value.', result.someValue);
                assert.notEqual('This is NOT some value.', result.someValue);
                done();
            });
        });

        it('ajax.json.get, ajax.2.json', (done)=>{
            api.lib.tools.ajax.json.get(undefined, server.application(APP_NAME).peekUrl(), 'ajax.2.json', {}, {}, (err, session, result)=>{
                assert(!err);
                assert(!session);
                assert(result);
                done();
            });
        });

        it('ajax.json.post', (done)=>{
            api.lib.tools.ajax.json.post(undefined, server.application(APP_NAME).peekUrl(), 'ajax.json', {}, { testString: "Hello" }, (err, session, result)=>{
                assert(!err);
                assert(!session);
                assert(result);
                assert.equal('Hello', result.youPosted);
                done();
            });
        });
    });
*/

//  describe('Shutdown server.', ()=>{
//      it('Stop server', (done)=>{
//          server.stop((err)=>{
//              assert(!err, 'Server.stop() has failed:' + err);
//              done();
//          });
//      });
//  });
});



} // if(0)


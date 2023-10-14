'use strict';

describe('yeap_dev_tools.ajax AJAX helper', ()=>{

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




    describe('Parsing cookies.', ()=>{
        it('ajax.json.get', ()=>{
            const session = ['__Host-GAPS=1:eiE6IfJJGwb0JZbVLUVuKSUZ_uxlow:q_GRlA_68LmLY0Av;Path=/;Expires=Thu, 07-Dec-2023 11:20:18 GMT;Secure;HttpOnly;Priority=HIGH'];
            const cookies = ajax.parseCookies(session);
//          console.log('parsed cookies:');
//          console.log(cookies);

//          assert.equal(cookies.creation: 2023-10-14T18:45:36.366Z);
            assert.equal(cookies.key, '__Host-GAPS');
            assert.equal(cookies.value, '1:eiE6IfJJGwb0JZbVLUVuKSUZ_uxlow:q_GRlA_68LmLY0Av');
            assert.equal(cookies.path, '/');
//          assert.equal(cookies.expires: 2023-12-07T11:20:18.000Z,
            assert.equal(cookies.secure, true);
            assert.equal(cookies.httpOnly, true);
            //assert.equal(cookies.extensions, [ 'Priority=HIGH' ]);
        });
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




    describe('ajax.text', ()=>{
        describe('ajax.text.get', ()=>{
            it('Make ajax.text.get 1 time', (done)=>{
                ajax.text.get(undefined, 'http://localhost:10000', 'text', {}, {}, (err, session, result)=>{
                    assert(!err, err);
                    assert(!session);
                    assert(result);
                    assert.equal(typeof result, 'string');
                    assert.equal(result, '{"value":"GetValue-0"}');
                    done();
                });
            });

            it('Make ajax.text.get 10 more time', (done)=>{
                const call = (index, times, cb)=>{
                    if(index<times) {
                        ajax.text.get(undefined, 'http://localhost:10000', 'text', {}, {}, (err, session, result)=>{
                            if(err) {
                                cb(err);
                            } else {
                                assert(!session);
                                assert(result);
                                assert.equal(typeof result, 'string');
                                assert.equal(result, `{"value":"GetValue-${index+1}"}`);
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

            it('Server returns http error', (done)=>{
                ajax.text.get(undefined, 'http://localhost:10000', 'text/error500', {}, {}, (err, session, result)=>{
                    assert(err);
                    assert.equal(500, err);
                    assert(!session);
                    assert(result);
                    assert.equal(result, 'Error 500 has happend');
                    done();
                });
            });
        });




        describe('ajax.text.post', ()=>{
            it('Make ajax.text.post 1 time', (done)=>{
                const data = {
                    value:'PostValue'
                };
                ajax.text.post(undefined, 'http://localhost:10000', 'text', {}, data, (err, session, result)=>{
                    assert(!err, err);
                    assert(!session);
                    assert(result);
                    assert.equal(typeof result, 'string');
                    assert.equal(result, '{"value":"PostValue-0"}');
                    done();
                });
            });

            it('Make ajax.text.text.post 10 times', (done)=>{
                const call = (index, times, cb)=>{
                    if(index<times) {
                        const data = {
                            value:'SuperPostValue'
                        };
                        ajax.text.post(undefined, 'http://localhost:10000', 'text', {}, data, (err, session, result)=>{
                            assert(!err, err);
                            assert(!session);
                            assert(result);
                            assert.equal(typeof result, 'string');
                            assert.equal(result, `{"value":"SuperPostValue-${index+1}"}`);
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

            it('Server returns http error', (done)=>{
                ajax.text.post(undefined, 'http://localhost:10000', 'text/error500', {}, {}, (err, session, result)=>{
                    assert(err);
                    assert.equal(500, err);
                    assert(!session);
                    assert(result);
                    assert.equal(result, 'Error 500 has happend');
                    done();
                });
            });
        });




        describe('ajax.text.delete', ()=>{
            it('Make ajax.text.delete 1 time', (done)=>{
                ajax.text.delete(undefined, 'http://localhost:10000', 'text', {}, {}, (err, session, result)=>{
                    assert(!err, err);
                    assert(!session);
                    assert(result);
                    assert.equal(typeof result, 'string');
                    assert.equal(result, '{"value":"DeleteValue-0"}');
                    done();
                });
            });

            it('Make ajax.text.delete 10 times', (done)=>{
                const call = (index, times, cb)=>{
                    if(index<times) {
                        ajax.text.delete(undefined, 'http://localhost:10000', 'text', {}, {}, (err, session, result)=>{
                            assert(!err, err);
                            assert(!session);
                            assert(result);
                            assert.equal(typeof result, 'string');
                            assert.equal(result, `{"value":"DeleteValue-${index+1}"}`);
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

            it('Server returns http error', (done)=>{
                ajax.text.delete(undefined, 'http://localhost:10000', 'text/error500', {}, {}, (err, session, result)=>{
                    assert(err);
                    assert.equal(500, err);
                    assert(!session);
                    assert(result);
                    assert.equal(result, 'Error 500 has happend');
                    done();
                });
            });
        });
    });




    describe('ajax.json', ()=>{
        describe('ajax.json.get', ()=>{
            it('Make ajax.json.get 1 time', (done)=>{
                ajax.json.get(undefined, 'http://localhost:10000', 'json', {}, {}, (err, session, result)=>{
                    assert(!err, err);
                    assert(!session);
                    assert(result);
                    assert.equal(typeof result, 'object');
                    assert.equal(result.value, 'GetValue-0');
                    done();
                });
            });

            it('Make ajax.json.get 10 more time', (done)=>{
                const call = (index, times, cb)=>{
                    if(index<times) {
                        ajax.json.get(undefined, 'http://localhost:10000', 'json', {}, {}, (err, session, result)=>{
                            if(err) {
                                cb(err);
                            } else {
                                assert(!session);
                                assert(result);
                                assert.equal(typeof result, 'object');
                                assert.equal(result.value, `GetValue-${index+1}`);
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

            it('Server returns http error', (done)=>{
                ajax.json.get(undefined, 'http://localhost:10000', 'json/error500', {}, {}, (err, session, result)=>{
                    assert(err);
                    assert.equal(500, err);
                    assert(!session);
                    assert(result);
                    assert.equal(result, 'Error 500 has happend');
                    done();
                });
            });
        });




        describe('ajax.json.post', ()=>{
            it('Make ajax.json.post 1 time', (done)=>{
                const data = {
                    value:'PostValue'
                };
                ajax.json.post(undefined, 'http://localhost:10000', 'json', {}, data, (err, session, result)=>{
                    assert(!err, err);
                    assert(!session);
                    assert(result);
                    assert.equal(typeof result, 'object');
                    assert.equal(result.value, 'PostValue-0');
                    done();
                });
            });

            it('Make ajax.json.post 10 times', (done)=>{
                const call = (index, times, cb)=>{
                    if(index<times) {
                        const data = {
                            value:'SuperPostValue'
                        };
                        ajax.json.post(undefined, 'http://localhost:10000', 'json', {}, data, (err, session, result)=>{
                            assert(!err, err);
                            assert(!session);
                            assert(result);
                            assert.equal(typeof result, 'object');
                            assert.equal(result.value, `SuperPostValue-${index+1}`);
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

            it('Server returns http error', (done)=>{
                ajax.json.post(undefined, 'http://localhost:10000', 'json/error500', {}, {}, (err, session, result)=>{
                    assert(err);
                    assert.equal(500, err);
                    assert(!session);
                    assert(result);
                    assert.equal(result, 'Error 500 has happend');
                    done();
                });
            });
        });




        describe('ajax.json.delete', ()=>{
            it('Make ajax.json.delete 1 time', (done)=>{
                ajax.json.delete(undefined, 'http://localhost:10000', 'json', {}, {}, (err, session, result)=>{
                    assert(!err, err);
                    assert(!session);
                    assert(result);
                    assert.equal(typeof result, 'object');
                    assert.equal(result.value, 'DeleteValue-0');
                    done();
                });
            });

            it('Make ajax.json.delete 10 times', (done)=>{
                const call = (index, times, cb)=>{
                    if(index<times) {
                        ajax.json.delete(undefined, 'http://localhost:10000', 'json', {}, {}, (err, session, result)=>{
                            assert(!err, err);
                            assert(!session);
                            assert(result);
                            assert.equal(typeof result, 'object');
                            assert.equal(result.value, `DeleteValue-${index+1}`);
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

            it('Server returns http error', (done)=>{
                ajax.json.delete(undefined, 'http://localhost:10000', 'json/error500', {}, {}, (err, session, result)=>{
                    assert(err);
                    assert.equal(500, err);
                    assert(!session);
                    assert(result);
                    assert.equal(result, 'Error 500 has happend');
                    done();
                });
            });
        });
    });




    describe('Stop server', ()=>{
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



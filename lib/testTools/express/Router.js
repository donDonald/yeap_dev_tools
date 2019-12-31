'user string';

const assert = require('assert');

module.exports = function () {

/*
    //https://expressjs.com/en/guide/routing.html
    //https://flaviocopes.com/express-validate-input/
    //https://express-validator.github.io/docs/check-api.html
    const Router = function() {
        this.routes = {};

        this.get = function(route, handler, next) {
            this.routes[route] = {handler:handler, next:next};
        }

        this.handleRoute = function(route, req, res, next) {
//          console.log('testTools.express.Router.handleRoute(), route:' + route);

            const r = this.routes[route];
            assert(r);
            assert(r.handler);
//          assert(r.next);

            const self = this;
            const handleMw = function(index, mws, cb) {
                if (index<mws.length) {
                    const mw = self.mws[index];
                    mw(req, res, (err)=>{
//                      console.log('testTools.express.Router.handleRoute(), handling mw No:' + index);
//                      console.log('testTools.express.Router.handleRoute(), req:', req);
                        if (err) {
                            assert(false);
                        } else {
                            handleMw(index+1, mws, cb);
                        }
                    });
                } else {
                    cb();
                }
            }

            handleMw(0, this.mws, ()=>{
                self.handle(r.handler, req, res, r.next);
            });
        }

        this.handle = function(handler, req, res, next) {

            const handleArray = function (index, array, cb) {
                if (index < array.length) {
                    const h = array[index];
                    h(req, res, (err)=>{
                        assert(!err)
                        handleArray(index+1, array, cb);
                    });
                } else {
                    cb();
                }
            }

            if (Array.isArray(handler)) {
                const self = this;
                handleArray(0, handler, ()=>{
                    if(next) {
                        setImmediate(()=>{ next(req, res, next); });
                    } else {
                        setImmediate(next);
                    }
                });
            } else {
                handler(req, res, next);
            }
        }


        // Setup mw for req, like express does
        // Check node_modules/passport/lib/middleware/initialize.js
        this.mws = [];

        this.use = function(mw) {
//          console.log('testTools.express.Router.use(), typeof mw:' + typeof mw);
            assert(mw);
            assert.equal('function', typeof mw);
            this.mws.push(mw);
        }
    }
*/
    //https://expressjs.com/en/guide/routing.html
    //https://flaviocopes.com/express-validate-input/
    //https://express-validator.github.io/docs/check-api.html
    const Router = function() {
        this.routes = {};

        this.get = function(route, a, b, c, d) {
            const handlers = [];
            if (a) {
                const v = a;
                if (Array.isArray(v)) {
                    v.forEach((h)=>{handlers.push(h);});
                } else {
                    handlers.push(v);
                }
            }
            if (b) {
                const v = b;
                if (Array.isArray(v)) {
                    v.forEach((h)=>{handlers.push(h);});
                } else {
                    handlers.push(v);
                }
            }
            if (c) {
                const v = c;
                if (Array.isArray(v)) {
                    v.forEach((h)=>{handlers.push(h);});
                } else {
                    handlers.push(v);
                }
            }
            if (d) {
                const v = d;
                if (Array.isArray(v)) {
                    v.forEach((h)=>{handlers.push(h);});
                } else {
                    handlers.push(v);
                }
            }

            this.routes[route] = {handlers:handlers};
//console.log(`AAAAA, handlers.length:${handlers.length}`);
        }

        this.handleRoute = function(route, req, res, next) {
//          console.log('testTools.express.Router.handleRoute(), route:' + route);

            const r = this.routes[route];
            assert(r);
            assert(r.handlers);

            const self = this;
            const runMw = function(index, mws, cb) {
                if (index<mws.length) {
                    const mw = self.mws[index];
                    mw(req, res, (err)=>{
//                      console.log('testTools.express.Router.handleRoute(), handling mw No:' + index);
//                      console.log('testTools.express.Router.handleRoute(), req:', req);
                        if (err) {
                            assert(false);
                        } else {
                            runMw(index+1, mws, cb);
                        }
                    });
                } else {
                    cb();
                }
            }

            const runHandlers = function(index, handlers, req, res, cb) {
//console.log(`BBBBB, runHandlers, index:${index}, length:${handlers.length}`);
                if (index<handlers.length) {
                    const h = handlers[index];
//console.log(`CCCCC, handler[${index}]`);
                    h(req, res, (err)=>{
//console.log(`DDDDD, handler[${index}]: err:${err}`);
                        runHandlers(index+1, handlers, req, res, cb);
                    });
                } else {
                    cb();
                }
            }

            runMw(0, this.mws, ()=>{
                runHandlers(0, r.handlers, req, res, ()=>{
console.log(`ZZZZZ`);
                });
            });
        }

//      this.handle = function(handler, req, res, next) {

//          const handleArray = function (index, array, cb) {
//              if (index < array.length) {
//                  const h = array[index];
//                  h(req, res, (err)=>{
//                      assert(!err)
//                      handleArray(index+1, array, cb);
//                  });
//              } else {
//                  cb();
//              }
//          }

//          if (Array.isArray(handler)) {
//              const self = this;
//              handleArray(0, handler, ()=>{
//                  if(next) {
//                      setImmediate(()=>{ next(req, res, next); });
//                  } else {
//                      setImmediate(next);
//                  }
//              });
//          } else {
//              handler(req, res, next);
//          }
//      }


        // Setup mw for req, like express does
        // Check node_modules/passport/lib/middleware/initialize.js
        this.mws = [];

        this.use = function(mw) {
//          console.log('testTools.express.Router.use(), typeof mw:' + typeof mw);
            assert(mw);
            assert.equal('function', typeof mw);
            this.mws.push(mw);
        }
    }

    return Router;
}


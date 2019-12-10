'user string';

const assert = require('assert');

module.exports = function () {

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
            assert(r.next);

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

    return Router;
}


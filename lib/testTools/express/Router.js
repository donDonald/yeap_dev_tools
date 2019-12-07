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
            const r= this.routes[route];
            assert(r);
            assert(r.handler);
            assert(r.next);
            this.handle(r.handler, req, res, r.next);
        }

        this.handle = function(handler, req, res, next) {

            const handle = function (index, array, cb) {
                if (index < array.length) {
                    const h = array[index];
                    h(req, res, (err)=>{
                        assert(!err)
                        handle(index+1, array, cb);
                    });
                } else {
                    cb();
                }
            }

            if (Array.isArray(handler)) {
                const self = this;
                handle(0, handler, ()=>{
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
    }

    return Router;
}


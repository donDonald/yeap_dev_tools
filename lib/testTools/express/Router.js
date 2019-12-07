'user string';

const assert = require('assert');

module.exports = function () {

    //https://expressjs.com/en/guide/routing.html
    //https://flaviocopes.com/express-validate-input/
    //https://express-validator.github.io/docs/check-api.html
    const Router = function() {
        this.routes = {};
        this.next;

        this.get = function(route, handler, next) {
            this.routes[route] = handler;
            this.next = next;
        }

        this.handleRoute = function(route, req, res, next) {
            const handler = this.routes[route];
            assert(handler);
            this.handle(handler, req, res, next);
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
                    if(self.next) {
                        setImmediate(()=>{ self.next(req, res, next); });
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


'user string';

const assert = require('assert');

module.exports = function () {

//  const logIn = require('passport/lib/http/request.js'); 

    const Request = function(query) {
        this.query = query;

        // Check node_modules/passport/lib/http/request.js
        this.logIn = function(user, options, done) {
            if (typeof options == 'function') {
                done = options;
                options = {};
            }
            options = options || {};

            let property = 'user';
            if (this._passport && this._passport.instance) {
                property = this._passport.instance._userProperty || 'user';
            }
            let session = (options.session === undefined) ? true : options.session;

            this[property] = user;
            if (session) {
                if (!this._passport) { throw new Error('passport.initialize() middleware not in use'); }
                if (typeof done != 'function') { throw new Error('req#login requires a callback function'); }

                var self = this;
                this._passport.instance._sm.logIn(this, user, function(err) {
                  if (err) { self[property] = null; return done(err); }
                  done();
                });
            } else {
                done && done();
            }
        };
    }

    return Request;
}


'use strict';

(function() {

const assert = require('assert');
const request = require('request');
const tough  = require('tough-cookie');
const qs = require('querystring');

//----------------------------- AJAX tool  -----------------------------------

module.exports = function(api) {
    assert(api);

    // Use IAS builtin module
    assert(api.zlib, 'api.zlib is not set');

    // Use IAS builtin module
    assert(api.stream, 'api.stream is not set');

    function streamToString(stream, cb) {
        const chunks = [];
        stream.on('data', (chunk) => {
            chunks.push(chunk);
        });
        stream.on('end', () => {
            cb(chunks.join(''));
        });
    }

    function streamToJson(stream, cb) {
        const chunks = [];
        stream.on('data', (chunk) => {
            chunks.push(chunk);
        });
        stream.on('end', () => {
            const str = chunks.join('');
            if (str.length == 0) {
                cb();
            } else {
                const json = JSON.parse(str);
                cb(json);
            }
        });
    }

    const Ajax = function() {
        this.json = {};
        this.text = {};

        this.parseCookies = function (session) {
//          let cookies;
//          if (session) {
//              cookies = [];
//              session.forEach((s)=>{
//                  const cookie = tough.parse(s);
//                  assert(cookie.key);
//                  assert(cookie.value);
//                  cookies.push({key:cookie.key, value:cookie.value});
//              });
//          }
//          return cookies;
            let cookies;
            if (session) {
                cookies = {};
                session.forEach((s)=>{
                    const cookie = tough.parse(s);
                    for (const [key, value] of Object.entries(cookie)) {
                        //console.log(`${key}: ${value}`);
                        cookies[key] = value;
                    }
                });
            }
            return cookies;
        }




        this.serializeCookies = function (cookies, dst) {
        }




        this.createSession = function(cookies) {
            let session;
            if (cookies) {
                session = {};
                session.cookiesOriginal = cookies;
                session.cookies = this.parseCookies(cookies);
            }
    //      api.lib.log.debug('createSession(), session:'); api.lib.log.dir(session);
            return session;
        }




        // Plain text AJAX
        this.text.get = function(session, domain, url, params, data, cb) {
//          api.lib.log.debug('ajax.get()');

            const headers = {
                "user-agent": "kz",
                "content-type":"application/text; charset=UTF-8",
                "accept-charset": "utf-8",
                "accept-encoding": "gzip,deflate",
                "connection": "close",
            };
            if (session) {
                assert(session.cookiesOriginal);
                headers['Cookie'] = session.cookiesOriginal;
            }

            let zl = null;

            const options = {
                url: domain + '/' + url,
                method: 'GET',
                headers: headers,
                qs: params,
            }

            request(options, (err, res, body)=>{
//              console.log("ajax.text.get, err:");
//              console.dir(err);
//              console.log("ajax.text.get, res.statusCode:" + res.statusCode);
//              console.log("ajax.text.get, res.statusMessage:" + res.statusMessage);
//              console.log("ajax.text.get, typeof body:" + typeof body);
//              console.log("ajax.text.get, body:");
//              console.log(body);

                if(res.statusCode !== 200) {
                    cb(res.statusCode, undefined, body);
                    return;
                }

                const cookies = res.headers['set-cookie'];
                if (cookies) {
                    session = createSession(cookies);
                } else {
                    session = undefined;
                }

                const encoding = res.headers['content-encoding'];
//              console.log('encoding: ' + encoding);
                if (encoding == 'gzip') {
                    zl = api.zlib.createGunzip();
                    streamToString(res, function(str) {
                        cb(undefined, session, str);
                    });
                    res.pipe(zl);
                } else if (encoding == 'deflate') {
                    zl = api.zlib.createInflate();
                    streamToString(res, function(str) {
                        cb(undefined, session, str);
                    });
                    res.pipe(zl);
                } else {
                    cb(undefined, session, body);
                }
            });
        }




        this.text.post = function(session, domain, url, params, data, cb) {
//          api.lib.log.debug(`ajax.post(), domain:${domain}, url:${url}`);

            const headers = {
                "user-agent": "kz",
                "content-type":"application/text; charset=UTF-8",
                "accept-charset": "utf-8",
                "accept-encoding": "gzip,deflate",
                "connection": "close",
            };

            if (session) {
                assert(session.cookiesOriginal);
                headers['Cookie'] = session.cookiesOriginal;
            }

            let zl = null;

            const options = {
                url: domain + '/' + url,
                method: 'POST',
                headers: headers,
                qs: params,
                body: JSON.stringify(data),
            }

            request(options, (err, res, body)=>{
//              console.log("ajax.text.post, err:");
//              console.dir(err);
//              console.log("ajax.text.post, res.statusCode:" + res.statusCode);
//              console.log("ajax.text.post, res.statusMessage:" + res.statusMessage);
//              console.log("ajax.text.post, typeof body:" + typeof body);
//              console.log("ajax.text.post, body:");
//              console.log(body);

                if(res.statusCode !== 200) {
                    cb(res.statusCode, undefined, body);
                    return;
                }

                const cookies = res.headers['set-cookie'];
                if (cookies) {
                    session = createSession(cookies);
                } else {
                    session = undefined;
                }

                const encoding = res.headers['content-encoding'];
//              console.log('encoding: ' + encoding);
                if (encoding == 'gzip') {
                    zl = api.zlib.createGunzip();
                    streamToString(res, function(str) {
                        cb(undefined, session, str);
                    });
                    res.pipe(zl);
                } else if (encoding == 'deflate') {
                    zl = api.zlib.createInflate();
                    streamToString(res, function(str) {
                        cb(undefined, session, str);
                    });
                    res.pipe(zl);
                } else {
                    cb(undefined, session, body);
                }
            });
        }



        this.text.delete = function(session, domain, url, params, data, cb) {
//          api.lib.log.debug(`ajax.text.delete(), domain:${domain}, url:${url}`);
            const headers = {
                "user-agent": "kz",
                "content-type":"application/text; charset=UTF-8",
                "accept-charset": "utf-8",
                "accept-encoding": "gzip,deflate",
                "connection": "close",
            };

            if (session) {
                assert(session.cookiesOriginal);
                headers['Cookie'] = session.cookiesOriginal;
            }

            let zl = null;

            const options = {
                url: domain + '/' + url,
                method: 'DELETE',
                headers: headers,
                qs: params,
            }

            request(options, (err, res, body)=>{
//              console.log("ajax.text.delete, err:");
//              console.dir(err);
//              console.log("ajax.text.delete, res.statusCode:" + res.statusCode);
//              console.log("ajax.text.delete, res.statusMessage:" + res.statusMessage);
//              console.log("ajax.text.delete, typeof body:" + typeof body);
//              console.log("ajax.text.delete, body:");
//              console.log(body);

                if(res.statusCode !== 200) {
                    cb(res.statusCode, undefined, body);
                    return;
                }

                const cookies = res.headers['set-cookie'];
                if (cookies) {
                    session = createSession(cookies);
                } else {
                    session = undefined;
                }

                const encoding = res.headers['content-encoding'];
//              console.log('encoding: ' + encoding);
                if (encoding == 'gzip') {
                    zl = api.zlib.createGunzip();
                    streamToString(res, function(str) {
                        cb(undefined, session, str);
                    });
                    res.pipe(zl);
                } else if (encoding == 'deflate') {
                    zl = api.zlib.createInflate();
                    streamToString(res, function(str) {
                        cb(undefined, session, str);
                    });
                    res.pipe(zl);
                } else {
                    cb(undefined, session, body);
                }
            });
        }




        // JSON AJAX
        this.json.get = function(session, domain, url, params, data, cb) {
//          api.lib.log.debug(`ajax.json.get(), domain:${domain}, url:${url}`);
            const headers = {
                "user-agent": "kz",
                "accept-encoding": "gzip,deflate",
                "connection": "close"
            };

            if (session) {
                assert(session.cookiesOriginal);
                headers['Cookie'] = session.cookiesOriginal;
            }

            let zl = null;

            const options = {
                url: domain + '/' + url,
                method: 'GET',
                headers: headers,
                qs: params,
            }

            request(options, (err, res, body)=>{
//              console.log("ajax.json.get, err:");
//              console.dir(err);
//              console.log("ajax.json.get, res.statusCode:" + res.statusCode);
//              console.log("ajax.json.get, res.statusMessage:" + res.statusMessage);
//              console.log("ajax.json.get, typeof body:" + typeof body);
//              console.log("ajax.json.get, body:");
//              console.log(body);

                if(res.statusCode !== 200) {
                    cb(res.statusCode, undefined, body);
                    return;
                }

                const cookies = res.headers['set-cookie'];
                if (cookies) {
                    session = createSession(cookies);
                } else {
                    session = undefined;
                }

                const encoding = res.headers['content-encoding'];
//              console.log('encoding: ' + encoding);
                if (encoding == 'gzip') {
                    zl = api.zlib.createGunzip();
                    streamToJson(res, function(json) {
                        cb(undefined, session, json);
                    });
                    res.pipe(zl);
                } else if (encoding == 'deflate') {
                    zl = api.zlib.createInflate();
                    streamToJson(res, function(json) {
                        cb(undefined, session, json);
                    });
                    res.pipe(zl);
                } else {
                    const json = JSON.parse(body);
                    cb(undefined, session, json);
                }
            });
        }




        this.json.post = function(session, domain, url, params, data, cb) {
//          api.lib.log.debug(`ajax.json.post(), domain:${domain}, url:${url}`);
            const headers = {
                "user-agent": "kz",
                "content-type":"application/json; charset=UTF-8",
                "accept-charset": "utf-8",
                "accept-encoding": "gzip,deflate",
                "connection": "close",
            };

            if (session) {
                assert(session.cookiesOriginal);
                headers['Cookie'] = session.cookiesOriginal;
            }

            let zl = null;

            const options = {
                url: domain + '/' + url,
                method: 'POST',
                headers: headers,
                qs: params,
                body: JSON.stringify(data),
            }

            request(options, (err, res, body)=>{
//              console.log("ajax.json.post, err:");
//              console.dir(err);
//              console.log("ajax.json.post, res.statusCode:" + res.statusCode);
//              console.log("ajax.json.post, res.statusMessage:" + res.statusMessage);
//              console.log("ajax.json.post, typeof body:" + typeof body);
//              console.log("ajax.json.post, body:");
//              console.log(body);

                if(res.statusCode !== 200) {
                    cb(res.statusCode, undefined, body);
                    return;
                }

                const cookies = res.headers['set-cookie'];
                if (cookies) {
                    session = createSession(cookies);
                } else {
                    session = undefined;
                }

                const encoding = res.headers['content-encoding'];
//              console.log('encoding: ' + encoding);
                if (encoding == 'gzip') {
                    zl = api.zlib.createGunzip();
                    streamToJson(res, function(json) {
                        cb(undefined, session, json);
                    });
                    res.pipe(zl);
                } else if (encoding == 'deflate') {
                    zl = api.zlib.createInflate();
                    streamToJson(res, function(json) {
                        cb(undefined, session, json);
                    });
                    res.pipe(zl);
                } else {
                    const json = JSON.parse(body);
                    cb(undefined, session, json);
                }
            });
        }




        this.json.delete = function(session, domain, url, params, data, cb) {
//          api.lib.log.debug(`ajax.json.delete(), domain:${domain}, url:${url}`);
            const headers = {
                "user-agent": "kz",
                "content-type":"application/json; charset=UTF-8",
                "accept-charset": "utf-8",
                "accept-encoding": "gzip,deflate",
                "connection": "close",
            };

            if (session) {
                assert(session.cookiesOriginal);
                headers['Cookie'] = session.cookiesOriginal;
            }

            let zl = null;

            const options = {
                url: domain + '/' + url,
                method: 'DELETE',
                headers: headers,
                qs: params,
            }

            request(options, (err, res, body)=>{
//              console.log("ajax.json.delete, err:");
//              console.dir(err);
//              console.log("ajax.json.delete, res.statusCode:" + res.statusCode);
//              console.log("ajax.json.delete, res.statusMessage:" + res.statusMessage);
//              console.log("ajax.json.delete, typeof body:" + typeof body);
//              console.log("ajax.json.delete, body:");
//              console.log(body);

                if(res.statusCode !== 200) {
                    cb(res.statusCode, undefined, body);
                    return;
                }

                const cookies = res.headers['set-cookie'];
                if (cookies) {
                    session = createSession(cookies);
                } else {
                    session = undefined;
                }

                const encoding = res.headers['content-encoding'];
//              console.log('encoding: ' + encoding);
                if (encoding == 'gzip') {
                    zl = api.zlib.createGunzip();
                    streamToJson(res, function(json) {
                        cb(undefined, session, json);
                    });
                    res.pipe(zl);
                } else if (encoding == 'deflate') {
                    zl = api.zlib.createInflate();
                    streamToJson(res, function(json) {
                        cb(undefined, session, json);
                    });
                    res.pipe(zl);
                } else {
                    const json = JSON.parse(body);
                    cb(undefined, session, json);
                }
            });
        }

    }

    return new Ajax();
}

})();


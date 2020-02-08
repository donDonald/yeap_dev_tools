'use strict';

const assert = require('assert');
const HANDLERS = {'get.js':'GET', 'post.js':'POST', 'delete.js':'DELETE', 'put.js':'PUT'};
const DIRS = {'GET':'get.js', 'POST':'post.js', 'DELETE':'delete.js', 'PUT':'put.js'};

const collectRoutes = function(api, path, routes) {
//  console.log(`collectRoutes(), path:${path}`);

    const fullPath = api.lib.env.makePath(path);
    let files;
    try {
        files = api.fs.readdirSync(fullPath);
//      console.log('collectRoutes, files:', files);
    } catch(e) {
        return;
    }

    files.forEach((file)=>{
        const method = HANDLERS[file];
        if (method) {
            const route = {path:path, method:method};
            routes.push(route);
//          console.log('collectRoutes, route is found:', (path + '/'+ file));
        } else {
            collectRoutes(api, path + '/' + file, routes);
        }
    });
}

const makeStr = (handler)=>{
    const s = ' ';
    const sMethod = handler.method + s.repeat(7-handler.method.length);
    const sAccess = handler.access ? 'SET' : s.repeat(3);
    const sRules = handler.rules ? 'SET' : s.repeat(3);
    const result = `method:${sMethod}, access:${sAccess}, rules:${sRules}, url:${handler.route}`;
    return result;
}

const loadRoutes = function(api, router, path, accessController, accessFailure, params) {
//  console.log(`loadRoutes(), path:${path}`);
    const routes = [];
    collectRoutes(api, path, routes);
//  console.log('loadRoutes, collected routes:');
//  routes.forEach((r, index)=>{console.log(`    route[${index}]:`, r);});

//  console.log('loadRoutes, collected routes:');
    console.log('Collected routes:');
    routes.forEach((r, index)=>{
        const path = r.path + '/' + DIRS[r.method];
        const handler = createHandler(api, router, path, accessController, accessFailure, params);
        console.log('    ' + makeStr(handler));
    });
}

const createHandler = function(api, router, path, accessController, accessFailure, params) {
    const fullPath = api.lib.env.makePath(path);
    let route, method;
    {
        const elements = path.split('/');
        method = elements[elements.length-1];
        elements.shift(); // remove routes
        elements.splice(-1,1); // remove method
        route = '/' + elements.join('/');
        method = HANDLERS[method];
    }
//  console.log(`createHandler(), path:${path}, route:${route}, method:${method}`);

    // Create handler
    const Handler = api.lib.re(path + '/Handler')(api);
    assert(Handler);
    params = params || {};
    params.route = route;
    params.method = method;
    const handler = new Handler(params);
    const handle = handler.handle.bind(handler);

    const mws = [];

    // Setup access controller
    let access;
    if (accessController) {
        access = accessController.addRoute(path, method, accessFailure);
//      console.log(`createHandler, access:${typeof access}`);
        if (access) {
            handler.access = access;
            mws.push(access);
        }
    }

    // Setup validator
    let rules;
    const validator = api.lib.re(path + '/validator');
//  console.log(`createHandler, validator:${typeof validator}`);
    if (typeof validator === 'function') {
        rules = validator(api);
//      console.log(`createHandler, rules:${typeof rules}`);
        handler.rules = rules;
        mws.push(rules.rules());
        mws.push(rules.validate);
    }

    // Add route
    const methodLower = method.toLowerCase();
    const routeHandler = router[methodLower];
//  console.log(`createHandler, new handler is ready, method:${handler.method}, route:${handler.route}`);
    routeHandler.call(router, route, mws, handle);
    return handler;
}

module.exports = function(api) {
    assert(api);
    return {
        createHandler: createHandler.bind(undefined, api),
        loadRoutes: loadRoutes.bind(undefined, api)
    };
}


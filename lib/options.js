'use strict';

const assert = require('assert');

const options = module.exports = {};

//assert(typeof process.env.KZ_IAS_ROOT != 'undefined', 'Fuck man! Where the KZ_IAS_ROOT?');
//assert(typeof process.env.KZ_SERVER_ROOT != 'undefined', 'Fuck man! Where the KZ_SERVER_ROOT?');

options.server = {};

//options.server.domain = process.env.KZ_HOST;
//assert(options.server.domain);

//options.server.root = process.env.KZ_SERVER_ROOT;
//options.server.applications = process.env.KZ_IAS_ROOT + '/applications';

options.application = {};
//options.application.root = process.env.KZ_APP_ROOT;
options.application.config = {};
options.application.config.locationDb = 'config/databases.js';
options.application.config.locationApplication = 'config/application.js';
options.application.config.locationServices= 'config/services.js';
options.application.config.locationBalancer = 'config/balancer.js';

options.dbName = 'dbTest1';


'use strict';

const assert = require('assert'),
      re = (module)=>{ return require('./' + module); }

const api = {};
module.exports = api;

api.fs = require('fs');
api.zlib = require('zlib');
api.stream = require('stream');

api.ajax = re('ajax')(api);
api.docker_compose = re('docker_compose');
api.etc_hosts = re('etc_hosts');
api.etc_hosts_docker = re('etc_hosts_docker');

api.validators = {};
api.validators.validate = re('validators/validate')(api);

api.express = {};
api.express.Delete = re('express/Delete')(api);
api.express.Get = re('express/Get')(api);
api.express.Post = re('express/Post')(api);
api.express.Response = re('express/Response')(api);
api.express.Router = re('express/Router')(api);
api.express.getRoutes = re('express/getRoutes')(api);

api.Pm2 = re('Pm2')(1);


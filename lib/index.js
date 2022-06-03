'use strict';

const assert = require('assert'),
      re = (module)=>{ return require('./' + module); }

const api = {};
module.exports = api;

api.fs = require('fs');
api.zlib = require('zlib');
api.stream = require('stream');
api.path = require('path');
api.https = require('https');

api.env = re('env')(api);
api.re = re('re')(api);
api.types = re('types')(api);
api.Md5 = re('Md5')(api);
api.makeId = re('makeId')(api);
api.ajax = re('ajax')(api);

api.sys = {};
api.sys.docker_compose = re('sys/docker-compose')(api);
api.sys.docker_hosts = re('sys/docker-hosts');

api.validators = {};
api.validators.validate = re('validators/validate')(api);

api.express = {};
api.express.Delete = re('express/Delete')(api);
api.express.Get = re('express/Get')(api);
api.express.Post = re('express/Post')(api);
api.express.Response = re('express/Response')(api);
api.express.Router = re('express/Router')(api);
api.express.getRoutes = re('express/getRoutes')(api);


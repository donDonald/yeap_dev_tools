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



api.lib = {};
api.lib.env = re('env')(api);
api.lib.re = re('re')(api);
api.lib.types = re('types')(api);
api.lib.Md5 = re('Md5')(api);
api.lib.makeId = re('makeId')(api);
api.lib.ajax = re('ajax')(api);



api.lib.db = {};
api.lib.db.tools = re('db/tools');
api.lib.db.DbPool = re('db/DbPool')(api);



api.lib.sys = {};
api.lib.sys.docker_compose = re('sys/docker-compose')(api);
api.lib.sys.docker_hosts = re('sys/docker-hosts');



api.lib.validators = {};
api.lib.validators.validate = re('validators/validate')(api);



api.lib.express = {};
api.lib.express.Delete = re('express/Delete')(api);
api.lib.express.Get = re('express/Get')(api);
api.lib.express.Post = re('express/Post')(api);
api.lib.express.Response = re('express/Response')(api);
api.lib.express.Router = re('express/Router')(api);
api.lib.express.getRoutes = re('express/getRoutes')(api);


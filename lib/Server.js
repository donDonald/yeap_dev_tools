'use strict';

const assert = require('assert');
const exec = require('child_process').exec;

module.exports = (api)=>{
    assert(api);
    assert(api.dev_tools);
    assert(api.dev_tools.Pm2);
    assert(api.dev_tools.etc_hosts);




    const Service = function(name, path, config) {
//      api.log.debug(`Service(), name:${name}, path:${path}`);
        this.name = name;
        this.path = path;
        assert(config.services, 'No services are defined');
        const services = Object.keys(config.services);
        assert(services.length > 0, 'No services are defined');
        this.service = JSON.parse(JSON.stringify(config.services[services[0]]));
        assert(this.service.port, 'No port is assigned to the service');
        this.config = JSON.parse(JSON.stringify(config)); // Clone it, I might want to modify it later on.
        this.hostsIndex = 0;
        this.hosts = [];

        this.peekUrl = function() {
            const host = this.peekHost();
            return `http://${host.host}:${host.port}`;
        }

        this.peekHost = function() {
            assert(this.hosts.length > 0, 'No hosts are given, nothing to peek');
            const i = this.hostsIndex++ % this.hosts.length;
            return this.hosts[i];
        }

        this.appendHost = function(host, port, cb) {
            assert(host);
            assert(port);
            if(typeof port == 'function') {
                cb = port;
                port = this.service.port;
            }
            this.hosts.push({host:host, port:port});
            api.dev_tools.etc_hosts.add(host, cb);
        }
    }




    class Server {
        constructor() {
//          api.log.debug('Server(), path:' + path);
            this._appList = [];
        }




        get exec() {
            const exec2 = this.exec_ ? this.exec_ : exec;
            return exec2;
        }




        set exec(exec) {
            this.exec_ = exec;
        }




        status(cb) {
//          api.log.debug('Server.status()');
            assert(false);
        }




        /// \brief Start the server.
        start(cb) {
//          api.log.debug('Server.start()');
            assert(false);
        }




        /// \brief Stop the server.
        stop(cb) {
//          api.log.debug('Server.stop()');
            assert(false);
        }





        /// \brief Add application to the server.
        ///
        /// config = {
        ///     application: {
        ///         <name>: <value>,
        ///         <name>: <value>,
        ///     },
        ///     databases: [
        ///         ...
        ///         ...
        ///     ],
        ///     scale: scale // undefined, scale
        /// }
        addApp(appName, cwd, config, cb) {
//          api.log.debug('server.basic.addApp(), appName:' + appName);
//          api.log.debug('server.basic.addApp, cwd:' + cwd);
//          api.log.debug('server.basic.addApp, config:'); api.log.debug(config);
            assert(appName);
            assert(cwd);
            assert(config);
            assert(cb);
            this._verifyAppConfig(appName, config, (err)=>{
                if (err) {
                    cb(err);
                } else {
                    this._createApp(appName, cwd, config, (err, app)=>{
                        if (err) {
                            cb(err);
                        } else {
                            this._configurateApp(app, config, (err)=>{
                                if(err) {
                                    cb(err);
                                } else {
                                    if(undefined == this.application(app.name)) {
                                        this._appList.push(app);
//                                      // Once app is created, assign it urls
//                                      const containerName = this._makeClusterName(app.name, CLUSTER_ID); //config.scale.clusters[0].id 'c0');
//                                      this.application(app.name).appendHost(containerName, cb);
//                                  } else {
//                                      cb();
                                    }
                                    cb();
                                }
                            });
                        }
                    });
                }
            });
        }




        /// \brief Peek application by name.
        application(name) {
            return this._appList.find((a)=>{ return a.name == name; });
        }




        /// \brief Verify app config.
        _verifyAppConfig(appName, config, cb) {
            setImmediate(()=>{cb()});
        }




        /// \brief Link app.
        _createApp(appName, cwd, config, cb) {
//          api.log.debug('Server._createApp(), appName:' + appName);
            assert(appName);
            assert(cwd);
            assert(config);
            assert(cb);
            let app = this._appList.find((a)=>{ return a.name == appName; });
            if(typeof app !== 'undefined') {
                // If app already here, just return
                setImmediate(()=>{cb(undefined, app);});
            } else {
                app = new Service(appName, cwd, config);
                cb(undefined, app);
            }
        }




        /// \brief Configure app.
        _configurateApp(app, config, cb) {
//          api.log.debug('server.basic._configurateApp(), app.name:' + app.name);
            assert(app);
            assert(config);
            assert(cb);

            const appNameInternal = app.name.split('/').join('.');
          //const appLocation = options.server.root + '/' + appName;
          //const iasAppLocation = options.server.applications + '/' + appNameInternal;

            const foos = [];
            if(config.application) {
                let f = this._configApplication.bind(this, app, config.application);
                foos.push(f);
            }
            if(config.databases) {
                let f = this._configDatabases.bind(this, app, config.databases);
                foos.push(f);
            }
            if(config.services) {
                let f = this._configServices.bind(this, app, config.services);
                foos.push(f);
            }
            if(config.balancer && config.scale) {
                let f = this._configBalancer.bind(this, app, config.balancer, config.scale, 0);
                foos.push(f);
            }

            const foo = (index, foos, cb)=>{
                if(index < foos.length) {
                    const f = foos[index];
                    f((err)=>{
                        if(err) {
                            cb(err);
                        } else {
                            foo(index+1, foos, cb);
                        }
                    });
                } else {
                    cb();
                }
            }

            foo(0, foos, cb);
        }



        /// \brief Create cluster name out of app setting and cluster ID.
        _makeClusterName(name, clusterId) {
//          api.log.debug('Server._makeClusterName(), name:' + name);
            const parts = name.split('/');
            let result = parts[parts.length-1] + '.' + clusterId;
            for(let i=parts.length - 2; i > -1; --i) {
                result += '.' + parts[i];
            }
    //      result += '.' + options.server.domain;
            result = result.toLowerCase();
//          api.log.debug('Server._makeClusterName, result:' + result);
            return result;
        }




        /// \brief Setup <app>/config/application.js
        _configApplication(app, config, cb) {
//          api.log.debug('Server._configApplication(), config:'); api.log.debug(config);
            assert(app);
            assert(config);
            assert(cb);

            const lines = [];
            lines.push('module.exports = {');
            const keys = Object.keys(config);
            keys.forEach((key)=>{
                const value = JSON.stringify(config[key]);
                const line = `    ${key}:${value},`;
                lines.push(line);
            });
            lines.push('};');
            const lines2 = lines.join('\n');
//          api.log.debug('Server._configApplication, lines2:'); api.log.debug(lines2);
            const dst = app.path + api.dev_tools.options.application.config.locationApplication;
            const cmd = 'echo \'' + lines2 + '\' >' + dst;
//          api.log.debug('Server._configApplication, cmd:' + cmd);
            exec(cmd, (error, stdout, stderr)=>{
//              api.log.debug('Server._configApplication, stdout:' + stdout);
//              api.log.debug('Server._configApplication, stderr:' + stderr);
                if(error) {
                    api.log.debug('Server._configApplication, error:' + error);
                }
                cb(error);
            });
        }




        /// \brief Setup /ias/applications/<appName>/config/databases.js
        _configDatabases(app, databases, cb) {
//          api.log.debug('Server._configDatabases(), databases:'); api.log.debug(databases);
            assert(app);
            assert(databases);
            assert(cb);

            const aliases = Object.keys(databases);
            aliases.forEach((alias)=>{
                const db = databases[alias];
              //api.log.debug('Server._configDatabases, db:'); api.log.debug(db);
                assert(db.schema);
                assert(db.host);
                assert(db.port);
                assert(db.user);
                assert(db.password);
                assert(db.database);
                if(!db.slowTime) {
                    api.log.warn('Have to implement slowTime support for sure!');
                }
            });
            const self = this;

          //// Setup security db if it's given
          //const setupSecurityDb = (cb)=>{
          //    let securityDbName;
          //    databases.forEach((db)=>{
          //        if (db.security && db.security == true) {
          //            securityDbName = db.name;
          //        }
          //    });
          //    if (securityDbName) {
          //        ias.security.cleanupApp(appName, securityDbName, (err)=>{
          //            cb(err);
          //        });
          //    } else {
          //        setImmediate(cb);
          //    }
          //}

            // Setup dbs
            const setupDbs = (cb)=>{
                const lines = [];
                lines.push('module.exports = {');

                aliases.forEach((alias)=>{
                    const db = databases[alias];
                    const line = [
                    `    ${alias} : {`,
                    `       schema: "${db.schema}",`,
                    `       database: "${db.database}",`,
                    `       host: "${db.host}",`,
                    `       port: "${db.port}",`,
                    `       user: "${db.user}",`,
                    `       password: "${db.password}"`,
                    `    },`,
                    ].join("\n");
                    lines.push(line);
                });

                lines.push('};');
                const lines2 = lines.join('\n');
//              api.log.debug('Server._configDatabases, lines2:'); api.log.debug(lines2);

                const dst = app.path + api.dev_tools.options.application.config.locationDb;
                const cmd = 'echo \'' + lines2 + '\' >' + dst;
//              api.log.debug('Server._configDatabases, cmd:' + cmd);
                exec(cmd, (error, stdout, stderr)=>{
//                  api.log.debug('Server._configDatabases, stdout:' + stdout);
//                  api.log.debug('Server._configDatabases, stderr:' + stderr);
                    if(error) {
                        api.log.debug('Server._configDatabases, error:' + error);
                    }
                    cb(error);
                });
            }

            setupDbs((err)=>{
                cb(err);
              //if (err) {
              //    cb(err);
              //} else {
              //    setupSecurityDb(cb);
              //}
            });
        }




        /// \brief Setup <app>/config/services.js
        _configServices(app, config, cb) {
//          api.log.debug('Server._configServices(), config:'); api.log.debug(config);
            assert(app);
            assert(config);
            assert(cb);

            const lines = [];
            lines.push('module.exports = {');
            const keys = Object.keys(config);
            keys.forEach((key)=>{
                const value = JSON.stringify(config[key]);
                const line = `    ${key}:${value},`;
                lines.push(line);
            });
            lines.push('};');
            const lines2 = lines.join('\n');
//          api.log.debug('Server._configServies, lines2:'); api.log.debug(lines2);
            const dst = app.path + api.dev_tools.options.application.config.locationServices;
            const cmd = 'echo \'' + lines2 + '\' >' + dst;
//          api.log.debug('Server._configServices, cmd:' + cmd);
            exec(cmd, (error, stdout, stderr)=>{
//              api.log.debug('Server._configServies, stdout:' + stdout);
//              api.log.debug('Server._configServies, stderr:' + stderr);
                if(error) {
                    api.log.debug('Server._configServies, error:' + error);
                }
                cb(error);
            });
        }




        /// \brief Setup <app>/config/balancer.js
        _configBalancer(app, config, scale, clusterIndex, cb) {
//          api.log.debug('Server._configBalancer(), config:'); api.log.debug(config);
//          api.log.debug('Server._configBalancer, scale:'); api.log.debug(scale);
            assert(app);
            assert(config);
            assert(scale);
            assert.equal(typeof clusterIndex, 'number');
            assert(cb);

            const lines = [];
            lines.push('module.exports = {');

            // Generate here isMaster, cluster ID and node ID
            const clusterId = scale.clusters[clusterIndex].id;
            assert(clusterId);
            const nodeId = `${clusterId}N0`;
            lines.push(`    isMaster:false,`);
            lines.push(`    clusterId:"${clusterId}",`);
            lines.push(`    nodeId:"${nodeId}",`);

            const service = app.config.services.http || app.config.services.https;
            assert(service, 'No service is selected');
            const port = service.port;
            assert(port, 'No service port is selected');
            const clusterName = this._makeClusterName(app.name, clusterId);
            lines.push(`    hostnameAlias:"${clusterName}:${port}",`);

            const keys = Object.keys(config);
            keys.forEach((key)=>{
                const value = JSON.stringify(config[key]);
                const line = `    ${key}:${value},`;
                lines.push(line);
            });

            lines.push('};');
            const lines2 = lines.join('\n');
//          api.log.debug('Server._configBalancer, lines2:'); api.log.debug(lines2);
            const dst = app.path + api.dev_tools.options.application.config.locationBalancer;
            const cmd = 'echo \'' + lines2 + '\' >' + dst;
//          api.log.debug('Server._configBalancer, cmd:' + cmd);
            exec(cmd, (error, stdout, stderr)=>{
//              api.log.debug('Server._configBalancer, stdout:' + stdout);
//              api.log.debug('Server._configBalancer, stderr:' + stderr);
                if(error) {
                    api.log.debug('Server._configBalancer, error:' + error);
                }
                cb(error);
            });
        }
    }

    return Server;
}


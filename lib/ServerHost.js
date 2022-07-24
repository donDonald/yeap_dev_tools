'use strict';

const assert = require('assert');
const exec = require('child_process').exec;

module.exports = (api)=>{
    assert(api);
    assert(api.dev_tools.Pm2);
    assert(api.dev_tools.Server);




    class Server extends api.dev_tools.Server {
        constructor() {
//          api.log.debug('ServerHost()');
            super();
            this._pm2 = api.dev_tools.Pm2.create();
        }




        status(cb) {
//          api.log.debug('ServerHost.status()');
            const cmd = 'pm2 ps';
            this.exec(cmd, (error, stdout, stderr)=>{
//              api.log.debug('ServerHost.status, error:'); api.log.debug(error);
//              api.log.debug('ServerHost.status, stdout:'); api.log.debug(stdout);
//              api.log.debug('ServerHost.status, stderr:'); api.log.debug(stderr);
                if (error) {
                    cb(error);
                } else {
                    api.dev_tools.Pm2.parse(stdout, (entries)=> {
//                      api.log.debug('ServerHost.status, pm2 entries:'); api.log.debug(entries);
                        let status = 'Stopped';
                        assert(entries);
                        if(entries.length>0) {
                            status = 'Running';
                            for(let i=0; i<entries.length; ++i) {
                                const e = entries[i];
                                assert(e.status);
                                if(e.status !== 'online') {
                                    status = 'Error';
                                    break;
                                } 
                            }
                        }
                        cb(undefined, status);
                    });
                }
            });
        }




        /// \brief Start the server.
        start(cb) {
//          api.log.debug('ServerHost.start()');
            const start = (index, appList, cb)=>{
                if(index<appList.length) {
                    const app = appList[index];
                    const clusterId = app.config.scale.clusters[0].id;
                    this._pm2.start(app.name, {cwd:app.path}, (err)=>{
                        if(err) {
                            cb(err);
                        } else {
                            const containerName = this._makeClusterName(app.name, app.config.scale.clusters[0].id);
                            this.application(app.name).appendHost(containerName, (clusterId)=>{
                                if(err) {
                                    cb(err);
                                } else {
                                    start(index+1, appList, cb);
                                }
                            });
                        }
                    });
                } else {
                    setTimeout(cb, 15000);
                }
            }

            start(0, this._appList, (err)=>{
                if(err) {
                    api.log.error('ServerHost.start, err:' + err);
                }
                cb(err);
            });
        }




        /// \brief Stop the server.
        stop(cb) {
//          api.log.debug('ServerHost.stop()');
            const stop = (index, appList, cb)=>{
                if(index<appList.length) {
                    const app = appList[index];
                    this._pm2.stop(app.name, (err)=>{
                        if(err) {
                            cb(err);
                        } else {
                            stop(index+1, appList, cb);
                        }
                    });
                } else {
                    cb();
                }
            }

            stop(0, this._appList, (err)=>{
                if(err) {
                    api.log.error('ServerHost.stop, err:' + err);
                }
                cb(err);
            });
        }




        /// \brief Verify app config.
        _verifyAppConfig(appName, config, cb) {
            assert(config.scale, 'No scaling is defined');
            assert(config.scale.cloud, 'No cloud is defined');
            assert(config.scale.cloud.name, 'No cloud name id defined');
            assert(config.scale.clusters, 'No clusters are defined');
            assert.equal(config.scale.clusters.length, 1, 'For host case only cluste is supported');
            assert(config.scale.clusters[0].id, 'No cluster id is defied');
            setImmediate(()=>{cb()});
        }

    }

    return Server;
}


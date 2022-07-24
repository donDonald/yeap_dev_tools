'use strict';

const assert = require('assert');
const exec = require('child_process').exec;
const execFile = require('child_process').execFile;
const RUNNING = 'Running';
const STOPPED = 'Stopped';
const MIXED   = 'Mixed';

module.exports = (api)=>{
    assert(api);
    assert(api.dev_tools.Server);




    //---------------------- Cluster (set of workers) ------------------------
    class Cluster {
        constructor(server, app, cluster) {
            assert(server);
            assert(app);
            this._server = server;
            this._app = app;
            assert(cluster);
            assert(cluster.id);
            this._cluster = cluster;
            this._containerName = this._server._makeClusterName(this._app.name, this._cluster.id);
        }

        status(cb) {
//          api.log.debug('ServerDocker.Cluster.status()');
            assert(this._containerName);
//          api.log.debug('ServerDocker.Cluster.status, id: ' + this._cluster.id + ', containerName:' + this._containerName);
            const cmd = 'docker ps  -f status=running | grep ' + this._containerName + ' | wc -l';
//          api.log.debug('ServerDocker.Cluster.status, cmd:' + cmd);
            exec(cmd, (error, stdout, stderr)=>{
//              api.log.debug('    ServerDocker.Cluster.status, stdout:' + stdout);
//              api.log.debug('    ServerDocker.Cluster.status, stderr:' + stderr);
                if (error) {
                    api.log.error('    ServerDocker.Cluster.status, error:' + error);
                    cb(error);
                } else {
                    const status = stdout.indexOf('1') !== -1 ? RUNNING : STOPPED;
//                  api.log.debug('ServerDocker.Cluster.status, status:' + status);
                    cb(undefined, status)
                }
            });
        }

        stop(cb) {
//          api.log.debug('ServerDocker.Cluster.stop()');
//          api.log.debug('ServerDocker.Cluster.stop(), id:' + this._cluster.id + ', container:' + this._containerName);
//          const cmd = 'docker stop $(docker ps -q --filter name=' + this._containerName + ')';
            const cmd = 'docker stop ' + this._containerName;
//          api.log.debug('ServerDocker.Cluster.stop, cmd:' + cmd);
            exec(cmd, (error, stdout, stderr)=>{
//              api.log.error('    ServerDocker.Cluster.stop, stdout:' + stdout);
//              api.log.error('    ServerDocker.Cluster.stop, stderr:' + stderr);
                if(error) {
                    api.log.error('    ServerDocker.Cluster.stop, error:' + error);
                }
                cb(error);
            });
        }

        start(cb) {
//          api.log.debug('ServerDocker.Cluster.start(), cluster.id:' + this._cluster.id + ', container:' + this._containerName);
//          api.log.debug('ServerDocker.Cluster.start, app.path:' + this._app.path);
            const self = this;
            self._deployConfig(this._app, this._cluster.id, (err, fileName, port)=>{
                if (err) {
                    cb(err);
                } else {
                    assert(fileName);
                    assert(port);
                    const execOptions = {
                        cwd: self._app.path + '/env',
                        env: Object.assign({}, process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
                    };
                    exec(`bash ${fileName} ${self._containerName}`,
                        execOptions,
                        (error, stdout, stderr)=>{
//                          api.log.debug('    ServerDocker.Cluster.start, stdout:' + stdout);
//                          api.log.debug('    ServerDocker.Cluster.start, stderr:' + stderr);
                            if (error) {
                                api.log.error('    ServerDocker.Cluster.start, error:' + error);
                                cb(error);
                            } else {
                                // Once app is created, assign it urls
                                self._server.application(self._app.name).appendHost(self._containerName, port, (err)=>{
                                    if(err) {
                                        cb(err);
                                    } else {
                                        self.wait(30000, (err)=>{
                                            cb();
                                        });
                                    }
                                });
                            }
                        }
                    );
                }
            });
        }

        wait(timeout, cb) {
//          api.log.debug('ServerDocker.Cluster.wait()');
            assert(this._containerName);
            assert(timeout);
            assert(cb);

            const self = this;
            let interval = setInterval(
                ()=>{
//                  api.log.debug('ServerDocker.Cluster.wait.interval(), containerName:' + this._containerName);
                    self.status((err, status)=>{
                        if (err) {
                            clearInterval(interval);
                            clearTimeout(timeoutTimer);
                            interval = undefined;
                            timeoutTimer = undefined;
                            cb(err);
                        } else {
                            if (status == RUNNING) {
                                clearInterval(interval);
                                clearTimeout(timeoutTimer);
                                interval = undefined;
                                timeoutTimer = undefined;
//                              api.log.debug('ServerDocker.Cluster.wait.interval(), container:' + this.containerName + ' is ' + status);
                                setTimeout(cb, 3*5000); // To let IAS application really get statrted, do initialization and so on.
                            }
                        }
                    });
                },
                1000);

            let timeoutTimer = setTimeout(
                ()=>{
//                  api.log.debug('ServerDocker.Cluster.start.waitCluster.timeout(), cluster.containerName:' + cluster.containerName);
                    clearInterval(interval);
                    clearTimeout(timeoutTimer);
                    interval = undefined;
                    timeoutTimer = undefined;
                    cb('Server startup timeouted, server is not running for some reason');
                },
            timeout);
        }

        _deployConfig(app, clusterId, cb) {
//          api.log.debug('ServerDocker.Cluster.deployConfig(), cluster id:' + clusterId + ', containerName:' + this._containerName);
            assert(app.config.scale);

            let clusterIndex;
            app.config.scale.clusters.forEach((c, index)=>{
                if (c.id==clusterId) {
                    clusterIndex = index;
                }
            });

            this._server._configBalancer(app, app.config.balancer, app.config.scale, clusterIndex, (err)=>{
                if(err) {
                    cb(err);
                } else {
                    const templateSrc = this._app.path + '/env/run.sh';
                    const fileName = `.run.${clusterId}.sh`;
                    const templateDst = this._app.path + `/env/${fileName}`;
                    const srcPort = app.config.services.http.port + clusterIndex;
                    const dstPort = app.config.services.http.port;

                    const steps = [
                        'cp ' + templateSrc + ' ' + templateDst,
                        'sed \'s/[0-9]{2,6}:[0-9]{2,6}/' + `${srcPort}:${dstPort}` + '/\' -r -i ' + templateDst,
                    ];

                    const executeSteps = (index, steps, cb)=>{
                        if (index<steps.length) {
                            const cmd = steps[index];
                            exec(cmd, (error, stdout, stderr)=>{
                                //api.log.debug('    ServerDocker.Cluster.deployConfig, error:' + error);
                                //api.log.debug('    ServerDocker.Cluster.deployConfig, stdout:' + stdout);
                                if (error) {
                                    api.log.debug('    ServerDocker.Cluster.deployConfig, stderr:' + stderr);
                                    cb(error);
                                } else {
                                    executeSteps(index+1, steps, cb);
                                }
                            });
                        } else {
                            cb(undefined, fileName, srcPort);
                        }
                    }

                    executeSteps(0, steps, cb);
                }
            });
        }
    }




    //---------------------- Cloud (set of clusters) -------------------------
    class Cloud {
        constructor(server, app) {
            assert(app.config.scale.clusters);
            this._server = server;
            this._app = app;
            this._clusters = [];
        }

        status(cb) {
//          api.log.debug('ServerDocker.Cloud.status(), app.name:' + this._app.name);

            const clustersStatuses = (index, clusters, statuses, cb)=>{
//              api.log.debug('ServerDocker.Cloud.status.clustersStatuses()');
                if (index < clusters.length) {
                    clusters[index].status((err, status)=>{
                        if (err) {
                            cb(err);
                        } else {
                            statuses.push(status);
                            clustersStatuses(index+1, clusters, statuses, cb);
                        }
                    });
                } else {
                    cb();
                }
            }

            const statuses = [];
            clustersStatuses(0, this._clusters, statuses, (err)=>{
                if (err) {
                    cb(err);
                } else {
                    let status;
                    let runningCount = 0;
                    let stoppedCount = 0;
                    statuses.forEach((s)=>{
                        if (s == RUNNING) {
                            ++runningCount;
                        } else if (s == STOPPED) {
                            ++stoppedCount;
                        } else {
                        }
                    });
                    if (runningCount == 0 && stoppedCount == 0) {
                        status = STOPPED;
                    } else if (runningCount > 0 && stoppedCount == 0) {
                        status = RUNNING;
                    } else if (runningCount == 0 && stoppedCount > 0) {
                        status = STOPPED;
                    } else {
                        status = MIXED;
                    }
//                  api.log.debug('ServerDocker.Cloud.status, status:' + status);
                    cb(undefined, status);
                }
            });
        }

        stop(cb) {
    //      api.log.debug('ServerDocker.Cloud.stop(), app.name:' + this._app.name);

            // 1. Stop clusters in reverse order
            // 2. Stop all remaining containers
            // To get container id by image name:
            //     1. docker ps -q --filter ancestor=Simpleness.?
            //     2. docker ps -a -q --filter="name=Simpleness.?"
            // To stop container by image name
            //     1. docker stop $(docker ps -q --filter ancestor=Simpleness.?)
            const stopClusters = (index, clusters, cb)=>{
                if (index > 0) {
                    clusters[index-1].stop((err)=>{
                        if (err) {
                            cb(err);
                        } else {
                            stopClusters(index-1, clusters, cb);
                        }
                    });
                } else {
                    cb();
                }
            }

            stopClusters(this._clusters.length, this._clusters, (err)=>{
    //          this._clusters = [];
                cb(err);
            });
        }

        start(cb) {
//          api.log.debug('ServerDocker.Cloud.start()');

            const self = this;
            const startClusters = (index, clusterList, cb)=>{
                if (index < clusterList.length) {
                    const params = clusterList[index];
                    const cluster = new Cluster(self._server, self._app, params);
                    self._clusters.push(cluster);
                    cluster.start((err)=>{
                        if (err) {
                            cb(err);
                        } else {
                            startClusters(index+1, clusterList, cb);
                        }
                    });
                } else {
                    cb();
                }
            }

            const clusters = this._app.config.scale.clusters;
            assert(clusters);
            this.stop((err)=>{
                if (err) {
                    cb(err);
                } else {
                    startClusters(0, clusters, (err)=>{
                        cb(err);
                    });
                }
            });
        }
    }




    //---------------------- Server (set of clouds) --------------------------
    class Server extends api.dev_tools.Server {
        constructor() {
//          api.log.debug('ServerDocker()');
            super();
            this._clouds = [];
        }

        status(cb) {
//          api.log.debug('ServerDocker.status()');
            const cloudsStatuses = (index, clouds, statuses, cb)=>{
                if (index < clouds.length) {
                    clouds[index].status((err, status)=>{
                        if (err) {
                            cb(err);
                        } else {
                            statuses.push(status);
                            cloudsStatuses(index+1, clouds, statuses, cb);
                        }
                    });
                } else {
                    cb();
                }
            }

            const statuses = [];
            cloudsStatuses(0, this._clouds, statuses, (err)=>{
                if (err) {
                    cb(err);
                } else {
                    let status;
                    let runningCount = 0;
                    let stoppedCount = 0;
                    statuses.forEach((s)=>{
                        if (s == RUNNING) {
                            ++runningCount;
                        } else if (s == STOPPED) {
                            ++stoppedCount;
                        } else {
                        }
                    });
                    if (runningCount == 0 && stoppedCount == 0) {
                        status = STOPPED;
                    } else if (runningCount > 0 && stoppedCount == 0) {
                        status = RUNNING;
                    } else if (runningCount == 0 && stoppedCount > 0) {
                        status = STOPPED;
                    } else {
                        status = MIXED;
                    }
//                  api.log.debug('ServerDocker.status, status:' + status);
                    cb(undefined, status);
                }
            });
        }

        /// \brief Start the server.
        start(cb) {
//          api.log.debug('ServerDocker.start()');
            const self = this;
            const startClouds = (index, appList, cb)=>{
                if (index < appList.length) {
                    const app = appList[index];
                    const cloud = new Cloud(self, app);
                    self._clouds.push(cloud);
                    cloud.start((err)=>{
                        if (err) {
                            cb(err);
                        } else {
                            startClouds(index+1, appList, cb);
                        }
                    });
                } else {
                    cb();
                }
            }

            this.stop((err)=>{
                if (err) {
                    cb(err);
                } else {
                    startClouds(0, self._appList, (err)=>{
                        cb(err);
                    });
                }
            });
        }

        /// \brief Stop the server.
        stop(cb) {
//          api.log.debug('ServerDocker.stop()');
            // Stop clouds in reverse order
            const stopClouds = (index, clouds, cb)=>{
                if (index > 0) {
                    clouds[index-1].stop((err)=>{
                        if (err) {
                            cb(err);
                        } else {
                            stopClouds(index-1, clouds, cb);
                        }
                    });
                } else {
                    cb();
                }
            }

            stopClouds(this._clouds.length, this._clouds, cb);
        }

        /// \brief Verify app config.
        _verifyAppConfig(appName, config, cb) {
            assert(config.scale, 'No scaling is defined');
            assert(config.scale.cloud, 'No cloud is defined');
            assert(config.scale.cloud.name, 'No cloud name id defined');
            assert(config.scale.clusters, 'No clusters are defined');
            setImmediate(()=>{cb()});
        }
    }

    return Server;
}


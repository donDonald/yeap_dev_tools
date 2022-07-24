'use strict';

describe('yeap_dev_tools.scale, Helper to produce scaling configuration.', function() {

    const assert = require('assert');
    const re = (module)=>{ return require('../' + module); }
    let api = {};
    before(()=>{
        api.os = require('os');
        api.scale = re('./scale.js')(api);

        // To let scale.js.workers handle api.os.cpus().length
        global.api = api;
    });

    after(()=>{
        global.api = undefined;
    });

    it('scale.single.', (done)=>{
        assert(api.scale.SINGLE);

        const cloud = api.scale.single;
        assert(cloud);
        assert.equal('Single: 1 worker', cloud.description);

        const clusters = cloud.getClusters();
        assert(clusters);
        assert.equal(1, clusters.length);
        done();

////        assert.throws(()=>{
////            cloud.createConfig(1, (err)=>{});
////        });

////        cloud.createConfig(0, (err, location)=>{
////            assert(!err);
////            assert(location);
////            const config = requireNoCache(location);
//////          api.log.debug('config:'); api.log.dir(config);
////            assert.equal('single',      config.cloud);
////            assert.equal('tcp',         config.transport);
////            assert.equal('controller',  config.instance);
////            assert.equal('127.0.0.1',   config.host);
////            assert.equal(250,           config.rpcPort);
////            assert.equal(251,           config.subPort);
////            assert.equal('c1',          config.cluster);
////            assert.equal('node',        config.cookie);
////            assert.equal('single',      config.strategy);
////            assert.equal(1,             config.workers);
////            done();
////        });
    });

    it('scale.cluster.', (done)=>{
        assert(api.scale.CLUSTER);

        const cloud = api.scale.cluster;
        assert(cloud);
        assert.equal('Cloud: 1 cluster, nproc workers', cloud.description);

        const clusters = cloud.getClusters();
        assert(clusters);
        assert.equal(1, clusters.length);
        done();

////        assert.throws(()=>{
////            cloud.createConfig(1, (err)=>{});
////        });

////        cloud.createConfig(0, (err, location)=>{
////            assert(!err);
////            assert(location);
////            const config = requireNoCache(location);
//////          api.log.debug('config:'); api.log.dir(config);
////            assert.equal('cluster',     config.cloud);
////            assert.equal('tcp',         config.transport);
////            assert.equal('controller',  config.instance);
////            assert.equal('127.0.0.1',   config.host);
////            assert.equal(250,           config.rpcPort);
////            assert.equal(251,           config.subPort);
////            assert.equal('c1',          config.cluster);
////            assert.equal('node',        config.cookie);
////            assert.equal('cluster',     config.strategy);
////            assert.equal(api.os.cpus().length, config.workers);
////            done();
////        });
    });

    it('scale.cloud2clusters.', (done)=>{
        assert(api.scale.CLOUD_2_CLUSTERS);

        const cloud = api.scale.cloud2clusters;
        assert(cloud);
        assert.equal('Cloud: 2 clusters, nproc workers each', cloud.description);

        const clusters = cloud.getClusters();
        assert(clusters);
        assert.equal(2, clusters.length);
        done();

////        assert.throws(()=>{
////            cloud.createConfig(2, (err)=>{});
////        });

////        cloud.createConfig(0, (err, location)=>{
////            assert(!err);
////            assert(location);
////            const config = requireNoCache(location);
//////          api.log.debug('config:'); api.log.dir(config);
////            assert.equal('cloud2clusters', config.cloud);
////            assert.equal('tcp',         config.transport);
////            assert.equal('controller',  config.instance);
////            assert.equal('127.0.0.1',   config.host);
////            assert.equal(250,           config.rpcPort);
////            assert.equal(251,           config.subPort);
////            assert.equal('c1',          config.cluster);
////            assert.equal('node',        config.cookie);
////            assert.equal('cluster',     config.strategy);
////            assert.equal(api.os.cpus().length, config.workers);

////            cloud.createConfig(1, (err, location)=>{
////                assert(!err);
////                assert(location);
////                const config = requireNoCache(location);
//////              api.log.debug('config:'); api.log.dir(config);
////                assert.equal('cloud2clusters', config.cloud);
////                assert.equal('tcp',         config.transport);
////                assert.equal('server',      config.instance);
////                assert.equal('127.0.0.1',   config.host);
////                assert.equal(250,           config.rpcPort);
////                assert.equal(251,           config.subPort);
////                assert.equal('c2',          config.cluster);
////                assert.equal('node',        config.cookie);
////                assert.equal('cluster',     config.strategy);
////                assert.equal(api.os.cpus().length, config.workers);
////                done();
////            });
////        });
    });

    it('scale.cloud4clusters.', (done)=>{
        assert(api.scale.CLOUD_4_CLUSTERS);

        const cloud = api.scale.cloud4clusters;
        assert(cloud);
        assert.equal('Cloud: 4 clusters, nproc workers each', cloud.description);

        const clusters = cloud.getClusters();
        assert(clusters);
        assert.equal(4, clusters.length);
        done();

////        assert.throws(()=>{
////            cloud.createConfig(4, (err)=>{});
////        });

////        cloud.createConfig(0, (err, location)=>{
////            assert(!err);
////            assert(location);
////            const config = requireNoCache(location);
//////          api.log.debug('config:'); api.log.dir(config);
////            assert.equal('cloud4clusters', config.cloud);
////            assert.equal('tcp',            config.transport);
////            assert.equal('controller',     config.instance);
////            assert.equal('127.0.0.1',      config.host);
////            assert.equal(250,              config.rpcPort);
////            assert.equal(251,              config.subPort);
////            assert.equal('c1',             config.cluster);
////            assert.equal('node',           config.cookie);
////            assert.equal('cluster',        config.strategy);
////            assert.equal(api.os.cpus().length, config.workers);

////            cloud.createConfig(1, (err, location)=>{
////                assert(!err);
////                assert(location);
////                const config = requireNoCache(location);
//////              api.log.debug('config:'); api.log.dir(config);
////                assert.equal('cloud4clusters', config.cloud);
////                assert.equal('tcp',            config.transport);
////                assert.equal('server',         config.instance);
////                assert.equal('127.0.0.1',      config.host);
////                assert.equal(250,              config.rpcPort);
////                assert.equal(251,              config.subPort);
////                assert.equal('c2',             config.cluster);
////                assert.equal('node',           config.cookie);
////                assert.equal('cluster',        config.strategy);
////                assert.equal(api.os.cpus().length, config.workers);

////                cloud.createConfig(2, (err, location)=>{
////                    assert(!err);
////                    assert(location);
////                    const config = requireNoCache(location);
//////                  api.log.debug('config:'); api.log.dir(config);
////                    assert.equal('cloud4clusters', config.cloud);
////                    assert.equal('tcp',            config.transport);
////                    assert.equal('server',         config.instance);
////                    assert.equal('127.0.0.1',      config.host);
////                    assert.equal(250,              config.rpcPort);
////                    assert.equal(251,              config.subPort);
////                    assert.equal('c3',             config.cluster);
////                    assert.equal('node',           config.cookie);
////                    assert.equal('cluster',        config.strategy);
////                    assert.equal(api.os.cpus().length, config.workers);

////                    cloud.createConfig(3, (err, location)=>{
////                        assert(!err);
////                        assert(location);
////                        const config = requireNoCache(location);
//////                      api.log.debug('config:'); api.log.dir(config);
////                        assert.equal('cloud4clusters', config.cloud);
////                        assert.equal('tcp',            config.transport);
////                        assert.equal('server',         config.instance);
////                        assert.equal('127.0.0.1',      config.host);
////                        assert.equal(250,              config.rpcPort);
////                        assert.equal(251,              config.subPort);
////                        assert.equal('c4',             config.cluster);
////                        assert.equal('node',           config.cookie);
////                        assert.equal('cluster',        config.strategy);
////                        assert.equal(api.os.cpus().length, config.workers);

////                        done();
////                    });

////                });
////            });
////        });
    });

    describe('scale.collectWorkers.', ()=>{
        it('collectWorkers(SINGLE).', ()=>{
            const scale = api.scale.SINGLE;
            const nodes = api.scale.collectWorkers(scale);

            let workersCount = 0;
            scale.clusters.forEach((cluster)=>{
                workersCount += eval(cluster.workers);
            });
//          api.log.debug('workersCount:' + workersCount + ', nodes:'); api.log.debug(nodes);

            assert.equal(1, nodes.length);
            assert.equal(workersCount, nodes.length);
            assert.equal('c1', nodes[0].clusterId);
            assert.equal('c1N0', nodes[0].nodeId);
            assert.equal('worker', nodes[0].role);
        });

        it('collectWorkers(CLUSTER).', function() {
            const scale = api.scale.CLUSTER;
            const nodes = api.scale.collectWorkers(scale);

            let workersCount = 0;
            scale.clusters.forEach((cluster)=>{
/////               ++workersCount; // master
                workersCount += eval(cluster.workers);
            });
//          api.log.debug('workersCount:' + workersCount + ', nodes:'); api.log.debug(nodes);
            assert.equal(workersCount, nodes.length);

            scale.clusters.forEach((cluster)=>{
////                // Check master
////                const node = nodes.shift();
////                assert.equal(cluster.id, node.clusterId);
////                assert.equal(cluster.id + 'N0', node.nodeId);
////                assert.equal('master', node.role);

                // Check workers
                const workersCount = eval(cluster.workers);
////                for(let i=1; i<1+workersCount; ++i) {
                for(let i=0; i<workersCount; ++i) {
                    const node = nodes.shift();
                    assert.equal(cluster.id, node.clusterId);
                    assert.equal(cluster.id + 'N' + i, node.nodeId);
                    assert.equal('worker', node.role);
                }
            });
        });

        it('collectWorkers(CLOUD_2_CLUSTERS).', function() {
            const scale = api.scale.CLOUD_2_CLUSTERS;
            const nodes = api.scale.collectWorkers(scale);

            let workersCount = 0;
            scale.clusters.forEach((cluster)=>{
////                ++workersCount; // master
                workersCount += eval(cluster.workers);
            });
//          api.log.debug('workersCount:' + workersCount + ', nodes:'); api.log.debug(nodes);
            assert.equal(workersCount, nodes.length);

            scale.clusters.forEach((cluster)=>{
////                // Check master
////                const node = nodes.shift();
////                assert.equal(cluster.id, node.clusterId);
////                assert.equal(cluster.id + 'N0', node.nodeId);
////                assert.equal('master', node.role);

                // Check workers
                const workersCount = eval(cluster.workers);
////                for(let i=1; i<1+workersCount; ++i) {
                for(let i=0; i<workersCount; ++i) {
                    const node = nodes.shift();
                    assert.equal(cluster.id, node.clusterId);
                    assert.equal(cluster.id + 'N' + i, node.nodeId);
                    assert.equal('worker', node.role);
                }
            });
        });

        it('collectWorkers(CLOUD_4_CLUSTERS).', function() {
            const scale = api.scale.CLOUD_4_CLUSTERS;
            const nodes = api.scale.collectWorkers(scale);

            let workersCount = 0;
            scale.clusters.forEach((cluster)=>{
////                ++workersCount; // master
                workersCount += eval(cluster.workers);
            });
//          api.log.debug('workersCount:' + workersCount + ', nodes:'); api.log.debug(nodes);
            assert.equal(workersCount, nodes.length);

            scale.clusters.forEach((cluster)=>{
////                // Check master
////                const node = nodes.shift();
////                assert.equal(cluster.id, node.clusterId);
////                assert.equal(cluster.id + 'N0', node.nodeId);
////                assert.equal('master', node.role);

                // Check workers
                const workersCount = eval(cluster.workers);
////                for(let i=1; i<1+workersCount; ++i) {
                for(let i=0; i<workersCount; ++i) {
                    const node = nodes.shift();
                    assert.equal(cluster.id, node.clusterId);
                    assert.equal(cluster.id + 'N' + i, node.nodeId);
                    assert.equal('worker', node.role);
                }
            });
        });
    });

    describe('scale.collectClusters.', function() {
        it('collectClusters(SINGLE).', function() {
            const scale = api.scale.SINGLE;
            const clusters = api.scale.collectClusters(scale);
            assert.equal(1, clusters.length);
            assert.equal('c1', clusters[0].clusterId);
        });

        it('collectClusters(CLUSTER).', function() {
            const scale = api.scale.CLUSTER;
            const clusters = api.scale.collectClusters(scale);
            assert.equal(1, clusters.length);
            assert.equal('c1', clusters[0].clusterId);
        });

        it('collectClusters(CLOUD_2_CLUSTERS).', function() {
            const scale = api.scale.CLOUD_2_CLUSTERS;
            const clusters = api.scale.collectClusters(scale);
            assert.equal(2, clusters.length);
            assert.equal('c1', clusters[0].clusterId);
            assert.equal('c2', clusters[1].clusterId);
        });

        it('collectClusters(CLOUD_4_CLUSTERS).', function() {
            const scale = api.scale.CLOUD_4_CLUSTERS;
            const clusters = api.scale.collectClusters(scale);
            assert.equal(4, clusters.length);
            assert.equal('c1', clusters[0].clusterId);
            assert.equal('c2', clusters[1].clusterId);
            assert.equal('c3', clusters[2].clusterId);
            assert.equal('c4', clusters[3].clusterId);
        });
    });

});


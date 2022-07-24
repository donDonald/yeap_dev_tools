'use strict';

const assert = require('assert');

module.exports = function(api) {
    assert(api);

    const exec    = require('child_process').exec;
    const options  = require('./options.js');

//  Cloud setup example:
//
//  const scale = {
//      cloud: {
//          name: 'PrivateCloud'
//      },
//      clusters: [
//          {
//              id:'C1',
//          },
//          {
//              id:'C2',
//          }
//      ];
//  };

    const scale = {};

    const Scale = function(scale) {
        assert(scale);
        assert(scale.cloud);
        assert(scale.cloud.name);
        assert(scale.clusters);
        this.config = scale;
        this.description = this.config.description;

//      // Compute strategy for every cluster
//      // Have to support nproc here as well
//      this.config.clusters.forEach((cluster)=>{
//          assert(cluster.id);
//          assert(cluster.instance);
//          assert(cluster.cookie);
//          assert(cluster.workers);
//          if(typeof cluster.workers == 'number' && cluster.workers == 1) {
//              cluster.strategy = 'single';
//          } else {
//              cluster.strategy = 'cluster';
//          }
//      });
    }
    scale.Scale = Scale;

    /// \brief Get array of clusters
    Scale.prototype.getClusters = function() {
        return this.config.clusters;
    }

    /// \brief Create scale.js for given cluster index
    Scale.prototype.createConfig = function(clusterIndex, cb) {
        assert(false);
//      api.log.debug('api.sys.scale.Scale.createConfig(), clusterIndex:' + clusterIndex);
//      api.log.debug('config:'); api.log.dir(this.config);
//      assert(cb);

//      const cluster = this.config.clusters[clusterIndex];
//      assert(cluster);

//      const templateSrc = process.env.KZ_APP_ROOT + '/env/tools/IAS/0.1.400/scale.js.template';
//      const templateDst = '/tmp/scale.js';

//      const steps = [
//          'cp ' + templateSrc + ' ' + templateDst,
//          'sed \'s/%cloud%/"'     + this.config.cloud.name        + '"/\' -i ' + templateDst,
//          'sed \'s/%transport%/"' + this.config.cloud.transport   + '"/\' -i ' + templateDst,
//          'sed \'s/%instance%/"'  + cluster.instance              + '"/\' -i ' + templateDst,
//          'sed \'s/%host%/"'      + this.config.cloud.host        + '"/\' -i ' + templateDst,
//          'sed \'s/%rpcPort%/'    + this.config.cloud.rpcPort     + '/\' -i ' + templateDst,
//          'sed \'s/%subPort%/'    + this.config.cloud.subPort     + '/\' -i ' + templateDst,
//          'sed \'s/%cluster%/"'   + cluster.id                    + '"/\' -i ' + templateDst,
//          'sed \'s/%cookie%/"'    + cluster.cookie                + '"/\' -i ' + templateDst,
//          'sed \'s/%strategy%/"'  + cluster.strategy              + '"/\' -i ' + templateDst,
//          'sed \'s/%workers%/'    + cluster.workers               + '/\' -i ' + templateDst,
//      ];

//      const executeSteps = function(index, steps, cb) {
//          if (index<steps.length) {
//              const cmd = steps[index];
//              exec(cmd, function(error, stdout, stderr) {
//                  //api.log.debug('    ias.scale.set, error:' + error);
//                  //api.log.debug('    ias.scale.set, stdout:' + stdout);
//                  //api.log.debug('    ias.scale.set, stderr:' + stderr);
//                  if (error) {
//                      cb(error);
//                  } else {
//                      executeSteps(index+1, steps, cb);
//                  }
//              });
//          } else {
//              cb(undefined, templateDst);
//          }
//      }

//      executeSteps(0, steps, cb);
    }

    /// \brief Predefined single scaling mode.
    const SINGLE = {
        description: 'Single: 1 worker', 
        cloud: {
            name       : 'single',
        },
        clusters: [
            {
                id     : 'c1',
                workers: 1
            }
        ]
    }
    scale.SINGLE = SINGLE;
    scale.single = new scale.Scale(SINGLE);

    /// \brief Predefined cluster, 1 cluster by nproc workers.
    const CLUSTER = {
        description: 'Cloud: 1 cluster, nproc workers', 
        cloud: {
            name: 'cluster',
        },
        clusters: [
            {
                id     : 'c1',
                workers: 1 // PTFIXME since 1 cluster is 1 worker for now 'api.os.cpus().length'
            }
        ]
    }
    scale.CLUSTER = CLUSTER;
    scale.cluster  = new scale.Scale(CLUSTER);

    /// \brief Predefined cloud, 2 clusters by nproc workers.
    const CLOUD_2_CLUSTERS = {
        description: 'Cloud: 2 clusters, nproc workers each', 
        cloud: {
            name: 'cloud2clusters',
        },
        clusters: [
            {
                id     : 'c1',
                workers: 1 // PTFIXME since 1 cluster is 1 worker for now 'api.os.cpus().length'
            },
            {
                id     : 'c2',
                workers: 1 // PTFIXME since 1 cluster is 1 worker for now 'api.os.cpus().length'
            }
        ]
    }
    scale.CLOUD_2_CLUSTERS = CLOUD_2_CLUSTERS;
    scale.cloud2clusters  = new scale.Scale(CLOUD_2_CLUSTERS);

    /// \brief Predefined cloud, 4 clusters by nproc workers.
    const CLOUD_4_CLUSTERS = {
        description: 'Cloud: 4 clusters, nproc workers each', 
        cloud: {
            name: 'cloud4clusters',
        },
        clusters: [
            {
                id     : 'c1',
                workers: 1 // PTFIXME since 1 cluster is 1 worker for now 'api.os.cpus().length'
            },
            {
                id     : 'c2',
                workers: 1 // PTFIXME since 1 cluster is 1 worker for now 'api.os.cpus().length'
            },
            {
                id     : 'c3',
                workers: 1 // PTFIXME since 1 cluster is 1 worker for now 'api.os.cpus().length'
            },
            {
                id     : 'c4',
                workers: 1 // PTFIXME since 1 cluster is 1 worker for now 'api.os.cpus().length'
            },
        ]
    }
    scale.CLOUD_4_CLUSTERS = CLOUD_4_CLUSTERS;
    scale.cloud4clusters = new scale.Scale(CLOUD_4_CLUSTERS);

    /// \brief Collect clusters.
    scale.collectClusters = function(scale) {
        assert(scale.clusters);
        const result = [];
        scale.clusters.forEach((c)=>{
            result.push({clusterId:c.id});
        });
        return result;
    }

    /// \brief Collect workers nodes for a given scale configuration.
    scale.collectWorkers = function(scale) {
        const s = new Scale(scale);
        assert(s.config.clusters);
        assert(s.config.clusters);
        const nodes = [];
        s.config.clusters.forEach((cluster)=>{
            assert(cluster.id);
/////           assert(cluster.instance);
/////           assert(cluster.cookie);
/////           assert(cluster.workers);
/////           assert(cluster.strategy);

            let workersCount = typeof cluster.workers == 'string' ? eval(cluster.workers) : cluster.workers;
            let shift = 0;
////            if(cluster.strategy !== 'single') {
////                nodes.push({clusterId:cluster.id, nodeId:cluster.id + 'N0', role:'master'});
////                ++shift; // in case of cluster 0 node is master.
////            }
            for(let i=0; i<workersCount; ++i) {
                nodes.push({clusterId:cluster.id, nodeId:cluster.id + 'N' + (i+shift), role:'worker'});
            }
        });

//      api.log.debug('api.sys.scale.collectWorkers(), nodes:'); api.log.dir(nodes);
        return nodes;
    }

    return scale;
}


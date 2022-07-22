'use strict';

describe("yeap_dev_tools.etc_hosts_docker, System helper for updating /etc/hosts with a given docker container.", ()=>{

    const assert = require('assert');
    const exec = require('child_process').exec;
    const re = (module)=>{ return require('../' + module); }

    let hosts, docker_compose, dc, checkRecordExists;
    before(()=>{
        docker_compose = re('docker_compose.js');
        hosts = re('etc_hosts_docker.js');
        checkRecordExists = (name, cb)=>{
            const str = `${name}`;

            const cmd = [
                'grep \"' + str + '\" /etc/hosts',
            ].join("\n");
        //  console.log(cmd);

            const execOptions = {
                env: Object.assign({}, process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
            };

            exec(cmd, execOptions, function(error, stdout, stderr) {
        //      console.log('error:  ' + error);
        //      console.log('stdout: ' + stdout);
        //      console.log('stderr: ' + stderr);
                error = error || stderr;
                if (error) {
                    //cb(error);
                    cb(undefined, false);
                } else {
                    cb(error, stdout.includes(str));
                }
            });
        }
    });

    it('set context', ()=>{
        dc = docker_compose(`${__dirname}/pg_test`);
    });

    it('#ps, check no containers are up and running', (done)=>{
        dc.ps((err, containers)=>{
            assert(!err, err);
            assert(containers);
            assert.equal(0, Object.keys(containers).length);
            done();
        });
    });

    it('Check here is no such record for pg_test_pgadmin_1', (done)=>{
        checkRecordExists('pg_test_pgadmin_1', (err, found)=>{
            assert(!err);
            assert(!found);
            done();
        });
    });

    it('Check here is no such record for pg_test_postgres_1', (done)=>{
        checkRecordExists('pg_test_postgres_1', (err, found)=>{
            assert(!err);
            assert(!found);
            done();
        });
    });

    let docker_containers;
    it('#up,  check all containers up and running', (done)=>{
        dc.up((err, containers)=>{
            assert(!err, err);
            assert(containers);
            assert.equal(2, Object.keys(containers).length);

            assert(containers.pg_test_pgadmin_1);
            assert.equal('Up', containers.pg_test_pgadmin_1.state);
            assert.equal('pg_test_pgadmin_1', containers.pg_test_pgadmin_1.name);
            assert.equal('/entrypoint.sh', containers.pg_test_pgadmin_1.command);
            assert.equal('443/tcp, 0.0.0.0:51111->80/tcp,:::51111->80/tcp', containers.pg_test_pgadmin_1.ports);

            assert(containers.pg_test_postgres_1);
            assert.equal('Up', containers.pg_test_postgres_1.state);
            assert.equal('pg_test_postgres_1', containers.pg_test_postgres_1.name);
            assert.equal('docker-entrypoint.sh postgres', containers.pg_test_postgres_1.command);
            assert.equal('0.0.0.0:55432->5432/tcp,:::55432->5432/tcp', containers.pg_test_postgres_1.ports);
            docker_containers = containers;
            done();
        });
    });

    it('Add pg_test_pgadmin_1 container', (done)=>{
        assert(docker_containers.pg_test_pgadmin_1);
        hosts.add(docker_containers.pg_test_pgadmin_1.name, (err)=>{
            assert(!err);
            done();
        });
    });

    it('Check record for pg_test_pgadmin_1 exists', (done)=>{
        checkRecordExists('pg_test_pgadmin_1', (err, found)=>{
            assert(!err);
            assert(found);
            done();
        });
    });

    it('Add pg_test_postgres_1 container', (done)=>{
        assert(docker_containers.pg_test_postgres_1);
        hosts.add(docker_containers.pg_test_postgres_1.name, (err)=>{
            assert(!err);
            done();
        });
    });

    it('Check record for pg_test_postgres_1 exists', (done)=>{
        checkRecordExists('pg_test_postgres_1', (err, found)=>{
            assert(!err);
            assert(found);
            done();
        });
    });

    it('Remove pg_test_pgadmin_1 container', (done)=>{
        assert(docker_containers.pg_test_pgadmin_1);
        hosts.remove(docker_containers.pg_test_pgadmin_1.name, (err)=>{
            assert(!err);
            done();
        });
    });

    it('Check here is no such record for pg_test_pgadmin_1', (done)=>{
        checkRecordExists('pg_test_pgadmin_1', (err, found)=>{
            assert(!err);
            assert(!found);
            done();
        });
    });

    it('remove pg_test_postgres_1 container', (done)=>{
        assert(docker_containers.pg_test_postgres_1);
        hosts.remove(docker_containers.pg_test_postgres_1.name, (err)=>{
            assert(!err);
            done();
        });
    });

    it('Check here is no such record for pg_test_postgres_1', (done)=>{
        checkRecordExists('pg_test_postgres_1', (err, found)=>{
            assert(!err);
            assert(!found);
            done();
        });
    });

    it('#down, check no containers', (done)=>{
        dc.down((err, containers)=>{
            assert(!err, err);
            assert(!containers);
            done();
        });
    });

});


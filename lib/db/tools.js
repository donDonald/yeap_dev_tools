'use strict';

const assert = require('assert');

const tools = {};

tools.masterDbProps = {
    host: '127.0.0.1',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'example',
};

// \brief Perform a set of queries on a database.
tools.querySqls = (dbc, queries, cb)=>{
    assert(dbc);
    assert(queries);
    assert(cb);

    const run = function(index, queries, cb) {
        if (index < queries.length) {
//          console.log('tools.querySqls, q:' + queries[index]);
            dbc.query(queries[index], [], function(err, res) {
                if (err) {
                    console.log('tools.querySqls, err:' + err);
                }
                assert(!err, err + ', q:' + queries[index]);
                run(index + 1, queries, cb)
            });
        } else {
            cb();
        }
    }

    run(0, queries, ()=>{
        cb();
    });
}

tools.schemas = process.env.APP_ROOT + '/dbschemas/';
tools.tableUsers= 'users.sql';
tools.tableDeployments = 'deployments.sql';
tools.tableLogins = 'logins.sql';
tools.tableGroups = 'groups.sql';
tools.tableUsersGroups = 'usersgroups.sql';

module.exports = tools;


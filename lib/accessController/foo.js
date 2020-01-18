'use strict';

const assert = require('assert');
const Rbac = require('fast-rbac').default;

module.exports = function(api) {
    assert(api);

    const Ac = function() {
        this.impl = new Rbac();
        this.GUESTS = Ac.GUESTS;
    }

    Ac.GUESTS = 'guests';

    Ac.prototype.tmp = function(access, resource, operation) {
        console.log(`lib.tools.Ac.tmp(), access:${access}, resource:${resource}, operation:${operation}`);
        for (const role of access.groups) {
            this.add(role, resource, operation);
        }
        if (access.guests === true) {
            this.add(Ac.GUESTS, resource, operation);
        }
    }

    Ac.prototype.add = function(role, resource, operation) {
        console.log(`lib.tools.Ac.add(), role:${role}, resource:${resource}, operation:${operation}`);
        this.impl.add(role, resource, operation);
    }

    Ac.prototype.can = function(roles, resource, operation) {
        console.log(`lib.tools.Ac.can(), roles:${roles}, resource:${resource}, operation:${operation}`);
        let can = false;
        for (const role of roles) {
            can = this.impl.can(role, resource, operation);
            if (can) break;
        }
        console.log(`lib.tools.Ac.can, can:${can}`);
        return can;
    }

    return Ac;
}


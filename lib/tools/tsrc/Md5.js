'use strict';

describe('lib.tools.Md5', function() {

    let assert, api;

    before(()=>{
        assert = require('assert');
        const re = function(module) { return require('../../' + module); }

        api = {};
        api.lib = {};
        api.lib.tools     = {};
        api.lib.tools.MD5 = re('tools/Md5.js')(api);
    });


    it('Empty string', function() {
        const h = api.lib.tools.MD5('');
        assert.equal(h, 'd41d8cd98f00b204e9800998ecf8427e');
    });

    it('A', function() {
        const h = api.lib.tools.MD5('A');
        assert.equal(h, '7fc56270e7a70fa81a5935b72eacbe29');
    });

    it('a', function() {
        const h = api.lib.tools.MD5('a');
        assert.equal(h, '0cc175b9c0f1b6a831c399e269772661');
    });

});


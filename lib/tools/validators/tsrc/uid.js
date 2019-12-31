'use strict';

describe('lib.tools.validators.uid', function() {

    const assert = require('assert');
    const re = function(module) { return require('../../../../' + module); }
    const Router = re('lib/testTools/express/Router')();
    const Request = re('lib/testTools/express/Request')();
    const Response = re('lib/testTools/express/Response')();

    let api, uid;

    before(()=>{
        api = {};
        api.lib = {};
        api.lib.tools = {};
        api.lib.tools.Md5 = re('lib/tools/Md5')(api);
        api.model = {};
        api.model.types = re('model/types')(api);
        api.model.makeId = re('model/makeId')(api);
        api.model.User = re('model/User')(api);
        uid = re('lib/tools/validators/uid')(api);
    });


    let router, handler=()=>{};
    it('Create router', function() {
        router = new Router();
        router.get('go', uid.rules(), uid.validate, (req, res, next)=>{ handler(); });
    });

    it('FAILURE, {}', function(done) {
        const req = new Request(
            {
            }
        );

        const res = new Response();
        res.wait(()=>{
//          console.log('res:', res);
            assert.equal(400, res.result.code);
            assert.equal(res.resultStr, '{"code":400,"value":{"errors":[{"uid":"Invalid value"}]}}');
            done();
        });

        router.handleRoute('go', req, res, router.next);
    });

    it('FAILURE, {uid:1}', function(done) {
        const req = new Request(
            {
                uid:1
            }
        );

        const res = new Response();
        res.wait(()=>{
//          console.log('res:', res);
            assert.equal(400, res.result.code);
            assert.equal(res.resultStr, '{"code":400,"value":{"errors":[{"uid":"Invalid value"}]}}');
            done();
        });

        router.handleRoute('go', req, res, router.next);
    });

    it('FAILURE, {uid:"INSERT ()"}', function(done) {
        const req = new Request(
            {
                uid:'INSERT ()'
            }
        );

        const res = new Response();
        res.wait(()=>{
//          console.log('res:', res);
            assert.equal(400, res.result.code);
            assert.equal(res.resultStr, '{"code":400,"value":{"errors":[{"uid":"Invalid value"}]}}');
            done();
        });

        router.handleRoute('go', req, res, router.next);
    });

    it('SUCCESS, {uid:<real UID>}', function(done) {
        const req = new Request(
            {
                uid: api.model.User.makeId()
            }
        );

        const res = new Response();
        res.wait(()=>{
//          console.log('res:', res);
            assert.equal(200, res.result.code);
            done();
        });

        handler = ()=>{ res.sendStatus(200); };
        router.handleRoute('go', req, res, router.next);
    });
});


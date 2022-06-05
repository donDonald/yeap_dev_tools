'use strict';

describe('lib.validators.name', ()=>{

    const assert = require('assert');
    const re = (module)=>{ return require('../../' + module); }
    const Router = re('express/Router')();
    let Get = re('express/Get')();
    Get = Get.bind(undefined, (req)=>{});
    const Response = re('express/Response')();

    let api, validator;

    before(()=>{
        api = {};
        api.lib = {};
        api.lib.Md5 = re('Md5')(api);
        api.lib.types = re('types')(api);
        api.lib.makeId = re('makeId')(api);
        api.lib.types = re('types')(api);
        validator = re('validators/name')(api);
    });


    let router, handler=()=>{};
    it('Create router', ()=>{
        router = new Router();
        router.get('go', validator.rules(), validator.validate, (req, res, next)=>{ handler(); });
    });

    it('FAILURE, {}', (done)=>{
        const req = new Get(
            {
            }
        );

        const res = new Response();
        res.wait(()=>{
//          console.log('res:', res);
            assert.equal(400, res.result.code);
            assert.equal(res.resultStr, '{"code":400,"value":{"errors":[{"name":"Invalid value"}]}}');
            done();
        });

        router.handle('go', req, res, router.next);
    });

    it('FAILURE, {name:""}', (done)=>{
        const req = new Get(
            {
                name:''
            }
        );

        const res = new Response();
        res.wait(()=>{
//          console.log('res:', res);
            assert.equal(400, res.result.code);
            assert.equal(res.resultStr, '{"code":400,"value":{"errors":[{"name":"Invalid value"}]}}');
            done();
        });

        router.handle('go', req, res, router.next);
    });

    it('FAILURE, {name:"a"}', (done)=>{
        const req = new Get(
            {
                name:'a'
            }
        );

        const res = new Response();
        res.wait(()=>{
//          console.log('res:', res);
            assert.equal(400, res.result.code);
            assert.equal(res.resultStr, '{"code":400,"value":{"errors":[{"name":"Invalid value"}]}}');
            done();
        });

        router.handle('go', req, res, router.next);
    });

    it('FAILURE, {name:"abcdefghijklmnopq"}', (done)=>{
        const req = new Get(
            {
                name:'abcdefghijklmnopq'
            }
        );

        const res = new Response();
        res.wait(()=>{
//          console.log('res:', res);
            assert.equal(400, res.result.code);
            assert.equal(res.resultStr, '{"code":400,"value":{"errors":[{"name":"Invalid value"}]}}');
            done();
        });

        router.handle('go', req, res, router.next);
    });

    it('FAILURE, {name:"INSERT ()"}', (done)=>{
        const req = new Get(
            {
                name:'INSERT ()'
            }
        );

        const res = new Response();
        res.wait(()=>{
//          console.log('res:', res);
            assert.equal(400, res.result.code);
            assert.equal(res.resultStr, '{"code":400,"value":{"errors":[{"name":"Invalid value"}]}}');
            done();
        });

        router.handle('go', req, res, router.next);
    });

    it('SUCCESS, {name:"abc"}', (done)=>{
        const req = new Get(
            {
                name: 'abc'
            }
        );

        const res = new Response();
        res.wait(()=>{
//          console.log('res:', res);
            assert.equal(200, res.result.code);
            done();
        });

        handler = ()=>{ res.sendStatus(200); };
        router.handle('go', req, res, router.next);
    });

    it('SUCCESS, {name:"abcdefghijklmnop"}', (done)=>{
        const req = new Get(
            {
                name: 'abcdefghijklmnop'
            }
        );

        const res = new Response();
        res.wait(()=>{
//          console.log('res:', res);
            assert.equal(200, res.result.code);
            done();
        });

        handler = ()=>{ res.sendStatus(200); };
        router.handle('go', req, res, router.next);
    });

    it('SUCCESS, {name:"some-name"}', (done)=>{
        const req = new Get(
            {
                name: 'some-name'
            }
        );

        const res = new Response();
        res.wait(()=>{
//          console.log('res:', res);
            assert.equal(200, res.result.code);
            done();
        });

        handler = ()=>{ res.sendStatus(200); };
        router.handle('go', req, res, router.next);
    });

    it('SUCCESS, {name:"some_name"}', (done)=>{
        const req = new Get(
            {
                name: 'some_name'
            }
        );

        const res = new Response();
        res.wait(()=>{
//          console.log('res:', res);
            assert.equal(200, res.result.code);
            done();
        });

        handler = ()=>{ res.sendStatus(200); };
        router.handle('go', req, res, router.next);
    });

    it('SUCCESS, {name:"some.name"}', (done)=>{
        const req = new Get(
            {
                name: 'some.name'
            }
        );

        const res = new Response();
        res.wait(()=>{
//          console.log('res:', res);
            assert.equal(200, res.result.code);
            done();
        });

        handler = ()=>{ res.sendStatus(200); };
        router.handle('go', req, res, router.next);
    });

    it('SUCCESS, {name:"0some.name"}', (done)=>{
        const req = new Get(
            {
                name: '0some.name'
            }
        );

        const res = new Response();
        res.wait(()=>{
//          console.log('res:', res);
            assert.equal(200, res.result.code);
            done();
        });

        handler = ()=>{ res.sendStatus(200); };
        router.handle('go', req, res, router.next);
    });

    it('SUCCESS, {name:"some.name9"}', (done)=>{
        const req = new Get(
            {
                name: '1some.name9'
            }
        );

        const res = new Response();
        res.wait(()=>{
//          console.log('res:', res);
            assert.equal(200, res.result.code);
            done();
        });

        handler = ()=>{ res.sendStatus(200); };
        router.handle('go', req, res, router.next);
    });
});


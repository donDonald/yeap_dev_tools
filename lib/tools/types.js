'use strict';

module.exports = (api)=>{

    const types = {};

    // Common types
    types.hash4          = /^[A-Fa-f0-9]{4}$/;
    types.hash8          = /^[A-Fa-f0-9]{8}$/;
    types.hash16         = /^[A-Fa-f0-9]{16}$/;
    types.hash32         = /^[A-Fa-f0-9]{32}$/;
    types.text8max       = /^[A-Za-z]{0,8}$/;
    types.name           = /^[A-Za-z]{2,16}$/;
    types.uint           = /^[0-9]{1,16}$/;

    types.userId      = types.hash32;

    return types;
}


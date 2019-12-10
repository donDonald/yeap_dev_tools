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

    types.userId         = types.hash32;
    types.Did            = types.hash32;
    types.Cat            = types.hash32;
    types.Uid            = types.hash32;
    types.AuthProviderName = /^[0-9a-zA-Z\-]{2,16}$/;

    return types;
}


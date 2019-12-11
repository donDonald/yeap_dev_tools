'user string';

const assert = require('assert');

module.exports = function () {

    const Request = function(query) {
        this.query = query;
    }

    // Subclass req
    const req = require('passport/lib/http/request.js');
    Request.prototype = Object.create(req);

    return Request;
}


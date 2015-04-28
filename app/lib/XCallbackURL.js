function XCallbackURL(_url) {
    this.url = _url;
    this.parsedURI = parseUri(_url);
}
XCallbackURL.prototype.isCallbackURL = function() {
    return this.parsedURI.host.toLowerCase() == 'x-callback-url';
};
XCallbackURL.prototype.action = function() {
    // Support non x-callback-url by falling back to host
    return this.parsedURI.file || this.parsedURI.host;
};
XCallbackURL.prototype.param = function(_key) {
    if (this.parsedURI.queryKey && this.parsedURI.queryKey[_key]) {
        return unescape(this.parsedURI.queryKey[_key]);
    }
    return null;
};
XCallbackURL.prototype.params = function() {
    if (this.parsedURI.queryKey) {
        var params = {};
        for (var _key in this.parsedURI.queryKey) {
            params[_key] = unescape(this.parsedURI.queryKey[_key]);
        }
        return params;
    }
    return null;
};
XCallbackURL.prototype.hasSource = function() {
    return this.param('x-source') ? true : false;
};
XCallbackURL.prototype.source = function() {
    return this.param('x-source');
};
XCallbackURL.prototype.hasCallback = function() {
    return this.param('x-success') ? true : false;
};
XCallbackURL.prototype.callbackURL = function(_params) {
    var url = this.param('x-success');
    if (!url) {
        return url;
    }
    url += "?";
    for (var item in _params) {
        url += (item + "=" + escape(_params[item]) + "&");
    }
    return url;
};
XCallbackURL.prototype.hasErrorCallback = function() {
    return this.param('x-error') ? true : false;
};
XCallbackURL.prototype.errorCallbackURL = function(_code, _msg) {
    var url = this.param('x-error');
    url += "?status=" + _code;
    url += "&message=" + escape(_msg);
    return url;
};

// based on : http://blog.stevenlevithan.com/archives/parseuri

function parseUri(str) {
    var o = parseUri.options,
        m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
}

parseUri.options = {
    strictMode: true,
    key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
    q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
};

exports.parse = function(_url) {
    return new XCallbackURL(_url);
};

# Menu
CommonJS module for parsing URLs according to the [X-Callback-URL](http://x-callback-url.com/) standard.

Just as usefull for parsing URLs that do not have `x-callback-url` as host.

Based on the [non-CommonJS version](https://github.com/agiletortoise/TiXCallbackURL/blob/master/Resources/xcallbackurl/XCallbackURL.js) by Greg Pierce.

## How?
Learn by example:

```
var XCallbackURL = require('XCallbackURL');

var URL = XCallbackURL.parse('myscheme://action?key=value');

// Logs 'action'
Ti.API.debug(URL.action());

// Logs 'value'
Ti.API.debug(URL.param('key'));

// Logs '{key:value}'
Ti.API.debug(JSON.stringify(URL.params()));
```
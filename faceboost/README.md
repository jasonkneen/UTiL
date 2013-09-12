# Facebook
CommonJS module wrapping the Facebook module with additional methods.

## Usage
This CommonJS module extends the native [Facebook module](http://docs.appcelerator.com/titanium/latest/#!/api/Modules.Facebook) included with Titanium. To use it, just replace `facebook` by `faceboost` like this:

```
var facebook = require('faceboost');
```

## Reads App ID from tiapp.xml
Since on iOS the module requires the Facebook App ID to be set in your `tiapp.xml`, this wrapper module just reads it from there so you don't have to manually set it in the code as well anymore.

## Additional methos

### retrievePermissions(Callback\<Object\> callback]
Retrieves the actual granted permissions instead of just the requested onces that you get from `facebook.getPermissions()`. The callback receives a boolean `e.success` and an array of `e.permissions`.

### hasPermissions(String[] permissions, Callback\<Object\> callback)
Checks if the permissions (array or single string) are granted. The callback receives a boolean `e.success` which is `true` if all permissions are granted. An array of all missing permissions is returned via `e.missing`.

### requestPermissions(String[] permissions, String scope, Callback\<Object\> callback)
Uses `hasPermissions` to and then the native module's `reauthorize` to request permissions that were missing. Then it calls `hasPermissions` again and passes the result back to the callback.
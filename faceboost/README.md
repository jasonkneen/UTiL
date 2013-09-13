# Facebook
CommonJS module wrapping the Facebook module with additional methods.

## Usage
This CommonJS module extends the native [Facebook module](http://docs.appcelerator.com/titanium/latest/#!/api/Modules.Facebook) included with Titanium. To use it, just replace `facebook` by `faceboost` like this:

```
var facebook = require('faceboost');
```

## Reads App ID from tiapp.xml
Since on iOS the module requires the Facebook App ID to be set in your `tiapp.xml`, this wrapper module just reads it from there so you don't have to manually set it in the code as well anymore.

## Additional methods
All methods can be found under their own `boost` namespace.

### boost.getPermissions(Callback\<Object\> callback)
Retrieves the actual granted permissions instead of just the requested onces that you get from `facebook.getPermissions()`. The callback receives a boolean `e.success` and an array of `e.permissions`.

### boost.hasPermissions(String[] permissions, Callback\<Object\> callback)
Checks if the permissions (array or single string) are granted. The callback receives a boolean `e.success` which is `true` if all permissions are granted. An array of all missing permissions is returned via `e.missing`.

### boost.requestPermissions(String[] permissions, String scope, Callback\<Object\> callback)
Uses `hasPermissions` to and tries to get them if it hasn't. Then it calls `hasPermissions` again and passes the result back to the callback. For iOS, it uses the `reauthorize` method, but for Android it actually does logs out and back in again until [this JIRA ticket](https://jira.appcelerator.org/browse/TC-2922) is resolved.

### boost.authorize(Callback\<Object\> callback)
Wraps the authorize method and login event and returns the result to the callback.

### boost.logout(Callback\<Object\> callback)
Wraps the logout method and event and returns the result to the callback.

### boost.removeCallback(Callback\<Object\> callback)
In some rare cases the login/logout events never fire after authorize/logout were called. Use this method to clean up the callback used in boost's authorize/logout methods.

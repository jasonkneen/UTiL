# Urban Airport
CommonJS module wrapping Appcelerator's [iOS and Android modules for Urban Airship](https://marketplace.appcelerator.com/apps/4984).

## Why?
The iOS and Android implementations have differences in both registering for and reacting to push notifications. This modules takes care of these.

## How?

### Read the blog
On [http://fokkezb.nl/2013/10/14/setting-up-urban-airship/](http://fokkezb.nl/2013/10/14/setting-up-urban-airship/) you'll find a complete walk-through on setting up Urban Airship with this wrapper.

### Learn by example
```javascript
var urbanairport = require('urbanairport');
 
urbanairport.register({
  debug: true, // Show debug info
 
  // Sets push types
  sound: true,   // iOS + Android (default)
  vibrate: true, // Android (default)
  badge: true,   // iOS (default)
  alert: true,   // iOS (default)
 
  // Use any native property or single-property method of the modules
  showOnAppClick: true,
  
  // Enable compatibility-mode (see blog)
  compatibility: true,
 
  // On Android these will be automatically set once UA is flying
  alias: 'John',
  tags: 'single', // Supports both a single or Array of strings!
 
  callback: function(e) { // The only callback you need
  
    // Registration failed
    if (e.type === 'error') {
      alert('Sorry, no push for you: ' + e.error);
 
    // Registration done
    } else if (e.type === 'success') {
      alert('Your token is: ' + e.deviceToken);
 
    // Received notification
    } else if (e.type === 'callback') {
 
      // Properties are normalized for iOS and Android:
      // e.payload === e.data === e.data.aps
      // e.message === e.data.alert === e.data.aps.alert
      alert(e.message);
    }
  }
});
 
// Manually disable/re-enable push
urbanairport.disable(); // enable();
 
// Append tags instead of resetting them
urbanairport.addTags('foo'); // Both single and Array supported
```

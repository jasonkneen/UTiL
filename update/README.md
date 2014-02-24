# Update (iOS)
CommonJS module checking for updates of the app.

## Why?
Because not all people have the automatic updates enabled on iOS7 and some are stuck on iOS6 and ignore the 108223+ badge count of the App Store app.

## Oneliner
At minimum it takes just a single line of code to use. By default it will check once a day and uses the bundleID (`Ti.App.id`) to do the lookup.

```
require('update').test();
```

If the user chooses `No, thank you` he will not be prompted again for this specific version. If he chooses `Not now`, he will we prompted again after `daysBetween`.

## Options
Learn by example:

```
var update = require('update');

// set texts for the dialog (default shown here)
update.title = 'New version available';
update.message = 'Upgrade to %version for:\n\n%notes';
update.yes = 'Yes';
update.later = 'Not now';
update.never = 'No, thank you';

// use an appleID for the lookup instead of 'Ti.App.id'
update.appleId = null;

// change the number of days between checks
update.daysBetween = 1;

// force check, ignoring 'daysBetween'
update.check();

// open the app in AppStore
update.open();

// reset properties keeping last check and if user choose 'never'
update.reset();
```
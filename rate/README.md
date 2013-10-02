# Rate
CommonJS module popping the 'rate-my-app' question at just the right time.

## Why?
We all know these popups asking us to Please rate my app. Getting lots of ratings is important for high rankings in both Apple and Android app stores. But popping the question at the wrong time could get you low rating and bad reviews.

This module deals with that.

## Oneliner
At minimum it takes just a single line of code to use. By default it brings up the question after 3 days when the code has been executed at least 3 times. It then gets your app’s Bundle ID from Ti.App.id and looks up the required Apple ID online.

```
require('rate').plus();
```

## Timing
I personally like to collect points at places where the user has positive interaction with the app, but wait before popping the question until he has finished doing it. You can achieve this in the following way:

```
var rate = require('rate');
 
// Put this on a happy place to add 1 (or more) points,
// but NOT ask the question if the required points have been met:
rate.plus(1, false);
 
// Put this on a place fit for asking the question if points have been met,
// without adding any points itself:
rate.test();
```

## Options
You can further tweak the behavior using these options:

```
var rate = require('rate');
 
// Set texts
rate.title = 'Pleeeeease rate!';
rate.message = 'I would be so thankful!';
rate.yes = 'Fine';
rate.later = 'Maybe later';
rate.never = 'Forget it';
 
// Set triggers
rate.pointsBetween = 100; // Points before asking and between each retry
rate.daysBetween = 10; // Days before asking and between each retry
rate.eachVersion = true; // Ask again every version (unless user chose 'never')
 
// Set Apple ID (found in iTunes Connect) manually
rate.appleId = 123456;
 
// Reset all triggers (including if user chose 'never', so be aware!)
rate.reset();
 
// Add 1 point and test if we should ask
rate.plus();
 
// Add more points and do not test
rate.plus(5, false);
 
// Just test
rate.test();
 
// Just ask
rate.show();
```

## Callback
You can set a simple callback to get notified of the response of the user, so you can attach some analytics. For example:

```
rate.listener = function(e) {
    switch (e.type) {
        case 'yes': break;
        case 'never': break;
        case 'later': break;
    }
};
```

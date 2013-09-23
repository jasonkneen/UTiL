# Parental Gate
CommonJS module providing simple mathematical question as parental gate for kids apps.

## Why?
With iOS7 Apple introduced a new [kids-category](https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewGrouping?cc=us&id=136474) in their App Store. To be listed, apps have to meet some additional [guidelines](https://developer.apple.com/appstore/resources/approval/guidelines.html), including *"Apps primarily intended for use by kids under 13 must get parental permission or use a parental gate before allowing the user to link out of the app or engage in commerce."*

## How?
Learn by example:

```
var gate = require('gate');

// Optionally override settings
gate.from = 1;   // Minimum for random 'x'
gate.to = 10;    // Maximum for random 'y'

// Optionally override texts (also via i18n)
gate.title = 'Checking your IQ';                    // gate_title
gate.message = 'How much is %s ?';                  // gate_message
gate.button = 'Try';                                // gate_button
gate.error_title = 'You failed big time!';          // gate_error_title
gate.error_message = 'No, you stupid! It was %s !'; // gate_error_message
gate.error_button = 'OK';                           // gate_error_button

gate.keeper(function (success) {

    // Returns TRUE if the question was answered OK
    if (success) {
        Ti.Platform.openURL('http://www.google.com');
    }
    
    // On FALSE an error dialog will be shown
    // No further action needed in most cases
});
```
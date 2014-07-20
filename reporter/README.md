# Error Reporter
CommonJS module using [yy.logcatcher](https://github.com/dbankier/TiLogCatcher) to let the user report run-time errors.

## Why?
Crash reports via Testflight and other services are nice, but don't give you all the information this script collects for you:

- A description of the steps to reproduce by the reporter.
- The JavaScript/Native error just like you'd get them in the console, including backtrace, file, line and message.
- All relevant `Ti.App` properties.
- All relevant `Ti.Platform` properties.
- All relevant `Ti.Platform.displayCaps` properties.
- A screenshot taken when the error occured.

In my experience asking the tester for the exact steps for me to reproduce the error help a lot to find and resolve the bug.

## How?

1. Install the [yy.logcatcher](https://github.com/dbankier/TiLogCatcher) module.
2. Drop the [script](https://github.com/FokkeZB/UTiL/blob/master/reporter/reporter.js) in your `Resources` or `app/lib` folder.
3. Add `require('reporter');` to your `Resources/app.js` or `app/alloy.js` file.

You might want to use reporter only when you distribute ad-hoc or to a store:

```javascript
if (Ti.Platform.deployType === 'production') {
  require('reporter');
}
```

## Example

![Screencast](https://github.com/FokkeZB/UTiL/blob/master/reporter/screencast.gif?raw=true)

## Options

```javascript
reporter = require('reporter');
reporter.recipients = 'mail@fokkezb.nl'; // or an array
reporter.alert_title = 'Error'; // or 'reporter_alert_title' in 'strings.xml'
reporter.alert_message = 'Please let me prepare a report for you to send to the developers.'; // or 'reporter_alert_message' in 'strings.xml'
reporter.alert_no = 'No'; // or 'reporter_alert_no' in 'strings.xml'
reporter.alert_yes = 'Yes'; // or 'reporter_alert_yes' in 'strings.xml'
reporter.alert_describe = 'Please describe what steps led to the error so the developers can reproduce the error'; // or 'reporter_email_describe' in 'strings.xml'
```

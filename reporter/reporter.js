require("yy.logcatcher").addEventListener('error', function(error) {

  Ti.Media.takeScreenshot(function(screenshot) {

    var alertDialog = Ti.UI.createAlertDialog({
      title: exports.alert_title,
      message: exports.alert_message,
      buttonNames: [exports.alert_no, exports.alert_yes],
      cancel: 0
    });

    alertDialog.addEventListener('click', function(e) {

      if (e.index === e.source.cancel) {
        return;
      }

      var messageBody = '<b>' + exports.email_describe + '</b><br><br><br><br><br>';
      messageBody += '<hr>';
      messageBody += '<ul>';

      for (var key in error) {
        messageBody += '<li><b>' + key + '</b><br>' + error[key] + '</li>';
      }

      messageBody += '</ul>';
      messageBody += '<hr>';
      messageBody += '<ul>';

      ['deployType', 'guid', 'id', 'installId', 'keyboardVisible', 'sessionId', 'version'].forEach(function(key) {
        messageBody += '<li><b>' + key + '</b><br>' + Ti.App[key] + '</li>';
      });

      ['architecture', 'availableMemory', 'batteryLevel', 'batteryState', 'id', 'locale', 'macaddress', 'ip', 'manufacturer', 'model', 'name', 'netmask', 'osname', 'ostype', 'processorCount', 'runtime', 'username', 'version'].forEach(function(key) {
        messageBody += '<li><b>' + key + '</b><br>' + Ti.Platform[key] + '</li>';
      });

      ['density', 'dpi', 'logicalDensityFactor', 'platformHeight', 'platformWidth', 'xdpi', 'ydpi'].forEach(function(key) {
        messageBody += '<li><b>' + key + '</b><br>' + Ti.Platform.displayCaps[key] + '</li>';
      });

      messageBody += '</ul>';

      var emailDialog = Ti.UI.createEmailDialog({
        subject: '[' + Ti.App.name + ' ' + Ti.App.version + '] ' + error.message,
        toRecipients: exports.recipients ? ((typeof exports.recipients === 'string') ? [exports.recipients] : exports.recipients) : undefined,
        messageBody: messageBody,
        html: true
      });

      emailDialog.addAttachment(screenshot.media);
      emailDialog.open();
    });

    alertDialog.show();

  });

});

exports.recipients = null;
exports.alert_title = L('reporter_alert_title', 'Error');
exports.alert_message = L('reporter_alert_message', 'Please let me prepare a report for you to send to the developers.');
exports.alert_no = L('reporter_alert_no', 'No');
exports.alert_yes = L('reporter_alert_yes', 'Yes');
exports.email_describe = L('reporter_email_describe', 'Please describe what steps led to the error so the developers can reproduce the error:');
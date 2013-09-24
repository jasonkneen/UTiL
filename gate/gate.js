function keeper(_callback) {

    // unlocked
    if (!exports.locked) {
        _callback(true);
        return;
    }

    // random mathematical question
    var x = _random();
    var y = _random();
    var s = x * y;

    // question
    var dialog = Ti.UI.createAlertDialog({
        title: exports.title,
        message: String.format(exports.message, x + 'x' + y),
        style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
        buttonNames: [exports.button]
    });

    // process answer
    dialog.addEventListener('click', function(e) {

        // ok
        if (parseInt(e.text, 10) === s) {
            _callback(true);

        // wrong
        } else {
            Ti.UI.createAlertDialog({
                title: exports.error_title,
                message: String.format(exports.error_message, '' + s),
                buttonNames: [exports.error_button]
            }).show();
            _callback(false);
        }
    });

    // show dialog
    dialog.show();
}

function toggle(_callback) {

    // lock
    if (!exports.locked) {
        exports.locked = true;

        if (typeof _callback !== 'undefined') {
            _callback(exports.locked);
        }

        return;
    }

    // gate to unlock
    keeper(function (success) {
        exports.locked = !success;

        if (typeof _callback !== 'undefined') {
            _callback(exports.locked);
        }
    });
}

// get random number
function _random() {
    return Math.floor(Math.random() * (exports.to - exports.from + 1) + exports.from);
}

// options
exports.from = 1;
exports.to = 10;
exports.locked = true;

// texts
exports.title = L('gate_title', 'Age check');
exports.message = L('gate_message', 'How much is %s ?');
exports.button = L('gate_button', 'Continue');
exports.error_title = L('gate_error_title', 'Age check failed');
exports.error_message = L('gate_error_message', 'The solution was %s');
exports.error_button = L('gate_error_button', 'OK');

// methods
exports.keeper = keeper;
exports.toggle = toggle;

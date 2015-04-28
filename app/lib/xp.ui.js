if (!OS_IOS) {

    var NavigationWindow = function (args) {
        this.args = args;
    };

    NavigationWindow.prototype.open = function (params) {
        params = params || {};
        params.displayHomeAsUp = false;
        return this.openWindow(this.args.window, params);
    };

    NavigationWindow.prototype.close = function (params) {
        return this.closeWindow(this.args.window, params);
    };

    NavigationWindow.prototype.openWindow = function (window, options) {
        var that = this;

        options = options || {};
        options.swipeBack = (typeof options.swipeBack === 'boolean') ? options.swipeBack : that.args.swipeBack;
        options.displayHomeAsUp = (typeof options.displayHomeAsUp === 'boolean') ? options.displayHomeAsUp : that.args.displayHomeAsUp;

        if (OS_ANDROID && options.animated !== false) {
            options.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
            options.activityExitAnimation = Ti.Android.R.anim.slide_out_right;
        }

        if (options.swipeBack !== false) {
            window.addEventListener('swipe', function (e) {
                if (e.direction === 'right') {
                    that.closeWindow(window, options);
                }
            });
        }

        if (OS_ANDROID && options.displayHomeAsUp !== false && !window.navBarHidden) {
            window.addEventListener('open', function () {
                var activity = window.getActivity();
                if (activity) {
                    var actionBar = activity.actionBar;
                    if (actionBar) {
                        actionBar.displayHomeAsUp = true;
                        actionBar.onHomeIconItemSelected = function () {
                            that.closeWindow(window, options);
                        };
                    }
                }
            });
        }

        return window.open(options);
    };

    NavigationWindow.prototype.closeWindow = function (window, options) {
        options = options || {};

        if (OS_ANDROID && options.animated !== false) {
            options.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
            options.activityExitAnimation = Ti.Android.R.anim.slide_out_right;
        }

        return window.close(options);
    };
}

exports.createNavigationWindow = function (args) {
    var navWin = OS_IOS ? Ti.UI.iOS.createNavigationWindow(args) : new NavigationWindow(args);

    if (args && args.id) {
        Alloy.Globals[args.id] = navWin;
    }

    return navWin;
};

exports.createWindow = function (args) {

    if (OS_IOS) {
        return Ti.UI.createWindow(args);
    } else {
        return Ti.UI.createView(args);
    }
};

exports.createTextArea = function (args) {
    var $textArea = Ti.UI.createTextArea(args);

    if (args.hintText) {
        $textArea.originalColor = $textArea.color || '#000';
        if (!$textArea.value) {
            $textArea.applyProperties({
                value: $textArea.hintText,
                color: '#ccc'
            });
        }

        $textArea.addEventListener('focus', function (e) {
            if (e.source.value == e.source.hintText) {
                e.source.applyProperties({
                    value: '',
                    color: e.source.originalColor
                });
            }
        });

        $textArea.addEventListener('blur', function (e) {
            if (!e.source.value) {
                e.source.applyProperties({
                    value: e.source.hintText,
                    color: '#ccc'
                });
            }
        });
    }

    return $textArea;
};

exports.createLabel = function createLabel(args) {

    if (OS_IOS && args.html) {
        var html = args.html;

        delete args.text;
        delete args.html;

        var label = Ti.UI.createLabel(args);
        var ref = label;

        var html2as = require('nl.fokkezb.html2as');

        html2as(html, function (err, attr) {

            if (err) {
                console.error(err);

            } else {
                ref.attributedString = attr;
            }

            ref = null;
        });

        return label;

    } else {
        return Ti.UI.createLabel(args);
    }
};

// helper
var isAndroid = Ti.Platform.osname == "android";

/**
 * Fixes the auto focus on textfield on android 
 */
exports.createTextField = function (args) {
    if (isAndroid) {
        var view = Ti.UI.createTextField(args);

        // fix auto focus
        view.addEventListener('focus', function focusFix(e) {
            e.source.blur();
            e.source.removeEventListener('focus', focusFix);
        });
        return view;
    } else {
        return Ti.UI.createTextField(args);
    }
};

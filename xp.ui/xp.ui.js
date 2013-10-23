if (!OS_IOS) {
    var NavigationWindow = function(args) {
        this.args = args;
    };

    NavigationWindow.prototype.open = function(params) {
        return this.openWindow(this.args.window, params);
    };

    NavigationWindow.prototype.close = function(params) {
        return this.closeWindow(this.args.window, params);
    };

    NavigationWindow.prototype.openWindow = function(window, options) {
        options = options || {};

        if (OS_ANDROID && options.animated !== false) {
            options.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
            options.activityExitAnimation = Ti.Android.R.anim.slide_out_right;
        }

        if (OS_ANDROID && options.isChild){
            window.addEventListener('open',function(){
                var activity=window.getActivity();
                if (activity.actionBar){
                    activity.actionBar.displayHomeAsUp=true;
                    activity.actionBar.onHomeIconItemSelected=function(){
                        window.close();
                    };
                }
            })
        }

        if (options.swipeBack !== false) {
            window.addEventListener('swipe', function(e) {
                if (e.direction === 'right') {
                    this.closeWindow(window, options);
                }
            });
        }

        return window.open(options);
    };

    NavigationWindow.prototype.closeWindow = function(window, options) {
        options = options || {};

        if (OS_ANDROID && options.animated !== false) {
            options.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
            options.activityExitAnimation = Ti.Android.R.anim.slide_out_right;
        }

        return window.close(options);
    };
}

exports.createNavigationWindow = function(args) {
    if (OS_IOS) {
        return Ti.UI.iOS.createNavigationWindow(args);

    } else {
        return new NavigationWindow(args);
    }
};
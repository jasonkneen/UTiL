function Menu(_win) {
    var win = _win,
        activity = null,
        actionBar = null,
        events = {},
        menuItems = [],
        $ = this;

    function trigger(name, once) {
    
        if (!events[name]) {
            return;
        }

        if (once) {
            
            while(events[name].length) {
                (events[name].shift())();
            }

        } else {
            var i, l;

            for (i = 0, l = events[name].length; i < l; i++) {
                events[name][i]();
            }
        }
    }

    function on(name, callback) {
        events[name] || (events[name] = []);
        events[name].push(callback);
    }

    function off(name, callback) {

        if (copy = events[name]) {
            var i, l, ev;

            events[name] = [];

            for (i = 0, l = copy.length; i < l; i++) {
                ev = copy[i];

                if (ev === callback) {
                    events[name].push(ev);
                }
            }

            if (!events[name].length) {
                delete events[name];
            }
        }
    }

    function onOpen(e) {
        win.removeEventListener('open', onOpen);

        if (!win.getActivity) {
            Ti.API.error('[MENU] Requires a heavyweight Window or TabGroup.');
            return;
        }

        activity = win.getActivity();

        activity.onCreateOptionsMenu = function (e) {
            var menu = e.menu;
            menu.clear();

            menuItems.forEach(function (options) {
                var onClick = options.onClick;
                var onCollapse = options.onCollapse;
                var onExpand = options.onExpand;

                delete options.onClick;
                delete options.onCollapse;
                delete options.onExpand;

                var menuItem = menu.add(options);

                if (onClick) {
                    menuItem.addEventListener('click', onClick);
                }

                if (onCollapse) {
                    menuItem.addEventListener('collapse', onCollapse);
                }

                if (onExpand) {
                    menuItem.addEventListener('expand', onExpand);
                }
            });
        };

        activity.invalidateOptionsMenu();

        if (activity.actionBar) {
            actionBar = activity.actionBar;

            actionBar.onHomeIconItemSelected = function () {
                trigger('homeIconItemSelected');
            };

            trigger('openActionBar', true);
        }
    }

    win.addEventListener('open', onOpen);

    $.actionBar = {
        hide: function () {

            if (actionBar === null) {
                on('openActionBar', $.actionBar.hide);

            } else {
                actionBar.hide();
            }

            return $.actionBar;
        },

        show: function () {

            if (actionBar === null) {
                on('openActionBar', $.actionBar.show);

            } else {
                actionBar.show();
            }

            return $.actionBar;
        },

        on: function (name, callback) {
            on(name, callback);

            return $.actionBar;
        },

        off: function (name, callback) {
            off(name, callback);

            return $.actionBar;
        },

        setOnHomeIconItemSelected: function(callback) {
            return $.actionBar.on('onHomeIconItemSelected', callback);
        },

        menu: $
    };

    ['BackgroundImage','DisplayHomeAsUp','Icon','Logo','Title'].forEach(function (name) {
        var method = 'set' + name;

        $.actionBar[method] = function(val) {

            if (actionBar === null) {
                on('openActionBar', function () {
                    $.actionBar[method](val);
                });

            } else {
                actionBar[method](val);
            }

            return $.actionBar;
        };
    });

    $.getActionBar = function () {
        return $.actionBar;
    };

    $.getMenu = function() {
        return $;
    };

    $.clear = function() {
        menuItems = [];
    };

    $.set = function(_menuItems) {
        menuItems = _menuItems;

        if (activity) {
            win.activity.invalidateOptionsMenu();
        }
    };

    $.add = function(options) {
        menuItems.push(options);

        if (activity) {
            win.activity.invalidateOptionsMenu();
        }

        // TODO: Return a menuItem object allowing on/off/remove etc
        return $;
    };
}

module.exports = Menu;

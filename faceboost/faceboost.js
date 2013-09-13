var _ = _ || require((typeof ENV_TEST === 'boolean') ? 'alloy' : 'underscore')._,
    OS_IOS = Ti.Platform.name === 'iPhone OS';

var _authorize_callback = null,
    _logout_callback = null;

facebook = require('facebook');
facebook.appid = Ti.App.Properties.getString('ti.facebook.appid');

facebook.addEventListener('login', function(e) {

    if (_.isFunction(_authorize_callback)) {
        _authorize_callback(e);
    }

    _authorize_callback = null;
});

facebook.addEventListener('logout', function(e) {

    if (_.isFunction(_logout_callback)) {
        _logout_callback(e);
    }

    _logout_callback = null;
});

facebook.boost = {

    // Allows to remove callback used with boostAuthorize or -Logout
    // making sure it's gone if event never fired for some reason
    removeCallback: function(_callback) {

        if (_authorize_callback === _callback) {
            _authorize_callback = null;
        }

        if (_logout_callback === _callback) {
            _logout_callback = null;
        }
    },

    authorize: function(_callback) {
        _authorize_callback = _callback;

        facebook.authorize();
    },

    logout: function(_callback) {
        _logout_callback = _callback;

        facebook.logout();
    },

    getPermissions: function(_callback) {

        facebook.requestWithGraphPath('/me/permissions', {}, 'GET', function(FacebookGraphResponse) {

            // Request failed
            if (!FacebookGraphResponse.success) {
                _callback(FacebookGraphResponse);
                return;
            }

            _callback({
                success: true,
                permissions: _.keys(JSON.parse(FacebookGraphResponse.result).data[0])
            });
        });
    },

    hasPermissions: function(_permissions, _callback) {

        if (_.isString(_permissions)) {
            _permissions = [_permissions];
        }

        facebook.boost.getPermissions(function(_response) {

            if (!_response.success) {
                _callback(_response);
                return;
            }

            var missing = _.difference(_permissions, _response.permissions);

            _callback({
                success: missing.length === 0,
                missing: missing,
                found: _response.permissions
            });
        });
    },

    requestPermissions: function(_permissions, _scope, _callback) {

        if (_.isString(_permissions)) {
            _permissions = [_permissions];
        }

        if (!_.isString(_scope)) {
            _scope = 'friends';
        }

        facebook.boost.hasPermissions(_permissions, function(_response) {

            // We have them all or failed retrieving
            if (_response.success || !_response.missing) {
                _callback(_response);
                return;
            }

            if (OS_IOS) {

                // Re-authorize with missing permissions
                facebook.reauthorize(_response.missing, _scope, function(FacebookReauthResponse) {

                    if (!FacebookReauthResponse.success) {
                        _callback(FacebookReauthResponse);
                        return;
                    }

                    // Check if we got what we needed
                    facebook.boost.hasPermissions(_response.missing, _callback);
                });

                // Workaround for: https://jira.appcelerator.org/browse/TC-2922
            } else {

                // Logout using callback because re-authorizing to soon gives error
                facebook.boost.logout(function(e) {

                    // Add missing permissions
                    facebook.permissions = _.union(facebook.permissions, _response.missing);

                    // Authorize again
                    facebook.boost.authorize(function(e) {

                        if (!e.success) {
                            _callback(e);
                            return;
                        }

                        // Check if we got what we needed
                        facebook.boost.hasPermissions(_response.missing, _callback);
                    });
                });
            }
        });
    }
};

module.exports = facebook;

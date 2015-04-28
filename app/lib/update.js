function test() {
    return _trigger();
}

function check() {
    return _trigger(true);
}

function open() {
    
    if (!exports.appleId) {
        
        _lookup(function (result) {
            
            if (!result) {
                return;
            }
            
            exports.appleId = result.trackId;
            return open();
        });
        
        return;
    }
    
    Ti.Platform.openURL('http://itunes.apple.com/app/id' + exports.appleId);
    return;
}

function reset() {
    console.debug('[UPDATE] Reset.');
    
    Ti.App.Properties.removeProperty('update_checked');
    Ti.App.Properties.removeProperty('update_never');
    
    return;
}
    
function _trigger(forced) {
    
    if (Ti.Platform.name !== 'iPhone OS') {
        console.debug('[UPDATE] Platform is not iOS.');
        return;
    }
    
    var now = (new Date() / 1000);
    
    if (!forced) {
        var checked = Ti.App.Properties.getInt('update_checked', 0);
    
        if (now - checked < (exports.daysBetween * 86400)) {
            console.debug('[UPDATE] Checked less than ' + exports.daysBetween + ' days ago.');
            return;
        }
    }

    _lookup(function (result) {
        
        if (!result) {
            return;
        }
        
        Ti.App.Properties.setInt('update_checked', now);
        
        if (_cmpVersion(result.version, Ti.App.version) <= 0) {
            console.debug('[UPDATE] No new version.');
            return;
        }
        
        if (!forced) {
            var never = Ti.App.Properties.getString('update_never');
            
            if (never === result.version) {
                console.debug('[UPDATE] Never ask again for this version.');
                return;
                    
            } else {
                Ti.App.Properties.removeProperty('update_never');
            }
        }
        
        var buttonNames, cancel;
        
        if (forced) {
            buttonNames = [exports.later, exports.yes];
            cancel = 0;
        } else {
            buttonNames = [exports.yes, exports.later, exports.never];
            cancel = 2;
        }
        
        var title, messsage;
        
        if (exports.title) {
            title = exports.title;
            
            if (exports.title.indexOf('%') !== -1) {
                title = title.replace('%version', result.version);
            }
        }
        
        if (exports.message) {
            message = exports.message;
            
            if (exports.message.indexOf('%') !== -1) {
                message = exports.message
                    .replace('%version', result.version)
                    .replace('%notes', result.releaseNotes);
            }
        }
        
        var alertDialog = Titanium.UI.createAlertDialog({
            title: title,
            message: message,
            buttonNames: buttonNames,
            cancel: cancel
        });
        
        alertDialog.addEventListener('click', function(e) {
            
            if (buttonNames[e.index] === exports.yes) {
                open();
                
            } else if (buttonNames[e.index] === exports.never) {
                Ti.App.Properties.setString('update_never', result.version);
            }
            
            return;
        });
        
        alertDialog.show();
        
        return;
    });
    
    return;
}

function _lookup(_callback) {
    var xhr = Ti.Network.createHTTPClient({
        onload: function (e) {
            if (xhr.status === 200 && this.responseText) {
                try {
                    var json = JSON.parse(this.responseText);

                    if (json.resultCount === 1) {
                        _callback(json.results[0]);
                        return;
                        
                    } else {
                        console.error('[UPDATE] LOOKUP ERROR ' + this.responseText);
                    }
                
                } catch (err) {
                    console.error('[UPDATE] LOOKUP ERROR ' + JSON.stringify(err));
                }
            }
            
            _callback();
            return;
        },
        onerror: function (e) {
            console.error('[UPDATE] LOOKUP ERROR ' + JSON.stringify(e.error));
            _callback();
            return;
        }
    });
    
    var url = 'http://itunes.apple.com/lookup?';
    
    if (exports.appleId) {
        url = url + 'id=' + exports.appleId;
    } else {
        url = url + 'bundleId=' + Ti.App.id;
    }

    xhr.open('GET', url);
    xhr.send();
    
    return;
}

function _cmpVersion(a, b) {
    var i, cmp, len, re = /(\.0)+[^\.]*$/;
    a = (a + '').replace(re, '').split('.');
    b = (b + '').replace(re, '').split('.');
    len = Math.min(a.length, b.length);
    for( i = 0; i < len; i++ ) {
        cmp = parseInt(a[i], 10) - parseInt(b[i], 10);
        if( cmp !== 0 ) {
            return cmp;
        }
    }
    return a.length - b.length;
}

exports.title = 'New version available';
exports.message = 'Upgrade to %version for:\n\n%notes';
exports.yes = 'Yes';
exports.later = 'Not now';
exports.never = 'No, thank you';

exports.appleId = null;
exports.daysBetween = 1;

exports.test = test;
exports.check = check;
exports.open = open;
exports.reset = reset;
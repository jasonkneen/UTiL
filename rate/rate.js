var _properties = {}, _platform;

function plus(_points, _show) {
    
    if (typeof _points !== 'number') {
        _points = 1;
    }
    
    return _trigger(_points, _show);
}

function test() {
    return _trigger();
}

function ask() {
    
    if (typeof _platform !== 'string') {
        _platform  = Ti.Platform.name;
    }
    
    if (_platform === 'iPhone OS' && !exports.appleId) {
        
        _lookup(function (result) {
            
            if (!result) {
                Ti.API.debug('[RATE] Lookup failed.');
                return;
            }
            
            exports.appleId = result.trackId;
            
            return ask();
        });
        
        return;
    }

    var buttonNames = [exports.yes, exports.later, exports.never];
    var cancel = buttonNames.length - 1;
    
    var alertDialog = Titanium.UI.createAlertDialog({
        title: exports.title,
        message: exports.message,
        buttonNames: buttonNames,
        cancel: cancel
    });
    
    alertDialog.addEventListener('click', function(e) {
        
        if (buttonNames[e.index] === exports.yes) {
            Ti.App.Properties.setString('rate_done', Ti.App.version);
            
            open();
            
        } else if (buttonNames[e.index] === exports.never) {
            Ti.App.Properties.setBool('rate_never', true);
        }
        
        return;
    });
    
    alertDialog.show();
    
    return;
}

function open() {
    
    if (Ti.Platform.name === 'android') {
        Ti.Platform.openURL('market://details?id=' + Ti.App.id);
                
    } else if (Ti.Platform.name === 'iPhone OS') {
        
        if (!exports.appleId) {
            _lookup(function (result) {
                
                if (!result) {
                    Ti.API.debug('[RATE] Lookup failed.');
                    return;
                }
                
                exports.appleId = result.trackId;
                return open();
            });
            
            return;
        }
        
        Ti.Platform.openURL('itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=' + exports.appleId + '&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software');
    }
    
    return;
}

function reset() {
    Ti.API.debug('[RATE] Reset.');
    
    Ti.App.Properties.removeProperty('rate_done');
    Ti.App.Properties.removeProperty('rate_never');
    Ti.App.Properties.removeProperty('rate_points');
    Ti.App.Properties.removeProperty('rate_asked');
    
    return;
}

function _trigger(_points, _show) {

    if (Ti.App.Properties.getBool('rate_never', false) === true) {
        Ti.API.debug('[RATE] Rating disabled by user.');
        return;
    }
    
    var rate_done = Ti.App.Properties.getString('rate_done');
    
    if (exports.eachVersion ? (rate_done === Ti.App.version) : rate_done) {
        Ti.API.debug('[RATE] Rating already done.');
        return;
    }
    
    var points = Ti.App.Properties.getInt('rate_points', 0);
    
    if (_points) {
        points = points + (_points || 1);
        Ti.API.debug('[RATE] Rating points changed to: ' + points);
    }
    
    var now = (new Date() / 1000),
        checked = Ti.App.Properties.getInt('rate_asked', 0);

    if (_show !== false) {
    	
	    if (points < exports.pointsBetween) {
	    	Ti.API.debug('[RATE] Not enough points: ' + points + ' of ' + exports.pointsBetween);
	    	_show = false;	
	    	
	    } else if (checked === 0 || (now - checked) < (exports.daysBetween * 86400)) {
	    	Ti.API.debug('[RATE] Not enough days: ' + Math.round((now - checked) / 86400) + ' of ' + exports.daysBetween);
	    	_show = false;
	    }
	}
    	
   	if (_show !== false) {
        Ti.API.debug('[RATE] Rating triggered!');
        
        Ti.App.Properties.setInt('rate_points', 0);
        Ti.App.Properties.setInt('rate_asked', now);
        
        ask();
        
    } else {
        Ti.App.Properties.setInt('rate_points', points);
    }
    
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
                        Ti.API.error('[RATE] LOOKUP ERROR ' + this.responseText);
                    }
                
                } catch (err) {
                    Ti.API.error('[RATE] LOOKUP ERROR ' + JSON.stringify(err));
                }
            }
            
            _callback();
            return;
        },
        onerror: function (e) {
            Ti.API.error('[RATE] LOOKUP ERROR ' + JSON.stringify(e.error));
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

exports.title = 'Like our app?';
exports.message = 'Please take a minute to rate it:';
exports.yes = 'Yes, of course';
exports.later = 'Ask me later';
exports.never = 'No, thank you';

exports.appleId = null;
exports.daysBetween = 3;
exports.pointsBetween = 3;
exports.eachVersion = false;

exports.plus = plus;
exports.test = test;
exports.ask = ask;
exports.open = open;
exports.reset = reset;
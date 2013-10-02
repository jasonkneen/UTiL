var ios = (Ti.Platform.name === 'iPhone OS'),
    android = (Ti.Platform.name === 'android'),
    ipad = (ios && Ti.Platform.osname === 'ipad'),
    callback = null,
    facebook_appid = null,
    facebook = null;

function onSocialComplete(e) {
    if (callback !== null) {
        e.type = 'complete';

        if (e.activityName) {
            e.platform = e.activityName;
        }

        callback(e);
    }
}

function onSocialCancelled(e) {
    if (callback !== null) {
        e.type = 'cancelled';

        if (e.activityName) {
            e.platform = e.activityName;
        }

        callback(e);
    }
}

if (ios) {
    var Social = require('dk.napp.social');

    Social.addEventListener('complete', onSocialComplete);
    Social.addEventListener('cancelled', onSocialCancelled);
}

function share(args, _callback) {
    callback = _callback || null;

    if (args.image) {
        
        if (typeof args.image === 'object') {
        
            if (args.image.resolve) {
                args.image_blob = args.image;
                args.image = args.image_blob.resolve();
                
            } else if (args.image.nativePath) {
                args.image_blob = args.image;
                args.image = args.image_blob.nativePath;
                
            } else {
                delete args.image;
            }
        
        } else if (args.image.indexOf('://') > 0) {
            args.image_url = args.image;
        }
    }

    if (args.image_url && !args.image) {
        args.image = args.image_url;
    }
    
    if (ios && Social.isActivityViewSupported()) {
        
        if (ipad) {
            Social.activityPopover({
                text: args.url ? (args.text ? args.text + ' ' + args.url : args.url) : args.text,
                image: args.image,
                removeIcons: args.removeIcons,
                view: args.view
            });
            
        } else {
            Social.activityView({
                text: args.url ? (args.text ? args.text + ' ' + args.url : args.url) : args.text,
                image: args.image,
                removeIcons: args.removeIcons
            }, args.customIcons);
        }
        
        return;
    }
    
    if (android) {
        var intent = Ti.Android.createIntent({
            action: Ti.Android.ACTION_SEND
        });
        
        if (args.text) {
            intent.putExtra(Ti.Android.EXTRA_TEXT, args.text);
        }
        
        if (args.text || args.description) {
            intent.putExtra(Ti.Android.EXTRA_SUBJECT, args.description || args.text);
        }
        
        if (args.image_blob) {
            intent.putExtraUri(Ti.Android.EXTRA_STREAM, args.image_blob);
        }
     
        var share = Ti.Android.createIntentChooser(intent, args.titleid ? L(args.titleid, args.title || 'Share') : (args.title || 'Share'));
        
        Ti.Android.currentActivity.startActivity(share);
        
        return;
    }
    
    var options = ['Twitter', 'Facebook', L('Mail'), L('Cancel')];
    
    if (args.removeIcons && typeof args.removeIcons === 'string') {
        var removeIcons = args.removeIcons.split(',');
        
        var removeTwitter = removeIcons.indexOf('twitter');
        if (removeTwitter >= 0) {
            options.splice(removeTwitter, 1);
        }
        
        var removeFacebook = removeIcons.indexOf('facebook');
        if (removeFacebook >= 0) {
            options.splice(removeFacebook, 1);
        }
        
        var removeMail = removeIcons.indexOf('mail');
        if (removeMail >= 0) {
            options.splice(removeMail, 1);
        }
    }
    
    if (options.length === 1) {
        return;
    }

    var dialog = Ti.UI.createOptionDialog({
        cancel: options.length - 1,
        options: options,
        title: args.title,
        titleid: args.titleid,
        androidView: args.androidView,
        tizenView: args.tizenView
    });
    
    dialog.addEventListener('click', function (e) {
        
       if (e.index === e.source.cancel) {
           return;
       }

       if (options[e.index] === 'Twitter') {
           
           if (ios && Social.isTwitterSupported()) {
               
               // Twitter SDK does not support both URL and image: https://github.com/viezel/TiSocial.Framework/issues/41
               Social.twitter({
                   text: (args.url && args.image) ? (args.text ? args.text + ' ' + args.url : args.url) : args.text,
                   image: args.image_url,
                   url: args.image ? null : args.url
               });
           }

       } else if (options[e.index] === 'Facebook') {
  
           if (ios && Social.isFacebookSupported()) {
               Social.facebook({
                   text: args.text,
                   image: args.image,
                   url: args.url
               });
           
           } else if (facebook_appid !== false) {
               
                if (!facebook_appid) {
                    facebook_appid = Ti.App.Properties.getString('ti.facebook.appid', false); 

                    if (facebook_appid === false) {
                        return;
                    }
                         
                    if (_cmpVersion(Ti.version, '3.1.0') >= 0) {
                        facebook = require('facebook');
                        facebook.appid = facebook_appid;
                    } else {
                        Ti.Facebook.appid = facebook_appid;
                    }
                }
                               
                if (facebook) {
                    facebook.dialog('feed', {
                        link: args.url,
                        caption: args.caption,
                        description: args.description || args.text,
                        picture: args.image_url
                    }, function (e) {
                        if (e.cancelled) {
                            onSocialCancelled({
                                success: false,
                                platform: 'facebook'
                            });
                        } else {
                            onSocialComplete({
                                success: e.success,
                                platform: 'facebook'
                            });
                        }
                    });
                   
                } else {
                    Ti.Facebook.dialog('feed', {
                        link: args.url,
                        caption: args.caption,
                        description: args.description || args.text,
                        picture: args.image_url
                    }, function (e) {
                        if (e.cancelled) {
                            onSocialCancelled({
                                success: false,
                                platform: 'facebook'
                            });
                        } else {
                            onSocialComplete({
                                success: e.success,
                                platform: 'facebook'
                            });
                        }
                    });
                }
            }
        
        } else if (options[e.index] === L('Mail')) {
            var emailDialog = Ti.UI.createEmailDialog({
                subject: args.description || args.text,
                html: true,
                messageBody: args.body || args.text + "<br /><br />" + args.url,
            });
            
            if (args.image_blob) {
                emailDialog.addAttachment(args.image_blob);
            }

            emailDialog.addEventListener('complete', function (e) {
                if (e.result === this.CANCELLED) {
                    onSocialCancelled({
                        success: false,
                        platform: 'mail'
                    });
                } else {
                    onSocialComplete({
                        success: (e.result === this.SENT),
                        platform: 'mail'
                    });
                }
            });
            
            emailDialog.open();
        }
       
        return;
    });

    if (ipad) {
        dialog.show({
            animated: args.animated,
            rect: args.rect,
            view: args.view
        });
        
    } else {
        dialog.show();
    }
    
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

if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = share;
    }
    exports.share = share;
}

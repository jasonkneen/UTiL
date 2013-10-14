var ios = (Ti.Platform.name === 'iPhone OS'),
    android = (Ti.Platform.name === 'android'),
    ipad = (ios && Ti.Platform.osname === 'ipad'),
    callback = null,
    facebook_appid = null,
    facebook_module = null;

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

function twitter(args, _callback) {
    callback = _callback || null;

    _init(args);

    _twitter(args);
}

function _twitter(args) {
    var webUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(args.url) + '&text=' + encodeURIComponent(args.text);
    var textUrl = (args.url && args.image) ? (args.text ? args.text + ' ' + args.url : args.url) : args.text;

    if (ios) {

        if (Social.isTwitterSupported()) {

            // Twitter SDK does not support both URL and image: https://github.com/viezel/TiSocial.Framework/issues/41
            Social.twitter({
                text: textUrl,
                image: args.image_url,
                url: args.image ? null : args.url
            });

        } else {
            var url = 'twitter://post?message=' + encodeURIComponent(textUrl);

            if (!Ti.Platform.canOpenURL(url)) {
                url = webUrl;
            }

            Ti.Platform.openURL(url);
        }

    } else {

        try {
            var intent = Ti.Android.createIntent({
                action: Ti.Android.ACTION_SEND,
                packageName: "com.twitter.android",
                className: "com.twitter.android.PostActivity",
                type: "text/plain"
            });
            intent.putExtra(Ti.Android.EXTRA_TEXT, textUrl);
            Ti.Android.currentActivity.startActivity(intent);

        } catch (error) {
            Ti.Platform.openURL(webUrl);
        }
    }
}

function facebook(args, _callback) {
    callback = _callback || null;

    args = _init(args);

    _facebook(args);
}

function _facebook(args) {
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
                if (!facebook_module) {
                    facebook_module = require('facebook');
                    facebook_module.appid = facebook_appid;
                }
            } else {
                Ti.Facebook.appid = facebook_appid;
            }
        }

        if (facebook_module) {
            facebook_module.dialog('feed', {
                link: args.url,
                caption: args.caption,
                description: args.description || args.text,
                picture: args.image_url
            }, function(e) {
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
            }, function(e) {
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
}

function mail(args, _callback) {
    callback = _callback || null;

    args = _init(args);

    _mail(args);
}

function _mail(args) {

    var emailDialog = Ti.UI.createEmailDialog({
        subject: args.description || args.text,
        html: true,
        messageBody: args.body || args.text + (args.url ? "<br /><br />" + args.url : ''),
    });

    if (args.image_blob) {
        emailDialog.addAttachment(args.image_blob);
    }

    emailDialog.addEventListener('complete', function(e) {
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

function share(args, _callback) {
    callback = _callback || null;

    args = _init(args);

    if (ios && Social.isActivityViewSupported()) {

        if (ipad) {
            Social.activityPopover({
                text: args.url ? (args.text ? args.text + ' ' + args.url : args.url) : args.text,
                image: args.image,
                removeIcons: args.removeIcons,
                view: args.view
            }, args.customIcons || []);

        } else {
            Social.activityView({
                text: args.url ? (args.text ? args.text + ' ' + args.url : args.url) : args.text,
                image: args.image,
                removeIcons: args.removeIcons
            }, args.customIcons || []);
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

        var shareActivity = Ti.Android.createIntentChooser(intent, args.titleid ? L(args.titleid, args.title || 'Share') : (args.title || 'Share'));

        Ti.Android.currentActivity.startActivity(shareActivity);

        return;
    }

    var options = [];
    var callbacks = [];

    if (!args.removeIcons || args.removeIcons.indexOf('twitter') === -1) {
        options.push('Twitter');
        callbacks.push(_twitter);
    }

    if (!args.removeIcons || args.removeIcons.indexOf('facebook') === -1) {
        options.push('Facebook');
        callbacks.push(_facebook);
    }

    if (!args.removeIcons || args.removeIcons.indexOf('mail') === -1) {
        options.push(L('Mail'));
        callbacks.push(_mail);
    }

    if (args.customIcons) {

        args.customIcons.forEach(function (customIcon) {
            options.push(customIcon.title);
            callbacks.push(customIcon.callback);
        });
    }

    if (options.length === 0) {
        return;
    }

    options.push(L('Cancel'));

    var dialog = Ti.UI.createOptionDialog({
        cancel: options.length - 1,
        options: options,
        title: args.title,
        titleid: args.titleid,
        androidView: args.androidView,
        tizenView: args.tizenView
    });

    dialog.addEventListener('click', function(e) {

        if (e.index === e.source.cancel) {
            return;

        } else {
            callbacks[e.index](args);
        }
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

function _init(args) {
    args = args || {};

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

    return args;
}

function _cmpVersion(a, b) {
    var i, cmp, len, re = /(\.0)+[^\.]*$/;
    a = (a + '').replace(re, '').split('.');
    b = (b + '').replace(re, '').split('.');
    len = Math.min(a.length, b.length);
    for (i = 0; i < len; i++) {
        cmp = parseInt(a[i], 10) - parseInt(b[i], 10);
        if (cmp !== 0) {
            return cmp;
        }
    }
    return a.length - b.length;
}

exports.share = share;
exports.twitter = twitter;
exports.facebook = facebook;
exports.mail = mail;
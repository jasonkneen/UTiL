var logicalDensityFactor;

exports.crop = crop;
exports.dpToPixels = dpToPixels;
exports.select = select;

function crop(blob, options, height) {

    if (typeof options !== 'object') {
        options = {
            width: options,
            height: height
        }
    }

    if (!blob.width || !blob.width) {
        return blob;
    }

    // https://jira.appcelerator.org/browse/TIMOB-4865
    if (options.fix !== false) {
        blob = blob.imageAsResized(blob.width, blob.height);
    }

    if (options.hires !== false) {
        options = dpToPixels(options);
    }

    if (options.width && options.height) {
        var blob_ratio = blob.width / blob.height;
        var ratio = options.width / options.height;

        if (blob_ratio !== ratio) {

            // Cut left and right
            if (blob_ratio > ratio) {
                blob = blob.imageAsCropped({
                    width: Math.round(blob.height * ratio),
                });
            }

            // Cut top and bottom
            else {
                blob = blob.imageAsCropped({
                    height: Math.round(blob.width / ratio)
                });
            }
        }

        if (blob.width !== options.width || blob.height !== options.height) {
            blob = blob.imageAsResized(options.width, options.height);
        }

        return blob

    } else {
        return blob.imageAsCropped(options);
    }
}

function dpToPixels(dimension) {

    if (!logicalDensityFactor) {
        logicalDensityFactor = Ti.Platform.displayCaps.logicalDensityFactor;
    }

    if (typeof dimension === 'number') {
        return dimension * logicalDensityFactor;
    }

    if (dimension.width) {
        dimension.width = dimension.width * logicalDensityFactor;
    }

    if (dimension.height) {
        dimension.height = dimension.height * logicalDensityFactor;
    }

    return dimension;
}

function select(opts, callback) {

    if (arguments.length === 1) {
        callback = opts;
        opts = {};
    }

    if (!Ti.Media.isCameraSupported) {
        return _select('openPhotoGallery', opts, callback);
    }

    var dialog = Ti.UI.createOptionDialog({
        options: [L('image_select_camera'), L('image_select_gallery'), L('cancel')],
        cancel: 2
    });

    dialog.addEventListener('click', function (e) {

        if (e.index === 0) {
            _select('showCamera', opts, _callback);
        } else if (e.index === 1) {
            _select('openPhotoGallery', opts, _callback);
        }
    });

    dialog.show();
}

function _select(fn, opts, callback) {

    if (arguments.length === 2 && _.isFunction(opts)) {
        callback = opts;
        opts = {};
    }

    var defaults = {
        mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
    };

    if (callback) {
        defaults.success = function (e) {
            callback(null, e.media);
        };
        defaults.error = function (e) {
            callback(e.error);
        };
    }

    opts = _.defaults(opts || {}, defaults);

    Ti.Media[fn](opts);
}

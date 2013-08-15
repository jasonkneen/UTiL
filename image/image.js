var _factor;

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
        options = pixels(options);
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

function pixels(dimension) {
    
    if (typeof dimension === 'number') {
        return dimension * pixelFactor();
    }
    
    if (dimension.width) {
        dimension.width = dimension.width * pixelFactor(); 
    }
    
    if (dimension.height) {
        dimension.height = dimension.height * pixelFactor(); 
    }
    
    return dimension;
}

function pixelFactor() {
    
    if (!_factor) {
        _factor = 1;
        
        if (Ti.Platform.name === 'iPhone OS') {
            
            if (Ti.Platform.displayCaps.density === 'high') {
                _factor = 2;
            }
            
        } else if (Ti.Platform.name === 'android') {
            _factor = (Ti.Platform.displayCaps.dpi / 160);
        }
    }
    
    return _factor;
}

exports.crop = crop;
exports.pixels = pixels;
exports.pixelFactor = pixelFactor;
var _ = require((typeof ENV_TEST === 'boolean') ? 'alloy' : 'underscore')._;

/**
 * addEventListenerSingle extends the UI Button with a click handler that only executes once
 * even though the user taps multiple times. It resets once it has executed the clickhandler. 
 * 
 * <Button module="xp.ui" id="btnName" />
 * $.btnName.addEventListenerSingle(onlyFiresWhenPreviousIsDone);
 * 
 * addEventListenerOnce will only execure the callback once, and remove it afterwards.
 * 
 * $.btnName.addEventListenerOnce("longpress", onlyFiresOnce);
 * 
 * @param {Object} args
 */
exports.createButton = function (args) {
	var $button = Ti.UI.createButton(args);
	$button.executed = false;

	$button.addEventListenerSingle = function (func) {
		if (!_.isFunction(func)) {
			Ti.API.error("[XP.UI Button] ERROR: Click handler must be a function");
			return;
		}
		$button.addEventListener('click', function (e) {
			if (!e.source.executed) {
				e.source.executed = true;
				// run once call stack is cleared
				_.defer(function () {
					func(e);
					e.source.executed = false;
				});
			}

		});
	};

	$button.addEventListenerOnce = function (eventName, func) {
		var triggered = false;
		if (!_.isFunction(func)) {
			Ti.API.error("[XP.UI Button] ERROR: Single Event Listener callback must be a function");
			return;
		}

		function singularCallback(e) {
			if (!triggered) {
				triggered = true;
				// run once call stack is cleared
				_.defer(function () {
					func(e);
					$button.removeEventListener(eventName, singularCallback);
				});
			}
		}
		$button.addEventListener(eventName, singularCallback);
	};

	return $button;
};

/**
 * Creates a Ti.UI.View with additional option to use a backgroundImage with
 * backgroundSize:cover like CSS does.
 *
 * @param  {Dictionary} args
 * @return {Ti.UI.View}
 */
exports.createView = function (args) {

	// view using backgroundSize
	if (args.backgroundSize && args.backgroundSize === 'cover' && args.backgroundImage && typeof args.backgroundImage === 'string') {

		// rename as private property
		args._backgroundImage = args.backgroundImage;
		delete args.backgroundImage;

		// target id available to possibly skip postlayout
		if (args.backgroundTarget) {

			// rename as private property
			args._backgroundTarget = args.backgroundTarget;
			delete args.backgroundTarget;

			var targetFile = _getTargetFile(args._backgroundImage, args._backgroundTarget);

			// target exists
			if (targetFile.exists()) {

				// use & return
				args.backgroundImage = targetFile.nativePath;

				return Ti.UI.createView(args);
			}
		}

		var view = Ti.UI.createView(args);

		// check for backgroundRotate
		if (args.backgroundRotate && args.backgroundRotate === 'true') {
			view._backgroundRotate = args.backgroundRotate;
			delete args.backgroundRotate;
		}

		// no need to wait for postlayout if we know target absolute width & height
		if (_isAbsolute(args.width) && _isAbsolute(args.height)) {
			_setBackgroundImage(view, args.width, args.height);

		} else {
			view.addEventListener('postlayout', _onPostLayout);
		}

		return view;
	}

	// regular view
	else {
		return Ti.UI.createView(args);
	}
};

/**
 * Returns the file that would keep the resized backgroundImage.
 * @param  {String} originalPath
 * @param  {String} targetId
 * @return {Ti.Filesystem.File}
 */
function _getTargetFile(originalPath, targetId, parent) {
	var targetFilename = Ti.Utils.sha1(originalPath + '_' + targetId) + originalPath.substr(originalPath.lastIndexOf('.'));
	var targetFile = Ti.Filesystem.getFile(parent || Ti.Filesystem.applicationCacheDirectory, targetFilename);

	return targetFile;
}

/**
 * Generates or loads a resized backgroundImage, respecting the original aspect
 * ratio while making sure it covers the whole view.
 * @param {Ti.UI.View} view
 * @param {Number} targetWidth
 * @param {Number} targetHeight
 */
function _setBackgroundImage(view, targetWidth, targetHeight) {
	var originalPath = view._backgroundImage;
	var targetId = view._backgroundTarget || targetWidth + '_' + targetHeight;

	var originalFile,
		targetFile = _getTargetFile(originalPath, targetId);

	if (originalPath.charAt(0) === '/') {
		originalPath = originalPath.substr(1);
	}

	if (!targetFile.exists()) {

		if (originalPath.indexOf('://') !== -1) {
			originalFile = _getTargetFile(originalPath, 'tmp', Ti.Filesystem.tempDirectory);

			var xhr = Ti.Network.createHTTPClient({
				onload: function (e) {

					if (!originalFile.write(this.responseData)) {
						console.error('[UI] Could not write downloaded file to: ' + originalFile.nativePath);
						return;
					}

					_resizeBackgroundImage(view, targetWidth, targetHeight, originalFile, targetFile);
				},
				onerror: function (e) {
					console.error('[UI] Could not downloaded image: ' + e.error);
				}
			});
			xhr.open('GET', originalPath);
			xhr.send();

			return;

		} else {
			originalFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, originalPath);
			_resizeBackgroundImage(view, targetWidth, targetHeight, originalFile, targetFile);
		}

	} else {
		view.backgroundImage = targetFile.nativePath;
	}
}

/**
 * Resizes the backgroundImage.
 * @param {Ti.UI.View} view
 * @param {Number} targetWidth
 * @param {Number} targetHeight
 * @param {String} originalPath
 * @param {Ti.Filesystem.File} targetFile
 */
function _resizeBackgroundImage(view, targetWidth, targetHeight, originalFile, targetFile) {

	if (!originalFile.exists()) {
		console.error('[UI] backgroundImage not found: ' + originalFile.nativePath);
		return;
	}

	// orginal specs
	var originalBlob = originalFile.read();
	var originalWidth = originalBlob.width;
	var originalHeight = originalBlob.height;
	var originalRatio = originalWidth / originalHeight;

	// target specs (converted to px)
	targetWidth = Ti.UI.convertUnits('' + targetWidth, Ti.UI.UNIT_PX);
	targetHeight = Ti.UI.convertUnits('' + targetHeight, Ti.UI.UNIT_PX);
	var targetRatio = targetWidth / targetHeight;

	var resizeWidth, resizeHeight;

	// fill width, overflow height
	if (targetRatio > originalRatio) {
		resizeWidth = targetWidth;
		resizeHeight = Math.ceil(resizeWidth / originalRatio);
	}

	// fill height, overflow width
	else {
		resizeHeight = targetHeight;
		resizeWidth = Math.ceil(resizeHeight * originalRatio);
	}

	// resize, if neeeded
	if (originalWidth !== resizeWidth || originalHeight !== resizeHeight) {
		originalBlob = originalBlob.imageAsResized(resizeWidth, resizeHeight);
	}

	// crop, if needed
	if (resizeWidth !== targetWidth || resizeHeight !== targetHeight) {
		originalBlob = originalBlob.imageAsCropped({
			width: targetWidth,
			height: targetHeight
		});
	}

	targetFile.write(originalBlob);

	view.backgroundImage = targetFile.nativePath;
}

/**
 * Handles the Ti.UI.View.postlayout event, takes the width and height and
 * then sets the backgroundImage.
 * @param  {Ti.Event} e
 */
function _onPostLayout(e) {
	var view = e.source;
	var size = view.size;

	if (view._backgroundRotate) {
		// check for both images have been rendered
		if (bothOrientationImagesRendered(view, size)) {
			view.removeEventListener('postlayout', _onPostLayout);
		}
	} else {
		// remove after the first time
		view.removeEventListener('postlayout', _onPostLayout);
	}

	// continue now that we know width & height
	_setBackgroundImage(view, size.width, size.height);
}

/**
 * Check if we have rendered an image for portrait and landscape resolution
 * @param {Ti.UI.View} view
 * @param {Object} size
 * @return {Boolean} result
 */
function bothOrientationImagesRendered(view, size) {
	var targetFile = _getTargetFile(view._backgroundImage, size.width + '_' + size.height);
	var targetFile2 = _getTargetFile(view._backgroundImage, size.height + '_' + size.width);

	// both needed to be rendered
	if (targetFile.exists() && targetFile2.exists()) {
		return true;
	}

	return false;
}

/**
 * Check is a dimension is absolute.
 * @param  {mixed} Dimension
 */
function _isAbsolute(dimension) {
	return dimension && dimension.toString().match(/^[1-9]+[0-9]*[a-z]*$/);
}

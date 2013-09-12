var               _,
           Backbone,
       platformName = Ti.Platform.name,
         OS_ANDROID = (platformName === 'android'),
             OS_IOS = (platformName === 'iPhone OS'),
       OS_MOBILEWEB = (platformName === 'mobileweb'),
         deployType = Ti.App.deployType,
    ENV_DEVELOPMENT = (deployType === 'development'),
           ENV_TEST = (deployType === 'test'),
     ENV_PRODUCTION = (deployType === 'production');

// Lazy exporting Underscore
Object.defineProperty(exports, "_", {
    get: function() { 
        return _ = _ || require('underscore')._; // Expects Underscore to be in your Resources folder
    }
});

// Lazy exporting Underscore
Object.defineProperty(exports, "Backbone", {
    get: function() { 
        return Backbone = Backbone || require('backbone'); // Expects Underscore to be in your Resources folder
    }
});

exports.infect = function(scope) {
	scope.OS_ANDROID = OS_ANDROID;
	scope.OS_IOS = OS_IOS;
	scope.OS_MOBILEWEB = OS_MOBILEWEB;
	scope.ENV_DEVELOPMENT = scope.ENV_DEV = ENV_DEVELOPMENT;
	scope.ENV_TEST = ENV_TEST;
	scope.EVN_PRODUCTION = scope.ENV_PROD = ENV_PRODUCTION;
}

function isTabletFallback() {
	return !(Math.min(
		Ti.Platform.displayCaps.platformHeight,
		Ti.Platform.displayCaps.platformWidth
	) < 700);
}

/**
 * @property {Boolean} isTablet
 * `true` if the current device is a tablet.
 *
 */
exports.isTablet = (function() {
	if (OS_IOS) {
		return Ti.Platform.osname === 'ipad';
	} else if (OS_ANDROID) {
		var psc = Ti.Platform.Android.physicalSizeCategory;
		return psc === Ti.Platform.Android.PHYSICAL_SIZE_CATEGORY_LARGE ||
		       psc === Ti.Platform.Android.PHYSICAL_SIZE_CATEGORY_XLARGE;
	} else if (OS_MOBILEWEB) {
		return !(Math.min(
			Ti.Platform.displayCaps.platformHeight,
			Ti.Platform.displayCaps.platformWidth
		) < 400);
	} else {
		return isTabletFallback();
	}
})();

/**
 * @property {Boolean} isHandheld
 * `true` if the current device is a handheld device (not a tablet).
 *
 */
exports.isHandheld = !exports.isTablet;

/**
 * @property {Object} Globals
 * An object for storing globally accessible variables and functions.
 * Alloy.Globals is accessible in any controller in your app:
 *
 *     Alloy.Globals.someGlobalObject = { key: 'value' };
 *     Alloy.Globals.someGlobalFunction = function(){};
 *
 * Alloy.Globals can be accessed in other non-controller Javascript files
 * like this:
 *
 *     var theObject = require('alloy').Globals.someGlobalObject;
 *
 */
exports.Globals = {};

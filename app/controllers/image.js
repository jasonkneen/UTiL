var image = require('image');

(function constructor(args) {})(arguments[0] || {});

function onSelectClick() {

	image.select(function (err, media) {

		if (err) {
			return alert(err);
		}

		var dp = $.imageView.rect;

		$.imageView.image = image.crop(media, dp);

		var px = image.dpToPixels(dp);

		Ti.UI.createAlertDialog({
			title: 'ImageView in DP: ' + dp.width + 'x' + dp.height,
			message: 'Image in PX: ' + px.width + 'x' + px.height
		}).show();
	});

}

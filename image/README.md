Often I need to display a user-provided picture in an ImageView in such a way that the whole ImageView is filled with as much of the picture possible.

This is how I do it:

```
var image = require('image');

Ti.Media.showCamera({
        mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
        success: function (e) {
                myImageView.image = image.crop(e.media, myImageView.rect);
        }
});
```

Take a look at the next `image.js` file to learn how it works.

## Params
* `blob`: The `Ti.Blob` containing the image.
* `options`: Either an `object` (or [Dimension](http://docs.appcelerator.com/titanium/latest/#!/api/Dimension)) containing the target `width` and `height` and the other options listed below, or a Number representing only the `width`.
* `height`: The target `height`.

## Options
* `width`: See above.
* `height`: See above.
* `hires`: Set to `FALSE` to disable adjusting target dimensions to actual pixels needed for Retina or Android variable DPI.
* `fix`: Set to `FALSE` to disable the workaround for bug [TIMOB-4865](https://jira.appcelerator.org/browse/TIMOB-4865).
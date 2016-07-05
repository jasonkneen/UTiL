# Image
Some utility methods to work with images.

* [example](../app/controllers/image.js)
* [source](../app/lib/image.js)

## crop(blob, options|width, height)
Resize and crop a `Ti.Blob` image to fill `width` and `height`. The second arguments can also be an object with:

* `width`
* `height`
* `hires`: Set to `FALSE` to disable adjusting target dimensions to actual pixels needed for Retina or Android variable DPI.
* `fix`: Set to `FALSE` to disable the workaround for bug [TIMOB-4865](https://jira.appcelerator.org/browse/TIMOB-4865).

## dpToPixels(dim|size)
Convert from dp to px. Give it a number or an object that has a `width` and/or `height` property.

## select([opts], [ callback])
Let the use choose to take or select a picture. If no camera is found it does not ask but let the user select. By default it wants a photo and calls `callback(err, media)` but you can leave out the callback (just as you can leave out options) and pass params to call `showCamera` or `openPhotoGallery` with to have full control.
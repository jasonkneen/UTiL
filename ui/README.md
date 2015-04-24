# ui
CommonJS module extending some `Ti.UI.create*` factories.

## General usage
Just replace `Ti.UI` with `ui` and in Alloy use the `module` attribute:

### Alloy
```
<Alloy>
	<View module="ui" />
</Alloy>
```

### Classic
```
var UI = require('ui');
var view = UI.createView();
```

## Factories

### createView

#### backgroundSize
As [documented](http://docs.appcelerator.com/titanium/latest/#!/guide/Images_and_ImageView_APIs-section-29004912_ImagesandImageViewAPIs-Backgroundimages), background images will be scaled to fit the view's dimensions.

The `createView` factory adds support for the [background-size:cover](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size) property known from CSS. If set, it will resize and then crop the image to make sure it fits the view's dimensions while respecting the aspect ratio of the image.

If you don't set a `width` and `height` property, it will add a `postlayout` event listener to get them when the view is layed out. Of course the resized images are cached, but if you don't want to wait for `postlayout`, then use the `backgroundTarget` property to pass a string to identify the target, but only if you know for sure the dimensions found using `postlayout` would always be the same for that particular view.



```
<Alloy>
	<View module="ui" backgroundImage="images/background.jpg" backgroundSize="cover" backgroundTarget="myView" />
</Alloy>
```

Its also possible to use the property `orientationchange` to support the cover background to be rendered for both portrait and landscape layout. Dont mix this with the `backgroundTarget` property since it will disable this feature. 

```
<Alloy>
	<View module="ui" backgroundImage="images/background.jpg" backgroundSize="cover" orientationchange="true" />
</Alloy>
```

# XP.UI
CommonJS module providing cross-platform UI elements.

### Available:
* `NavigationWindow`

    Emulates the `Ti.UI.iOS.NavigationWindow` for Android.

* `Window`

    Returns a `Ti.UI.Window` on iOS and `Ti.UI.View` on others.
    
* `Button`

    Returns a `Ti.UI.Button` with a new addClickHandler functionality.

Read the blog at: [http://fokkezb.nl/2013/10/21/cross-platform-ui/](http://fokkezb.nl/2013/10/21/cross-platform-ui/)

## Why?
[Alloy](http://projects.appcelerator.com/alloy/docs/Alloy-bootstrap/index.html) does a great job at supporting single-codebase cross platform apps by providing conditional tags and constants, but you still have to actually use these to code around the platform differences.

## How to use it

1. Get [xp.ui.js](https://github.com/FokkeZB/UTiL/blob/master/xp.ui/xp.ui.js)
2. Drop it in app/lib/xp.ui.js
3. Replace a `NavigationWindow` element’s `plaform="ios"` by `module="xp.ui"`.
4. Get coffee and proceed as usual.

### Example code

```xml
<Alloy>
  <NavigationWindow module="xp.ui">
    <Window>
      <Label>Hello World</Label>
    </Window>
  </NavigationWindow>
</Alloy>
```

### Swipe to go back
Unless you set the `NavigationWindow`'s `swipeBack` attribute to `false` or pass this as an option to `openWindow`, the module will add a swipe-eventlistener to close the window when the user swipes to the right, just like it does on iOS7. For Android, it adds `slide_in_left` and `slide_out_right` enter/exit animations unless you pass `animated: false` as an option for `openWindow`.

### Action Bar
If you target Android SDK 11 or higher the module will automatically add the [up arrow](http://developer.android.com/training/implementing-navigation/ancestral.html) to the action bar of all but the first window. Clicking on the home icon or arrow will close the window. You can disable this by setting the `NavigationWindow`'s `displayHomeAsUp` attribute to `false` or passing this as an option to `openWindow`.

## How it works
This module leverages Alloy's 'new' `module` attribute to provide cross-platform versions of UI elements like `NavigationWindow` by simply replacing `platform="ios"` by `module="xp.ui"`.

This will instruct Alloy to require the `xp.ui.js` CommonJS module and call `createNavigationWindow` on that module instead of `Ti.UI.iOS` to which this tag normally maps.

For iOS, the module creates an actual `Ti.UI.iOS.NavigationWindow` and returns it and the flow continues like it would normally. This is possible because we're fortunate that Alloy does still recognize the tag as being a NavigationWindow and thus passes the wrapped window via its creation-arguments instead of calling `add()` which is the default for module-provided views that wrap others.

For other platforms, it creates and returns an intermediate object that exposes `Ti.UI.iOS.NavigationWindow`-like `openWindow` and `closeWindow` methods. Two more `open` and `close` methods will act on the root window wrapped by the `NavigationWindow` tags, giving exact the same behavior as on iOS.

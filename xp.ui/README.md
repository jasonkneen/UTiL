# XP.UI
CommonJS module providing cross-platform UI elements.

### Available:
* `NavigationWindow`.

Read the blog at: [http://fokkezb.nl/2013/10/21/cross-platform-ui/](http://fokkezb.nl/2013/10/21/cross-platform-ui/)

## Why?
[Alloy](http://projects.appcelerator.com/alloy/docs/Alloy-bootstrap/index.html) does a great job at supporting single-codebase cross platform apps by providing conditional tags and constants, but you still have to actually use these to code around the platform differences.

## How?
This module leverages Alloy's 'new' `module` attribute to provide cross-platform versions of UI elements like `NavigationWindow` by simply replacing `platform="ios"` by `module="xp.ui"`.

This will instruct Alloy to require the `xp.ui.js` CommonJS module and call `createNavigationWindow` on that module instead of `Ti.UI.iOS` to which this tag normally maps.

For iOS, the module creates an actual `Ti.UI.iOS.NavigationWindow` and returns it and the flow continues like it would without *XP.UI*.

For other platforms, it creates and returns an intermediate object that exposes `Ti.UI.iOS.NavigationWindow`-like `openWindow` and `closeWindow` methods. Two more `open` and `close` methods will act on the root window wrapped by the `NavigationWindow` tags, giving exact the same behavior as on iOS.

Unless you pass `swipeBack: false` as an option, it will add a swipe-eventlistener to close the window when the user swipes to the right, like it does on iOS7. For Android, it add `slide_in_left` and `slide_out_right` enter/exit animations unless you pass `animated: false` as an option.

## How to use it?

**iOS-only:**
```xml
<Alloy>
  <NavigationWindow platform="ios">
    <Window>
      <Label>Hello World</Label>
    </Window>
  </NavigationWindow>
</Alloy>
```

**Cross-platform:** (spot the difference)
```xml
<Alloy>
  <NavigationWindow module="xp.ui">
    <Window>
      <Label>Hello World</Label>
    </Window>
  </NavigationWindow>
</Alloy>
```

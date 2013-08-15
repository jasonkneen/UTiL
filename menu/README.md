# Menu
CommonJS module for managing the Android Activity Menu and ActionBar.

## Why?
Take a look at the docs for [Ti.Android.Menu](http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.Android.Menu) and [Ti.Android.ActionBar](http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.Android.ActionBar) and you'll see that managing MenuItems and the ActionBar is all about doing it in the right order. It takes listening to the `Window` or `TabGroup` opening, calling `invalidateOptionsMenu()` under certain circumstances etc. And you can have only one callback to create MenuItems or respond when the ActionBar's home icon is clicked.

This module deals with all of this frustration :)

## How?
Learn by example:

```
var Menu = require('menu');

// Create a new instance for the given Window or TabGroup
var menu = new Menu($.index);

// Call any of the ActionBar's setter, show or hide methods
menu.actionBar.setTitle(Ti.App.name).setIcon('icon.png');

// Add as many event listeners you need
menu.actionBar.on('homeIconItemSelected', function () {
    $.index.activeTab = 0;
});

// Add a menu item and event listeners to it in one go
menu.add({
    title: 'My title',
    icon: 'My icon',
    onClick: function() { alert('Hello'); }
});
```

## Ideas
Some ideas for improvement:

* Have `add()` return an object to further manipulate the *MenuItem*, including adding multiple eventlisteners.
* Support changing and removing MenuItems.
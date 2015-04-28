var ui = require('ui');

var win = Ti.UI.createWindow({
  backgroundColor: 'white'
});

win.add(ui.createView({
  left: 5,
  width: '45%',
  height: 400,

  backgroundImage: 'image.png',
  backgroundSize: 'cover'
}));

win.add(ui.createView({
  right: 5,
  width: '45%',
  height: 400,

  backgroundImage: 'http://www.appcelerator.com/wp-content/uploads/scale_triangle1.png',
  backgroundSize: 'cover'
}));

win.open();
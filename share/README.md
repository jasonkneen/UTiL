# Share
CommonJS module providing a one-in-all social sharing solution for iOS and Android.

## Why?
Because I use the same code in pretty much every app I do :)

## How?
Learn by example:

```
var btn = Ti.UI.createButton({
  title: 'Share'
});

btn.addEventListener('click', function () {
  require('share').share({
    text: 'Text to share',
    description: 'Alternative text used in Facebook feed-dialog',
    url: 'http://url.to.share',
    caption: 'Caption for the URL, used in Facebook feed-dialog',
    image: '/images/image.png', // Can be local path, URL, File or Blob
    image_url: 'http://url.to.share/image.png', // If 'image' is not an URL, you can specify one here for like Facebook only works with an URL
    
    // Applied to activityView
    // https://github.com/viezel/TiSocial.Framework#socialactivityview
    removeIcons: 'print,sms',
    customIcons: [
      {
          title:"Custom Share",
          type:"hello.world",
          image:"pin.png"
      },
    ],
    
    // Applied to iPad activityPopover (first only) and optionDialog
    view: btn,
    rect: undefined,
    animated: undefined,
    
    // Applied to optionDialog
    title: 'Share this item',
    titleid: undefined,
    androidView: undefined,
    tizenView: undefined
   
  // Optional callback 
  }, function (e) {
      if (e.cancelled) alert('You cancelled!');
      if (!e.success) alert('It failed!');
      if (e.platform) alert('Platform used: ' + e.platform);
  });
});
```
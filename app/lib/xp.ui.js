class NavigationWindow {
  constructor(args) {
    this.args = args;
  }

  open(options = {}) {
    options.displayHomeAsUp = false;
    return this.openWindow(this.args.window, options);
  }

  close(options = {}) {
    return this.closeWindow(this.args.window, options);
  }

  openWindow(window, options = {}) {
    options.swipeBack = (typeof options.swipeBack === 'boolean') ? options.swipeBack : this.args.swipeBack;
    options.displayHomeAsUp = (typeof options.displayHomeAsUp === 'boolean') ? options.displayHomeAsUp : this.args.displayHomeAsUp;

    if (OS_ANDROID && options.animated !== false) {
      options.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
      options.activityExitAnimation = Ti.Android.R.anim.slide_out_right;
    }

    if (options.swipeBack !== false) {
      window.addEventListener('swipe', () => {
        if (e.direction === 'right') {
          this.closeWindow(window, options);
        }
      });
    }

    if (OS_ANDROID && options.displayHomeAsUp !== false && !window.navBarHidden) {
      window.addEventListener('open', () => {
        const activity = window.getActivity();
        if (activity) {
          const actionBar = activity.actionBar;
          if (actionBar) {
            actionBar.displayHomeAsUp = true;
            actionBar.onHomeIconItemSelected = () => {
              this.closeWindow(window, options);
            };
          }
        }
      });
    }

    return window.open(options);
  }

  closeWindow(window, options = {}) {
    if (OS_ANDROID && options.animated !== false) {
      options.activityEnterAnimation = Ti.Android.R.anim.slide_in_left;
      options.activityExitAnimation = Ti.Android.R.anim.slide_out_right;
    }

    return window.close(options);
  }
};

const createNavigationWindow = (args) => {
  const navWin = OS_IOS ? Ti.UI.iOS.createNavigationWindow(args) : new NavigationWindow(args);

  if (args && args.id) {
    Alloy.Globals[args.id] = navWin;
  }

  return navWin;
}

const createWindow = (args) => {
    if (OS_IOS) {
        return Ti.UI.createWindow(args);
    } else {
        return Ti.UI.createView(args);
    }
};

const createTextArea = (args) => {
    const $textArea = Ti.UI.createTextArea(args);

    if (args.hintText) {
        $textArea.originalColor = $textArea.color || '#000';
        if (!$textArea.value) {
            $textArea.applyProperties({
                value: $textArea.hintText,
                color: '#ccc'
            });
        }

        $textArea.addEventListener('focus', (e) => {
            if (e.source.value == e.source.hintText) {
                e.source.applyProperties({
                    value: '',
                    color: e.source.originalColor
                });
            }
        });

        $textArea.addEventListener('blur', (e) => {
            if (!e.source.value) {
                e.source.applyProperties({
                    value: e.source.hintText,
                    color: '#ccc'
                });
            }
        });
    }

    return $textArea;
};

const createLabel = (args) => {

    if (OS_IOS && args.html) {
        const html = args.html;

        delete args.text;
        delete args.html;

        const label = Ti.UI.createLabel(args);
        const ref = label;

        const html2as = require('nl.fokkezb.html2as');

        html2as(html, function (err, attr) {

            if (err) {
                console.error(err);

            } else {
                ref.attributedString = attr;
            }

            ref = null;
        });

        return label;

    } else {
        return Ti.UI.createLabel(args);
    }
};

/**
 * Fixes the auto focus on textfield on android 
 */
const createTextField = (args) => {
    const isAndroid = Ti.Platform.osname === 'android';

    if (isAndroid) {
        const view = Ti.UI.createTextField(args);

        // fix auto focus
        view.addEventListener('focus', function focusFix(e) {
            e.source.blur();
            e.source.removeEventListener('focus', focusFix);
        });
        return view;
    } else {
        return Ti.UI.createTextField(args);
    }
};

export {
  createNavigationWindow,
  createWindow,
  createTextArea,
  createLabel,
  createTextField
};

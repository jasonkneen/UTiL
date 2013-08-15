# Alloy
If you want to your CommonJS modules to work in both Alloy and plain Titanium projects, you might need a way to detect if you're in Alloy. For instance, if you're in Alloy you would get Underscore from the alloy-module, while in plain Titanium you would require Underscore directly.

Well, you can:

```
var _ = require((typeof ENV_TEST === 'boolean') ? 'alloy' : 'underscore')._;
```

The above works by utilizing Alloy's optimization process. In this process, constants like `ENV_TEST` will be either `TRUE` or `FALSE`. The actual expressions in wich they are used will then be evaluated. If `FALSE` the code block will be removed. In plain Titanium projects the constants are undefined and this `typeof ENV_TEST` will be `undefined`, so the code block will be executed.

### Alternative all-in-one solution
As an alternative, you could place the next `alloy.js` file in the Resources folder of your plain Titanium project. Just like the real Alloy, it exposes Underscore, BackBone, formFactor helpers and a `Globals` property. Now you can use any CommonJS module that (literally) requires Alloy!

By calling `infect` and passing your current scope (`this`) all Alloy constants will be set. This method of course is not available in an Alloy environment, so be sure check! 

The following code works in both Alloy and plain Titanium environments:

```
var Alloy = require('alloy');
Alloy.infect && Alloy.infect(this);

// Will work in both Alloy and plain Titanium environments!
if (OS_IOS && Alloy.isTablet) {
        var random = Alloy._.random(0, 100);
}
```
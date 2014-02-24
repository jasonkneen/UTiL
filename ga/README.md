# Google-Analytics
CommonJS module simplifying API for the ti.googleanalytics module.

- I use Ben's fork at: [https://github.com/benbahrenburg/Ti.GA](https://github.com/benbahrenburg/Ti.GA)

## Usage
Learn by example:

```
var ga = require('ga');
ga.id = 'UA-1234567-1';

ga.screen('my screen');

ga.event('category', 'action', 'label', 'value');

// or

ga.event({
	category: 'category',
	action: 'action',
	label: 'label',
	value: 'value'
});

ga.social({ .. });
ga.timing({ .. });
ga.transaction({ .. });
```
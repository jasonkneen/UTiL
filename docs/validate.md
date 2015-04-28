# Validate
CommonJS module providing validation.

## How?
Learn by example:

```
var validate = require('validate');

try {

        // Returns trimmed value by default
        var value = validate(' some value ');
        
        // Throws error because required by default
        var value = validate('');
        
        // Throws error because not an email address
        var value = validate('foo(at)bar.com', { email:true });
        
        // Does nothing because it's not required
        var value = validate('', { email: true, required: false });
        
        // Throws 'My label is required.'
        var value = validate('', { label: 'My label' });
        
        // Takes value and label (hintText) from TextFields and TextAreas as well
        var value = validate(Ti.UI.createTextField({
          hintText: 'My label',
          value: 'My value'}));
          
        Takes an object containing multiple stuff to validate to (arrays are like arguments above)
        var values = validate({
          email: ['foo(at)bar.com', { email: true }],
          name: ['my name ']
        });

} catch (error) {
        alert(error);
}
```
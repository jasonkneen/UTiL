var _ = require((typeof ENV_TEST === 'boolean') ? 'alloy' : 'underscore')._;

function validate(value, options) {
    options = _.defaults(options || {}, {
       trim: true,
       required: true,
       label: 'Value'
    });
    
    if (_.isObject(value)) {
        
        if (typeof value.value === 'string') {
            
            if (value.hintText) {
                options.label = value.hintText;
            }
            
            value = value.value;
            
        } else {
            var values = {};

            _.each(_.keys(value), function (key) {
                var keyOptions, keyValue;
                
                if (_.isArray(value[key])) {
                    keyValue = value[key][0];
                    keyOptions = _.defaults(value[key][1] || {}, options);
                    
                } else {
                    keyValue = value[key];
                    keyOptions = _.clone(options);
                }
                
                values[key] = validate(keyValue, keyOptions);
                
                return;
            });
            
            return values;
        }
    }
   
    if (typeof value === 'string' && options.trim) {
        value = value.trim();
    }
    
    delete options.trim;

    if (options.required && _.isEmpty(value)) {
        throw String.format(L('validate_required', '%s is required.'), options.label);
    }
    
    delete options.required;
    
    var error;
    
    _.each(options, function (setting, key) {
        
        if (setting === false) {
            return;
        }

        switch (key) {
            
            case 'email':
                var email = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;
                if (!email.test(value)) throw String.format(L('validate_email', '%s is no email address.'), options.label);
                break;
                
            case 'regexp':
                if (!setting.test(value)) throw String.format(L('validate_regexp', '%s is not valid.'), options.label);
                break;
                
            case 'numeric':
                if (!_.isFinite(value)) throw String.format(L('validate_numeric', '%s is not a number.'), options.label);
                break;
        }
       
        return;
    });
        
    return value;
}

if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
                exports = module.exports = validate;
        }
        exports.validate = validate;
}

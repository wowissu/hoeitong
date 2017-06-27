
// define XHR method put & delete
if (jQuery) {
    jQuery.each( [ "put", "delete" ], function( i, method ) {
        jQuery[ method ] = function( url, data, callback, type ) {
            if ( jQuery.isFunction( data ) ) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return jQuery.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            });
        };
    });
}


module.exports = {
    isloopable (value) {
        return typeof value === 'object' || typeof value === 'array';
    },
    deeploop (input, handle) {
        if (isloopable(input)) {
            for (var row in input) {
                if (deeploop(input[row], handle) === false) {
                    break;
                }
            }
        } else {
            return handle(input);
        }
    }
}


import $ from 'jquery'

// define XHR method put & delete
if ($) {
    $.each(['put', 'delete'], function (method) {
        $[method] = function (url, data, callback, type) {
            if ($.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return $.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            });
        };
    });
}

var isloopable = (value) => {
    return typeof value === 'object'
};

var deeploop = (input, handle) => {
    if (isloopable(input)) {
        for (var row in input) {
            if (deeploop(input[row], handle) === false) {
                break;
            }
        }
    } else {
        return handle(input);
    }
};

export default {
    isloopable,
    deeploop
}
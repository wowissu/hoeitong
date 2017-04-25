"use strict";

var isloopable = function (value)
{
    return typeof value === 'object' || typeof value === 'array';
}

var deeploop = function (input, handle)
{
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
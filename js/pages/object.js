(function (ng, app)
{
    "use strict";

    app.config(function($routeProvider)
    {
        $routeProvider
            .when("/object",
            {
                template: " ",
                controller: "objectController"
            });
    });

    app.controller("objectController", function ($scope)
    {
        console.log('objectController');
    });

}(angular, angular.module('App')));
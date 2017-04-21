(function (ng, app)
{
    "use strict";

    app.config(function($routeProvider)
    {
        $routeProvider
            .when("/tools",
            {
                template: " ",
                controller: "toolsController"
            });
    });

    app.controller("toolsController", function ($scope)
    {
        console.log('toolsController');
    });

}(angular, angular.module('App')));
(function (ng, app)
{
    "use strict";

    app.config(function($routeProvider)
    {
        $routeProvider
            .when('/company/:id?',{
                reloadOnSearch: false,
                templateUrl: "template/company.html",
                controller: function ($scope, $route, companyMenu)
                {
                    $scope.companyMenu = companyMenu;
                }
            });
    });

    app.factory('companyMenu', [function ()
    {
        return {
            create: {
                title: '新增廠商',
                icon: '<i class="fa fa-plus"></i>',
                click: function ($event) {
                    console.log('create click', $event);
                }
            },
            remove: {
                title: '刪除廠商',
                icon: '<i class="fa fa-trash-o"></i>',
                click: function () {
                    console.log('remove click', $event);
                }
            }
        };
    }]);

    app.controller('companyController', ['$scope', '$route', 'companyMenu', function ($scope, $route, companyMenu)
    {
        console.info('companyController');

        console.log($route);

        $scope.companyMenu = companyMenu;
    }]);

}(angular, angular.module('App')));
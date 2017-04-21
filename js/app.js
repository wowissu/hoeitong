(function (ng)
{
    "use strict";

    var app = ng.module('App', ['ngRoute', 'suFilter']);

    app.config(function($interpolateProvider, $routeProvider, $locationProvider)
    {
        $interpolateProvider.startSymbol('[[').endSymbol(']]');

        // route
        $locationProvider.html5Mode(true);
        $routeProvider.otherwise({redirectTo: '/company'});
    });


    app.run(['$rootScope', function ($root)
    {

        console.info('app ready.');

        $root.siteMenu = {
            company: {
                title: '廠商管理',
                url: 'company',
                icon: '<i class="fa fa-briefcase"></i>'
            },
            object: {
                title: '物件管理',
                url: 'object',
                icon: '<i class="fa fa-cubes"></i>'
            },
            tools: {
                title: '工具管理',
                url: 'tools',
                icon: '<i class="fa fa-wrench"></i>'
            }
        };


        $root.$on('$routeChangeStart', function(event, next, current) {
            // console.info('$routeChangeStart');
        });

        $root.$on('$routeChangeSuccess', function(eventIgnore, current) {
            // console.info('$routeChangeSuccess');
        });

        $root.$on('$routeChangeError', function (eventIgnore, currentIgnore, previousIgnore, rejection) {
            if (rejection) {
                console.info(rejection);
            } else {
                console.error('----------不明錯誤---------');
            }
        });

    }]);

    app.directive('pagebox', ['$templateCache', '$rootScope', function ($templateCache, $root)
    {
        $root.pagebox = {};

        var PageBox = function ($scope, $element, $attrs, $transclude)
        {
            if ('id' in $attrs && $attrs.id.length) {} else {
                throw 'pagebox need a id';
            }

            this.$id = $attrs.id;
            this.$navLock = Boolean($scope.navLock);

            this.menu = $scope.Boxmenu;

            $scope.test = function () {
                console.log('here');
            };

            // 註冊在$root
            $root.pagebox[this.$id] = this;
        };

        PageBox.prototype.get = function ($id)
        {
            return $root.pagebox[$id];
        };

        return {
            // priority: 0,
            require: '^^?pagebox',
            restrict: 'E',
            templateUrl: '/pagebox.html',
            controllerAs: 'PageBox',
            replace: true,
            transclude: {
                section: '?section',
                logo: '?logo',
            },
            scope: {
                id: '=',
                Boxmenu: '=menu',
                navLock: '=',
                navStyle: '='
            },
            controller: ['$scope', '$element', '$attrs', PageBox],
            link: function postLink($scope, $element, $attrs, $parentBox)
            {
                console.log($scope.PageBox);

                $scope.PageBox.$parent = $parentBox;
            }
        };
    }]);

}(angular));
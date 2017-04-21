(function (ng)
{
    "use strict";

    var app = ng.module('suFilter', []);

    app.filter('html', ['$sce', function ($sce) {
        return $sce.trustAsHtml;
    }]);
}(angular));
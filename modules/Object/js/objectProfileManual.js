(function ()
{
    "use strict";

    var bus = window.bus || (window.bus = new Vue());
    var routeComps = window.RouteComponents || (window.RouteComponents = {});

    routeComps.objectProfileManual = function (resolve)
    {
        $.get('template/object/profile/manual.html').done(function (template)
        {
            resolve({
                props: ['object'],
                template: template
            });
        });
    };

}());
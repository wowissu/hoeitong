(function ()
{
    "use strict";

    Vue.component('pagebox', {
        props: ['menu'],
        template: '#pagebox',
        data: function ()
        {
            console.log(arguments);

            return {
                navbar: {
                    style: {},
                    class: {
                        pagebox_navbar__locked: false
                    }
                }
            };
        }
    });

    var Company = function (resolve, reject)
    {
        $.get('template/company.html').done(function (template)
        {
            console.log(template);
            resolve({
                template: template,
                watch: {
                    $route: function (to, from) {

                    }
                }
            });
        });
    };

    var Foo = { template: '<div>Foo</div>' };
    var Bar = { template: '<div>Bar</div>' };

    var router = new VueRouter({
        routes: [
            { path: '/Foo', component: Foo, name: 'foo' },
            { path: '/Bar', component: Bar, name: 'bar' }
        ]
    });

    var app = new Vue({
        router: router,
        data: {
            menu: {
                company: {
                    title: '廠商管理',
                    url: '/foo',
                    icon: '<i class="fa fa">'
                }

            }
        }
    }).$mount('#app');

}());
(function ()
{
    "use strict";

    var router = new VueRouter({
        routes: [
            {
                path: '/company',
                component: VueComponents.companiesComponent,
                children: [
                    {
                        path: ':id',
                        component: VueComponents.companyComponent
                    }
                ]
            },
        ]
    });

    var app = new Vue({
        router: router,
        data: {
            sitemenu: {
                company: {
                    title: '廠商管理',
                    url: '/company',
                    icon: '<i class="fa fa-briefcase"></i>'
                },
                object: {
                    title: '物件管理',
                    url: '/object',
                    icon: '<i class="fa fa-cubes"></i>'
                },
                tools: {
                    title: '工具管理',
                    url: '/tools',
                    icon: '<i class="fa fa-wrench"></i>'
                }
            }
        }
    }).$mount('#app');


}());
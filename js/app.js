(function ()
{
    "use strict";

    var router = new VueRouter({
        // mode: 'history',
        routes: [
            {
                name: 'companyList',
                path: '/company',
                component: RouteComponents.companyComponent,
                meta: {
                    scrollTop: 0
                },
                children: [
                    {
                        name: 'companyInsert',
                        path: 'insert',
                        component: RouteComponents.companyComponent
                    },
                    {
                        name: 'companyDetail',
                        path: ':id',
                        component: RouteComponents.companyComponent
                    }
                ]
            },
            {
                name: 'object',
                path: '/object',
                component: RouteComponents.objectComponent,
                children: [
                    {
                        props: true,
                        path: ':id',
                        redirect: function (route)
                        {
                            return { name: 'objectProfile', params: route.params };
                        },
                        component: RouteComponents.objectProfileBase,
                        children: [
                            {
                                props: ['object'],
                                name: 'objectProfile',
                                path: 'profile',
                                component: RouteComponents.objectProfile,
                            },
                            {
                                props: ['object'],
                                name: 'objectNodes',
                                path: 'nodes',
                                component: RouteComponents.objectProfileNodes
                            },
                            {
                                props: ['object'],
                                name: 'objectManual',
                                path: 'manual',
                                component: RouteComponents.objectProfileManual
                            }
                        ]
                    }
                ]
            },
            // {
            //     path: '*',
            //     redirect: 'object'
            // }
        ]
    });

    window.app = new Vue({
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
        },
        filters: {
            json: function (value) { return JSON.stringify(value, null, 2); }
        }
    }).$mount('#app');

}());

import VueRouter from 'vue-router';
import CompanyList from './Company/companyList.vue'
import ObjectList from './Object/objectList.vue'
import ObjectProfileBase from './Object/objectProfileBase.vue'
import ObjectProfileIndex from './Object/objectProfileIndex.vue'
import ObjectProfileNodes from './Object/objectProfileNodes.vue'
import ObjectProfileManual from './Object/objectProfileManual.vue'

export default new VueRouter({
    routes: [
        {
            name: 'companyList',
            path: '/company',
            component: CompanyList,
            meta: {
                scrollTop: 0
            },
            children: [
                {
                    name: 'companyInsert',
                    path: 'insert',
                    component: CompanyList
                },
                {
                    name: 'companyDetail',
                    path: ':id',
                    component: CompanyList
                }
            ]
        },
        {
            name: 'objectList',
            path: '/object',
            component: ObjectList,
            children: [
                {
                    props: true,
                    path: ':id',
                    redirect(route) {
                        return { name: 'objectProfile', params: route.params };
                    },
                    component: ObjectProfileBase,
                    children: [
                        {
                            props: ['object'],
                            name: 'objectProfile',
                            path: 'profile',
                            component: ObjectProfileIndex,
                        },
                        {
                            props: ['object'],
                            name: 'objectNodes',
                            path: 'nodes',
                            component: ObjectProfileNodes
                        },
                        {
                            props: ['object'],
                            name: 'objectManual',
                            path: 'manual',
                            component: ObjectProfileManual
                        }
                    ]
                }
            ]
        }
    ]
})
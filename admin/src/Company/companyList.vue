<template>
    <pagebox id="companyList" :menu="menu" :config="pageboxConfig">
        <template slot="logo">
            <router-link to="/company" class="colorinherit">
                <i class="fa fa-briefcase"></i>
            </router-link>
        </template>
        <template slot="header">
            <div class="company_navheader">
                <searchbar v-model="searchValue"></searchbar>
            </div>
        </template>
        <template slot="section">
            <!-- Company Detail Component -->
            <company v-if="editCompany" :bind="editCompany"></company>
            <!-- Company List -->
            <div v-else class="company_section">
                <div class="company_body pagebox_section_scroll">
                    <table class="companies_table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>公司名稱</th>
                                <th>負責人</th>
                                <th>電話</th>
                                <th>地址</th>
                                <th class="row_toolbar">
                                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="company in filtedCompanies" :key="company.id">
                                <td>
                                    <div class="row_toolbar">
                                        <span class="row_tool editor">
                                            <router-link :to="{ name: 'companyDetail', params: { id: company.id } }">
                                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                            </router-link>
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span class="row_title">{{ company.title }}</span>
                                </td>
                                <td>
                                    <div class="row_owner">{{ company.owner }}</div>
                                </td>
                                <td>
                                    <ul class="row_phones">
                                       <li v-for="(phone, index) in company.phones" :key="index">
                                            <span v-if="phone.type == 0"><i class="fa fa-phone" aria-hidden="true"></i></span>
                                            <span v-else><i class="fa fa-fax" aria-hidden="true"></i></span>
                                            <span>{{ phone.phone }}</span>
                                            <span v-show="phone.contactor">{{ phone.contactor }}</span>
                                       </li>
                                    </ul>
                                </td>
                                <td>
                                    <div class="row_address">{{ company.address }}</div>
                                </td>
                                <td>
                                    <div class="row_toolbar">
                                        <span class="row_tool trash" @click="removeCompany(company.id)">
                                            <i class="fa fa-trash-o" aria-hidden="true"></i>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
    </pagebox>
</template>

<script>
import $ from 'jquery'
import Searchbar from '../Searchbar.vue'
import Company from './company.vue'

var {deeploop} = require('../helper.js');

export default {
    components: {
        Company,
        Searchbar
    },
    data () {
        var $this = this;
        var menu = {
            insert: {
                title: '新增廠商',
                icon: '<i class="fa fa-plus"></i>',
                url: '/company/insert'
            }
        };

        return {
            pageboxConfig: {
                sidebarLocked: true,
                get layoutHeader () {
                    return !$this.editCompany;
                }
            },
            searchValue: '',
            editCompany: false,
            companies: [],
            menu: menu
        };
    },
    mounted () {
        console.log('mounted company list');

        setTimeout(() => {
            this.checkRouteUpdate();
        });

        // 更新廠商
        this.$bus.$on('save.company', (company) => {
            console.log('save:', company);

            $.extend(this.editCompany, company);
            // this.$router.push({ name: 'companyList' });
            alert('儲存成功！');
            this.$bus.$emit('reset.company.form');
        });

        // 新增廠商
        this.$bus.$on('insert.company', (company) => {
            console.log('insert: ', company);

            this.companies.push(company);
            this.$router.push({ name: 'companyDetail', params: { id: company.id } });
        });
    },
    beforeRouteUpdate: function (route, prev, next) {
        var $this = this;
        $this.editCompany = false;
        setTimeout(() => { $this.checkRouteUpdate(); });
        next();
    },
    computed: {
        filtedCompanies () {
            var companies = this.companies;
            var searchValue = this.searchValue;

            if (!companies.length) {} else if (searchValue && typeof searchValue === 'string') {
                return companies.filter((row) => {
                    var live = false;

                    deeploop(row, (column) => {
                        if (typeof column === 'string' || typeof column === 'number') {
                            if (column.toString().indexOf(searchValue) >= 0) {
                                live = true;
                                return false;
                            }
                        }
                    });

                    return live;
                });
            }

            return companies;
        }
    },
    methods: {
        editCompanyById (id) {
            id = parseInt(id);
            for (var key in this.companies) {
                if (this.companies[key].id === id) {
                    this.editCompany = this.companies[key];
                    break;
                }
            }

            return this;
        },
        insertCompany () {
            this.editCompany = {};
        },
        removeCompany (id) {
            if (id && confirm('確定要刪除廠商？')) {
                $.delete('api/company/' + id).done((result) => {
                    if (result.success) {
                        this.companies.forEach((company, key) => {
                            if (company.id === id) {
                                this.companies.splice(key, 1);
                            }
                        });
                    }
                });
            }
        },
        checkRouteUpdate () {
            var $route = this.$route;

            if (this.companies.length === 0) {
                return $.get('api/company').done((result) => {
                    if (result.success) {
                        this.companies = result.data;
                        this.checkRouteUpdate();
                    }
                });
            } else {
                switch ($route.name) {
                    case 'companyDetail':
                        this.editCompanyById($route.params.id);
                    break;
                    case 'companyInsert':
                        this.insertCompany();
                    break;
                }
            }

            return this;
        }
    }
}
</script>

<style lang="scss">
@import "~styles/mixin";
@import "~styles/Pagebox";

#companyList {
    $mainColor: #82b440;
    $navheaderHeight: 50px;
    $bodyPadding: 2px;
    $companyItemHeight: 50px;

    @include pageboxtheme((
        logoBgColor: $mainColor,
        sidebarBgColor: $mainColor,
        headerBgColor: $mainColor,
        itemHoverFontColor: rgba(0, 0, 0, 0.5),
        itemActiveFontColor: darken($mainColor, 10%)
    ));

    .company_section {
        position: relative;
        width: 100%;
    }

    .company_navheader {
        @include flexbox();
        @include flex-just(space-between);
        @include align-items(center);

        height: $navheaderHeight;
        width: 100%;
        color: #fff;
        padding: 0 10px;
    }

    .company_body {
        position: relative;
        left: 0;
        max-height: calc(100% - #{$navheaderHeight} - 2px);
        padding: 0px $bodyPadding;
    }

    .companies_table {
        position: relative;
        margin-bottom: 20px;
        border-collapse: collapse;
        border-spacing: 0;
        min-width: 800px;
        max-width: 100%;

        td {
            padding: 12px 11px;
            vertical-align: middle;
            border-top: 1px solid #CCC5B9;
        }

        th {
            padding: 8px 11px;
            vertical-align: middle;
            font-size: 1.2rem;
            text-align: left;
        }

        .row_toolbar {
            text-align: right;

            .row_tool {
                display: inline-block;
                vertical-align: top;
                cursor: pointer;
                color: cornflowerblue;
                margin-right: 5px;

                &:hover {
                    color: darken(cornflowerblue, 10%);
                }
            }
        }

        .row_title {
            display: block;
        }

        .row_phones {
            list-style: none;
            margin: 0;
            padding: 0;

            span {
                margin-right: 5px;
            }
        }
    }
}
</style>
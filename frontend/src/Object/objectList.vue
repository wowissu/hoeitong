<template>
    <pagebox
        id="objectList"
        :menu="menu"
        :config="pageboxConfig"
    >
        <template slot="logo">
            <router-link :to="{name: 'objectList'}" class="colorinherit">
                <i class="fa fa-cubes"></i>
            </router-link>
        </template>
        <template slot="header">
            <div class="object_navheader">
                <span>
                    <span style="display: inline-block;margin-right: 5px"><searchbar v-model="searchValue" tag="span" ></searchbar></span>
                    <span style="display: inline-block;">
                        <span>篩選：</span>
                        <span class="filter_type" :class="{active: filterType.includes('2')}" @click="toggleFilterType('2')"><i class="fa fa-cube"></i></span>
                        <span class="filter_type" :class="{active: filterType.includes('1')}" @click="toggleFilterType('1')"><i class="fa fa-gear"></i></span>
                    </span>
                </span>
            </div>
        </template>
        <template slot="section">
            <router-view v-if="$route.params.id"></router-view>
            <div v-else class="object_section">
                <table class="object_table">
                    <thead>
                        <tr>
                            <th class="th_id">類型</th>
                            <th class="th_title">名稱 / 規格</th>
                            <th class="th_summary">備註</th>
                            <th class="th_toolbar">
                                <i class="fa fa-wrench" aria-hidden="true"></i>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="object in filterList(objectList)" :key="object.id">
                            <td>
                                <div class="row_id">
                                    <i class="fa fa-cube" v-show="object.type == 2"></i>
                                    <i class="fa fa-cog" v-show="object.type == 1"></i>
                                </div>
                            </td>
                            <td>
                                <router-link :to="{name: 'objectProfile', params: {id: object.id}}">
                                    <span class="row_title">{{ object.title }}</span><span class="row_spec" v-if="object.spec">{{ ' / ' + object.spec }}</span>
                                </router-link>
                            </td>
                            <td>
                                <span class="row_summary">{{ object.summary }}</span>
                            </td>
                            <td>
                                <div class="row_toolbar"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </pagebox>
</template>

<script>
import $ from 'jquery'
import Searchbar from '../Searchbar.vue'
var {deeploop} = require('../helper.js');

export default {
    components: {
        Searchbar
    },
    data () {
        var $this = this;

        return {
            filterType: sessionStorage.getItem('filterType') || '1234',
            searchValue: '',
            objectList: [],
            menu: {
                insertProduct: {
                    title: '新增成品',
                    icon: '<span class="object_create_item"><i class="fa fa-cube"></i><small><i class="fa fa-plus"></i></small></span>',
                    click () {
                        $this.createProduct().then((newNode) => {
                            $this.objectList.unshift(newNode);
                            $this.$router.push({ name: 'objectList' });
                        });
                    }
                },
                insertMaterial: {
                    title: '新增成品',
                    icon: '<span class="object_create_item"><i class="fa fa-gear"></i><small><i class="fa fa-plus"></i></small></span>',
                    click () {
                        $this.createMaterial().then((newNode) => {
                            $this.objectList.unshift(newNode);
                            $this.$router.push({ name: 'objectList' });
                        });
                    }
                }
            },
            pageboxConfig: {
                get layoutHeader () {
                    return !$this.$route.params.id;
                }
            }
        };
    },
    mounted () {
        this.updateObjectList();
    },
    watch: {
        filterType: function (val) {
            sessionStorage.setItem('filterType', val);
        }
    },
    methods: {
        toggleFilterType (type) {
            this.filterType = this.filterType.includes(type) ? this.filterType.replace(type, '', 'g') : this.filterType.concat(type)
        },
        updateObjectList () {
            var $this = this;

            return new Promise((resolve, reject) => {
                $.get('api/object').done((result) => {
                    if (result.success) {
                        $this.objectList = result.data;
                        resolve(result.data);
                    }
                });
            });
        },
        filterList (data) {
            var searchValue = this.searchValue;
            var filterType = this.filterType;

            if (data.length) {
                data = data.filter((row) => {
                    return filterType.includes(row.type);
                });

                if (searchValue.length && typeof searchValue === 'string') {
                    data = data.filter((row) => {
                        var live = false;

                        deeploop(row, (column) => {
                            if (column && column.toString().includes(searchValue)) {
                                live = true;
                                return false;
                            }
                        });

                        return live;
                    });
                }
            }

            return data;
        },
        createProduct () {
            return new Promise(function (resolve) {
                $.post('api/object/create/product')
                    .done((res) => {
                        if (res.success) {
                            resolve(res.data);
                        }
                    });
            });
        },
        createMaterial () {
            return new Promise(function (resolve) {
                $.post('api/object/create/material')
                    .done((res) => {
                        if (res.success) {
                            resolve(res.data);
                        }
                    });
            });
        }
    },
    beforeRouteUpdate (to, from, next) {
        // record list scrollTop
        $(this.$el).find('.pagebox_section[belong=objectList]').each(function () {
            var section = $(this);

            if (from.name === 'objectList') {
                from.meta.recrodScroll = section.scrollTop();
            } else if (to.name === 'objectList') {
                setTimeout(((top) => {
                    section.scrollTop(top);
                }).bind(
                    null,
                    to.meta.recrodScroll || 0
                ), 50);

                to.meta.recrodScroll = 0;
            }
        });

        next();
    }
}
</script>

<style lang="scss" src="./scss/objectList.scss"></style>
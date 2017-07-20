<style lang="scss" src="./scss/objectList.scss"></style>
<template src="./templates/objectList.html"></template>

<script>
var {deeploop} = require('../helper.js');

module.exports = {
    components: {
        searchbar: require('../Searchbar.vue')
    },
    data() {
        var $this = this;

        return {
            searchValue: '',
            objectList: [],
            menu: {
                insertProduct: {
                    title: '新增成品',
                    icon: '<span class="object_create_item"><i class="fa fa-cube"></i><small><i class="fa fa-plus"></i></small></span>',
                    click() {
                        $this.createProduct().then((newNode) => {
                            $this.objectList.unshift(newNode);
                            $this.$router.push({ name: 'objectList' });
                        });
                    }
                },
                insertMaterial: {
                    title: '新增成品',
                    icon: '<span class="object_create_item"><i class="fa fa-gear"></i><small><i class="fa fa-plus"></i></small></span>',
                    click() {
                        $this.createMaterial().then((newNode) => {
                            $this.objectList.unshift(newNode);
                            $this.$router.push({ name: 'objectList' });
                        });
                    }
                }
            },
            pageboxConfig: {
                get layoutHeader() {
                    return !$this.$route.params.id;
                }
            }
        };
    },
    methods: {
        updateObjectList() {
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
        filterList(data) {
            var searchValue = this.searchValue;

            if (!data.length) {} else if (searchValue.length && typeof searchValue === 'string') {
                return data.filter((row) => {
                    var live = false;

                    deeploop(row, (column) => {
                        if (column && column.toString().indexOf(searchValue) >= 0) {
                            live = true;
                            return false;
                        }
                    });

                    return live;
                });
            }

            return data;
        },
        createProduct() {
            return new Promise(function (resolve) {
                $.post('api/object/create/product')
                    .done((res) => {
                        if (res.success) {
                            resolve(res.data);
                        }
                    });
            });
        },
        createMaterial() {
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
    mounted() {
        var $this = this;

        $this.updateObjectList();
    },
    beforeRouteUpdate(to, from, next) {
        // record list scrollTop
        $(this.$el).find('.pagebox_section[belong=objectList]').each(function () {
            var section = $(this);

            if (from.name == 'objectList') {

                from.meta.recrodScroll = section.scrollTop();

            } else if (to.name == 'objectList') {

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
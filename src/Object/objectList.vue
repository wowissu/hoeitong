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
        var menu = {
            insert: {
                title: '新增物件',
                icon: '<i class="fa fa-plus"></i>',
                url: '/object/insert'
            }
        };

        return {
            searchValue: '',
            objectList: [],
            menu: menu,
            pageboxConfig: {
                sidebarLocked: true,
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
        checkRouteUpdate() {
            var $this = this;
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
        }
    },
    mounted() {
        var $this = this;

        $this.updateObjectList();
    },
    beforeRouteUpdate(to, from, next) {
        if (this) {

            // record list scrollTop
            $(this.$el).find('.pagebox_section[belong=objectList]').each(() => {
                var section = $(this);

                if (from.name == 'object') {

                    from.meta.recrodScroll = section.scrollTop();

                } else if (to.name == 'object') {

                    setTimeout(((top) => {
                        section.scrollTop(top);
                    }).bind(
                        null,
                        to.meta.recrodScroll || 0
                    ), 50);

                    to.meta.recrodScroll = 0;
                }
            });

        }

        next();
    }
}
</script>
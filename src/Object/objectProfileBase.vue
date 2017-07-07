<template>
<pagebox
    id="object"
    :menu="menu"
    :config="{
        sidebarLocked: true
    }"
>
    <template slot="logo">
        <i class="fa fa-cube" v-show="object.type == 2"></i>
        <i class="fa fa-cog" v-show="object.type == 1"></i>
    </template>
    <template slot="header">
        <div class="profile_header"><h2>{{ object.title }}</h2></div>
    </template>
    <template slot="section">
        <router-view :object="object"></router-view>
    </template>
</pagebox>
</template>

<script>
module.exports = {
    props: ['id'],
    mounted() {
        this.getObject();
    },
    data() {
        var $this = this;

        return {
            object: {},
            menu: {
                back: {
                    title: '上一頁',
                    icon: '<i class="fa fa-arrow-left" style="color: #fff;"></i>',
                    url: { path: '/object' }
                },
                profile: {
                    title: '檔案',
                    icon: '<i class="fa fa-list-alt"></i>',
                    get url() {
                        return { name: 'objectProfile', params: { id: $this.id } };
                    }
                },
                tree: {
                    title: '組成',
                    icon: '<i class="fa fa-sitemap"></i>',
                    get hidden() {
                        try { return $this.object.type != 2; } catch (e) { return true; }
                    },
                    get url() {
                        return { name: 'objectNodes', params: { id: $this.id } };
                    }
                },
                manual: {
                    title: '手冊',
                    icon: '<i class="fa fa-book"></i>',
                    get url() {
                        return { name: 'objectManual', params: { id: $this.id } }
                    }
                },
                save: {
                    title: '儲存',
                    icon: '<i class="fa fa-save"></i>',
                    click() {
                        $this.saveObject().then((data) => {
                            $this.object.title   = data.title;
                            $this.object.model   = data.model;
                            $this.object.spec    = data.spec;
                            $this.object.summary = data.summary;
                            $this.object.tabs    = data.tabs;
                            $this.object.chilren = data.chilren;
                            $this.$bus.$emit('object.save', $this.object);
                        });
                    }
                }
            }
        };
    },
    methods: {
        getObject() {
            var $this = this;
            var url = 'api/object/{id}';

            return new Promise((resolve, reject) => {
                $this.object = {};

                $.get(url.replace('{id}', $this.id))
                    .done((res) => {
                        if (res.success) {
                            $this.object = res.data;
                            resolve($this.object);

                            setTimeout(() => {
                                $this.$bus.$emit('object.change', $this.object);
                            });
                        } else {
                            $this.$router.push({ name: 'objectList' });
                        }

                        reject();
                    })
                    .fail((res) => {
                        console.error(res.message);
                        $this.$router.push({ name: 'objectList' });
                    });
            });
        },
        saveObject() {
            return new Promise((resolve, reject) => {
                var replace = 'insert';
                var object = this.object;
                var $http = $.post;

                // 如果是一般更新
                if (object.id) {
                    $http = $.put;
                    replace = object.id;
                }

                $http('api/object/{id}'.replace('{id}', replace), {
                    id       : object.id,
                    title    : object.title,
                    summary  : object.summary,
                    model    : object.model,
                    spec     : object.spec,
                    images   : object.images,
                    tabs     : object.tabs,
                    children : object.children
                })
                    .done((res) => {
                        if (res.success) {
                            resolve(res.data);
                        } else {
                            reject(res);
                        }
                    });
            });
        }
    },
    watch: {
        id() {
            this.getObject();
        }
    }
}

</script>

<style lang="sass">
@import "~styles/Pagebox"

#object
    $mainColor: darken(#2e88d0, 10%)
    @include pageboxtheme((logoBgColor: $mainColor, sidebarBgColor: $mainColor, headerBgColor: $mainColor, itemHoverFontColor: rgba(0, 0, 0, 0.5), itemActiveFontColor: rgba(0, 0, 0, 0.5) ))

    .profile_header
        @include flexbox()
        @include align-items(center)
        height: 100%

</style>
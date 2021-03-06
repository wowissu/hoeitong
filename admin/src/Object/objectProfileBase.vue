<template>
    <pagebox id="object" :menu="menu" :config="{sidebarLocked: true}">
        <template slot="logo">
            <i class="fa fa-cube" v-show="object.type == 2"></i>
            <i class="fa fa-cog" v-show="object.type == 1"></i>
        </template>
        <template slot="header">
            <div class="profile_header">
                <h2>{{ object.title }}</h2>
                <div class="profile_information">
                    <small>建立: {{ object.created_at | formatDate('YYYY/MM/DD hh:mm') }}</small><br>
                    <small>更新: {{ object.updated_at | formatDate('YYYY/MM/DD hh:mm') }}</small><br>
                </div>
            </div>
        </template>
        <template slot="section">
            <router-view :object="object"></router-view>
        </template>
    </pagebox>
</template>

<script>
import $ from 'jquery'

export default {
    props: ['id'],
    mounted () {
        this.getObject(this.id);
    },
    data () {
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
                    get url () {
                        return { name: 'objectProfile', params: { id: $this.id } };
                    }
                },
                tree: {
                    title: '組成',
                    icon: '<i class="fa fa-sitemap"></i>',
                    get hidden () {
                        try { return $this.object.type !== 2; } catch (e) { return true; }
                    },
                    get url () {
                        return { name: 'objectNodes', params: { id: $this.id } };
                    }
                },
                manual: {
                    title: '手冊',
                    icon: '<i class="fa fa-book"></i>',
                    get url () {
                        return { name: 'objectManual', params: { id: $this.id } }
                    }
                },
                save: {
                    title: '儲存',
                    icon: '<i class="fa fa-save" style="color: #82b440;"></i>',
                    click () {
                        $this.saveObject().then((data) => {
                            $this.object.title = data.title;
                            $this.object.model = data.model;
                            $this.object.spec = data.spec;
                            $this.object.summary = data.summary;
                            $this.object.tabs = data.tabs;
                            $this.object.chilren = data.chilren;
                            $this.$bus.$emit('object.save', $this.object);

                            alert('儲存成功！');
                        });
                    }
                }
            }
        };
    },
    methods: {
        getObject (objectID) {
            return new Promise((resolve, reject) => {
                this.object = {};

                $.get('api/object/{id}'.replace('{id}', objectID))
                    .done((res) => {
                        if (res.success) {
                            this.object = res.data;
                            resolve(this.object);

                            setTimeout(() => {
                                this.$bus.$emit('object.change', this.object);
                            });
                        } else {
                            this.$router.push({ name: 'objectList' });
                            reject(res);
                        }
                    })
                    .fail((res) => {
                        console.error(res.message);
                        this.$router.push({ name: 'objectList' });
                    });
            });
        },
        saveObject () {
            var object = this.object;

            this.$bus.$emit('object.before.save', object);

            return new Promise((resolve, reject) => {
                var objectId = 'insert';
                var type = 'POST';

                // 如果是一般更新
                if (object.id) {
                    type = 'PUT';
                    objectId = object.id;
                }

                $.ajax({
                    type: type,
                    url: `api/object/${objectId}`,
                    data: {
                        id: object.id,
                        title: object.title,
                        summary: object.summary,
                        model: object.model,
                        spec: object.spec,
                        images: object.images,
                        tabs: object.tabs,
                        children: object.children,
                        content: object.content
                    }
                }).done((res) => {
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
        id (id) {
            this.getObject(id);
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
            @include flex-just(space-between)
            height: 100%

            .profile_information
                padding-right: 10px
                opacity: 0.5
</style>
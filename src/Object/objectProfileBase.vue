<template src="./templates/profile/base.html"></template>

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
                        if ($this.$route.name == 'objectProfile') {
                            $this.$bus.$emit('object.save.profile');
                        }
                    }
                }
            }
        };
    },
    methods: {
        getObject() {
            var $this = this;
            var url = 'api/object/{id}?with=tabs,images';

            return new Promise((resolve, reject) => {
                $this.object = {};

                $.get(url.replace('{id}', $this.id))
                    .done((result) => {
                        if (result.success) {
                            $this.object = result.data;
                            resolve($this.object);

                            setTimeout(() => {
                                $this.$bus.$emit('object.change', $this.object);
                            });
                        } else {
                            $this.$router.push({ name: 'objectList' });
                        }

                        reject();
                    })
                    .fail((result) => {
                        console.error(result.message);
                        $this.$router.push({ name: 'objectList' });
                    });
            });
        }
    },
    watch: {
        id(val) {
            this.getObject();
        }
    }
}

</script>

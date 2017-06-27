<template src="./templates/profile/index.html"></template>


<script>

var tabpanel = require('../Tab/TabPanel.vue');

module.exports = {
    components: {
        tabpanel
    },
    props: ['object'],
    mounted() {
        var $this = this;

        $this.$bus.$on('object.save.profile',() => {
            this.saveObject().then((result) => {
                if (result.success) {
                    $this.tabchanged = false;

                    $this.object.title   = result.data.title;
                    $this.object.model   = result.data.model;
                    $this.object.spec    = result.data.spec;
                    $this.object.summary = result.data.summary;
                    $this.object.tabs    = result.data.tabs;

                    $this.$router.push({ path: '/object/' + $this.object.id });
                }
            });
        });
    },
    data() {
        return {
            formstate: {},
            tabchanged: false
        };
    },
    methods: {
        saveObject() {
            var $this = this;

            return new Promise((resolve) => {
                var url = 'api/object/{id}';
                var replace = 'insert';
                var object = $this.object;
                var $http = $.post;

                // 如果是一般更新
                if (object.id) {
                    $http = $.put;
                    replace = object.id;
                }

                $http(url.replace('{id}', replace), {
                    id      : object.id,
                    title   : object.title,
                    summary : object.summary,
                    model   : object.model,
                    spec    : object.spec,
                    images  : object.images,
                    tabs    : object.tabs
                })
                    .done((result) => {
                        resolve(result);
                        $this.$bus.$emit('save.object.success', result);
                    });
            });
        }
    }
}

</script>
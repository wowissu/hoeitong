(function ()
{
    "use strict";

    var bus = window.bus || (window.bus = new Vue());
    var routeComps = window.RouteComponents || (window.RouteComponents = {});

    routeComps.objectProfileBase = function (resolve)
    {
        var $COMP = {
            props: ['id'],
            mounted: function ()
            {
                this.getObject();
            }
        };

        $COMP.watch = {};

        $COMP.data = function ()
        {
            var $this = this;
            var menu = {
                profile: {
                    title: '檔案',
                    icon: '<i class="fa fa-list-alt"></i>',
                    url: { name: 'objectProfile', params: { id: $this.$route.params.id } }
                },
                tree: {
                    title: '組成',
                    icon: '<i class="fa fa-sitemap"></i>',
                    url: { name: 'objectElements', params: { id: $this.$route.params.id } }
                },
                manual: {
                    title: '手冊',
                    icon: '<i class="fa fa-book"></i>',
                    url: { name: 'objectManual', params: { id: $this.$route.params.id } }
                },
                save: {
                    title: '儲存',
                    icon: '<i class="fa fa-save" style="color: #82b440"></i>',
                    click: function ()
                    {
                        if ($this.$route.name == 'objectProfile') {
                            bus.$emit('object.save.profile');
                        }
                    }
                }
            };

            return {
                object: {},
                menu: menu,
                get pageName() {
                    return $this.$route.name;
                }
            };
        };

        $COMP.methods = {
            getObject: function () {
                var $this = this;
                var url = 'api/object/{id}/tabs/images';

                $.get(url.replace('{id}', this.id))
                    .done(function (result)
                    {
                        if (result.success) {
                            $this.object = result.data;

                            Vue.nextTick(function () {
                                bus.$emit('object.ready', $this.object);
                            });
                        } else {
                            $this.$router.push({ name: 'objectList' });
                        }
                    })
                    .fail(function (result)
                    {
                        console.error(result.message);
                        $this.$router.push({ name: 'objectList' });
                    });
            }
        };

        $.get('template/object/profile/bone.html').done(function (template)
        {
            resolve({
                template : template,
                data     : $COMP.data,
                props    : $COMP.props,
                mounted  : $COMP.mounted,
                methods  : $COMP.methods,
                watch    : $COMP.watch
            });
        });
    };

    routeComps.objectProfile = function (resolve)
    {
        var $COMP = {
            mounted: function ()
            {
                var $this = this;

                bus.$on('object.save.profile', function () {
                    $this.saveObject().then(function (result)
                    {
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
            }
        };

        $COMP.data = function ()
        {
            return {
                formstate: {},
                tabchanged: false
            };
        };

        $COMP.methods = {
            saveObject: function ()
            {
                var $this = this;

                return new Promise(function (resolve) {
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
                        .done(function (result)
                        {
                            resolve(result);
                            bus.$emit('save.object.success', result);
                        });
                });
            }
        }

        $.get('template/object/profile/profile.html').done(function (template)
        {
            resolve({
                props    : ['object'],
                template : template,
                data     : $COMP.data,
                mounted  : $COMP.mounted,
                methods  : $COMP.methods,
            });
        });
    }

    routeComps.objectProfileElements = function (resolve)
    {
        $.get('template/object/profile/elements.html').done(function (template)
        {
            resolve({
                props: {
                    object: {
                        type: Object,
                        required: true
                    }
                },
                data: function () {

                    var $this = this;
                    var object = $this.object;

                    return {
                        node: {
                            get id() { return object.id; },
                            get title() { return object.title; },
                            get summary() { return object.summary; },
                            get type() { return object.type; },
                            get model() { return object.model; },
                            get spec() { return object.spec; },
                            children: []
                        }
                    };
                },
                template: template,
                mounted: function ()
                {
                    var $this = this;

                    if ($this.object.id) {

                        $this.getTree();

                    } else {
                        bus.$on('object.ready', function (object)
                        {
                            $this.getTree();
                        });
                    }
                },
                methods: {
                    getTree: function ()
                    {
                        var $this = this;

                        return new Promise(function (resolve, reject) {
                            $.get('api/object/{id}/nodes'.replace('{id}', $this.object.id))
                                .done(function (result)
                                {
                                    if (result.success) {
                                        $this.node.children = result.data;
                                        resolve(result.data);
                                    }
                                })
                                .fail(function (result)
                                {
                                    console.error(result.message);
                                    reject();
                                });
                        });
                    }
                }
            });
        });
    };


    routeComps.objectProfileManual = function (resolve)
    {
        $.get('template/object/profile/manual.html').done(function (template)
        {
            resolve({
                props: ['object'],
                template: template
            });
        });
    };


    Vue.component('treenode', function (resolve)
    {
        $.get('template/object/profile/node.html').done(function (template)
        {
            resolve({
                template: template,
                props: {
                    node: {
                        type: Object,
                        reuqired: true
                    },
                    parent: {
                        type: Object
                    },
                    childnode: {
                        type: String,
                        default: 'children'
                    }
                },
                data: function ()
                {
                    var $this = this;

                    return {};
                }
            });
        });
    });

}());
(function ()
{
    "use strict";

    var bus = window.bus || (window.bus = new Vue());
    var routeComps = window.RouteComponents || (window.RouteComponents = {});

    routeComps.objectProfileBase = function (resolve)
    {
        var $COMP = {};

        $COMP.watch = {
            id: function (val)
            {
                this.getObject();
            }
        };

        $COMP.data = function ()
        {
            var $this = this;
            var menu = {
                back: {
                    title: '上一頁',
                    icon: '<i class="fa fa-arrow-left" style="color: #fff;"></i>',
                    url: { path: '/object' }
                },
                profile: {
                    title: '檔案',
                    icon: '<i class="fa fa-list-alt"></i>',
                    get url() {
                        return { name: 'objectProfile', params: { id: $this.$route.params.id } };
                    }
                },
                tree: {
                    title: '組成',
                    icon: '<i class="fa fa-sitemap"></i>',
                    get url() {
                        return { name: 'objectNodes', params: { id: $this.$route.params.id } };
                    }
                },
                manual: {
                    title: '手冊',
                    icon: '<i class="fa fa-book"></i>',
                    url: { name: 'objectManual', params: { id: $this.$route.params.id } }
                },
                save: {
                    title: '儲存',
                    icon: '<i class="fa fa-save"></i>',
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
                menu: menu
            };
        };

        $COMP.methods = {
            getObject: function () {
                var $this = this;
                var url = 'api/object/{id}?with=tabs,images';

                return new Promise(function (resolve, reject)
                {
                    $this.object = {};

                    $.get(url.replace('{id}', $this.id))
                        .done(function (result)
                        {
                            if (result.success) {
                                $this.object = result.data;
                                resolve($this.object);

                                setTimeout(function ()
                                {
                                    bus.$emit('object.change', $this.object);
                                });
                            } else {
                                $this.$router.push({ name: 'objectList' });
                            }

                            reject();
                        })
                        .fail(function (result)
                        {
                            console.error(result.message);
                            $this.$router.push({ name: 'objectList' });
                        });
                });
            }
        };

        $.get('template/object/profile/bone.html').done(function (template)
        {
            resolve({
                template : template,
                data     : $COMP.data,
                methods  : $COMP.methods,
                watch    : $COMP.watch,
                props    : ['id'],
                mounted  : function ()
                {
                    this.getObject();
                }
            });
        });
    };

}());
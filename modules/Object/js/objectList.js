(function ()
{
    "use strict";

    var bus = window.bus || (window.bus = new Vue());
    var routeComps = window.RouteComponents || (window.RouteComponents = {});

    routeComps.objectComponent = function (resolve)
    {
        var $COMP = {};

        $COMP.data = function ()
        {
            var $this = this;
            var menu = {
                insert: {
                    title: '新增物件',
                    icon: '<i class="fa fa-plus"></i>',
                    url: '/object/insert'
                }
            };

            return {
                search: '',
                menu: menu,
                pageboxConfig: {
                    sidebarLocked: true,
                    get layoutHeader() {
                        return !$this.$route.params.id;
                    },
                },
                objectList: [],
            };
        };

        $COMP.methods = {
            updateObjectList: function ()
            {
                var $this = this;

                return new Promise(function (resolve, reject)
                {
                    $.get('api/object').done(function (result)
                    {
                        if (result.success) {
                            $this.objectList = result.data;

                            resolve(result.data);
                        }
                    });
                });
            },
            checkRouteUpdate: function ()
            {
                var $this = this;
            },
            filterList: function (data)
            {
                if (!data.length) {
                    return data;
                }

                var $this = this;
                var filterby = $this.search;

                if (filterby.length && typeof filterby === 'string') {
                    data = data.filter(function (row)
                    {
                        var live = false;

                        deeploop(row, function (column)
                        {
                            if (column && column.toString().indexOf(filterby) >= 0) {
                                live = true;
                                return false;
                            }
                        });

                        return live;
                    });
                }

                return data;
            }
        };

        $.get('template/object.html').done(function (template)
        {
            var prevScrollTop = 0;

            resolve({
                template: template,
                data: $COMP.data,
                methods: $COMP.methods,
                mounted: function ()
                {
                    var $this = this;

                    $this.updateObjectList();
                },
                beforeRouteUpdate: function (to, from, next)
                {
                    if (this) {

                        // record list scrollTop
                        $(this.$el).find('.pagebox_section[belong=objectList]').each(function ()
                        {
                            var section = $(this);

                            if (from.name == 'object') {

                                from.meta.recrodScroll = section.scrollTop();

                            } else if (to.name == 'object') {
                                setTimeout(function (top) {

                                    section.scrollTop(top);

                                }.bind(
                                    null,
                                    to.meta.recrodScroll || 0
                                ), 50);

                                to.meta.recrodScroll = 0;
                            }
                        });

                    }

                    next();
                }
            });
        });
    };


}());
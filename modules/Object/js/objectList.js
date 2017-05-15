(function ()
{
    "use strict";

    var evt = window.evt || (window.evt = new Vue());
    var routeComps = window.RouteComponents || (window.RouteComponents = {});

    routeComps.objectComponent = function (resolve)
    {
        var $COMP = {
            mounted: function ()
            {
                var $this = this;

                $this.updateObjectList();
            }
        };

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
                showHeader: undefined,
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
            resolve({
                template: template,
                data: $COMP.data,
                methods: $COMP.methods,
                mounted: $COMP.mounted,
                beforeRouteUpdate: function (route, prev, next)
                {
                    var $this = this;

                    if ($this) {
                        $this.editCompany = false;

                        setTimeout(function ()
                        {
                            $this.checkRouteUpdate();
                        });
                    }

                    next();
                }
            });
        });
    };


}());
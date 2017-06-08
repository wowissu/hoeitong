(function ()
{
    "use strict";

    var bus = window.bus || (window.bus = new Vue());
    var routeComps = window.RouteComponents || (window.RouteComponents = {});

    routeComps.objectProfileNodes = function (resolve)
    {
        $.get('template/object/profile/nodes.html').done(function (template)
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

                    return {
                        node: {
                            get id() { return $this.object.id; },
                            get title() { return $this.object.title; },
                            get summary() { return $this.object.summary; },
                            get type() { return $this.object.type; },
                            get model() { return $this.object.model; },
                            get spec() { return $this.object.spec; },
                            hidden: true,
                            children: []
                        }
                    };
                },
                template: template,
                mounted: function ()
                {
                    var $this = this;

                    bus.$once('object.change', function (obj)
                    {
                        $this.getTree(obj.id);
                    });

                    if ($this.$route.params.id == $this.object.id) {
                        bus.$emit('object.change', $this.object);
                    }
                },
                methods: {
                    getTree: function (id)
                    {
                        var $this = this;

                        return new Promise(function (resolve, reject)
                        {
                            $.get('api/object/{id}/nodes'.replace('{id}', id))
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
                },
            });
        });
    };

}());
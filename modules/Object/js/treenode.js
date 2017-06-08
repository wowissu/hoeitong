(function ()
{
    "use strict";

    var bus = window.bus || (window.bus = new Vue());
    var routeComps = window.RouteComponents || (window.RouteComponents = {});

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

                    return {
                        get hasChild() {
                            if ($this.childnode in $this.node && $this.node[$this.childnode] instanceof Array) {
                                if ($this.node[$this.childnode].length) {
                                    return true;
                                }
                            }

                            return false;
                        }
                    };
                },
                methods: function ()
                {

                }
            });
        });
    });

}());
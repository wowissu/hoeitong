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
                    root: {
                        type: Object,
                        default: false
                    },
                    parent: {
                        type: Object,
                        default: false
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
                        unfold: true, // 預設開啟
                        get is_root() { return $this.node === $this.root; },
                        get has_child() {
                            if ($this.childnode in $this.node && $this.node[$this.childnode] instanceof Array) {
                                if ($this.node[$this.childnode].length) {
                                    return true;
                                }
                            }

                            return false;
                        }
                    };
                },
                mounted: function ()
                {
                    // set root if not specify
                    if (this.root === false && this.parent === false) {
                        this.root = this.node;
                    }
                },
                methods: {
                    nodeRemove: function () {
                        console.log('node remove');
                    }
                }
            });
        });
    });

}());
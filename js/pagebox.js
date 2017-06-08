(function ()
{
    "use strict";

    Vue.component('pagebox', {
        props: {
            id: String,
            menu: {
                type: Object,
                required: true
            },
            config: {
                type: Object,
                default: function () { return {}; }
            },
            layout: {
                type: String,
                default: function () {
                    return {};
                },
            },
        },
        template: '#pagebox-template',
        data: function ()
        {
            var $this = this;

            return {
                sidebarunfold: false,
                defaultConfig: {
                    sidebarLocked: false,
                    sidebarUnfold: false,
                    sidebarHoverUnfold: false,
                    layoutHeader: true,
                    layoutSidebar: true,
                    layoutEmpty: false,
                    layoutLogo: true,
                }
            };
        },
        mounted: function ()
        {
            Object.assign(this.config, this.defaultConfig, this.config);
        }
    });

}());
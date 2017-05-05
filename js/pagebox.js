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
            sidebar: {
                type: Object,
                default: function () {
                    return {
                        locked: false,
                        unfold: false,
                        hoverUnfold: false,
                        style: {}
                    };
                }
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
            };
        },
        mounted: function ()
        {

        }
    });

}());
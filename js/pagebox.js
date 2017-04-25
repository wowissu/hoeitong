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
            navbar: {
                type: Object,
                default: {
                    locked: false,
                    unfold: false,
                    style: {}
                }
            }
        },
        template: '#pagebox-template',
        data: function ()
        {
            var $this = this;

            return {};
        },
        mounted: function ()
        {
            // console.log('pagebox mounted', this);
        }
    });

}());
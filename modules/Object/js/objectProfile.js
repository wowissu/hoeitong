(function ()
{
    "use strict";

    var bus = window.bus || (window.bus = new Vue());
    var routeComps = window.RouteComponents || (window.RouteComponents = {});

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

}());
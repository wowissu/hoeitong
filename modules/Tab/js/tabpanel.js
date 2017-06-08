(function ()
{
    "use strict";

    var bus = window.bus || (window.bus = new Vue());
    var routeComps = window.RouteComponents || (window.RouteComponents = {});

    Vue.component('tabpanel', function (resolve) {

        $.get('template/tab/panel.html').done(function (template)
        {
            var $COMP = {
                props: {
                    tabs: {
                        type: Array,
                        required: true
                    }
                }
            };

            $COMP.data = function ()
            {
                var $this = this;

                return {
                    tabsLength: false,
                    search: {
                        text: '',
                        tabs: [],
                        focusIndex: -1
                    },
                };
            };

            var searchTimeout = setTimeout(function () {});

            $COMP.methods = {
                clearSearch: function ()
                {
                    this.search.text = '';
                    this.search.tabs = [];
                    this.search.focusIndex = -1;
                },
                addTab: function (tab)
                {
                    this.tabs.push(tab);
                    this.clearSearch();
                    this.$emit('change', this.tabs);
                },
                searchResultKeyDown: function (event)
                {
                    this.search.focusIndex = Math.min(this.search.focusIndex + 1, this.search.tabs.length - 1);
                    this.search.text = this.search.tabs[this.search.focusIndex].title;
                },
                searchResultKeyUp: function (event)
                {
                    this.search.focusIndex = Math.max(this.search.focusIndex - 1, 0);
                    this.search.text = this.search.tabs[this.search.focusIndex].title;
                },
                deleteTabByIndex: function (index)
                {
                    if (index in this.tabs) {
                        this.tabs.splice(index, 1);
                        this.clearSearch();
                        this.$emit('change', this.tabs);
                    }
                },
                searchInputOnEnter: function ()
                {
                    if (this.search.focusIndex in this.search.tabs) {
                        this.addTab(this.search.tabs[this.search.focusIndex]);
                    } else if (this.search.text) {
                        this.addTab({
                            title: this.search.text
                        });
                    }
                },
                searchInputOnDelete: function ()
                {
                    if (!this.search.text) {
                        this.tabs.pop();
                    }
                },
                updateSearchResult: function ()
                {
                    var $this = this;

                    $this.search.tabs = [];
                    $this.focusIndex = -1;

                    if ($this.search.text) {
                        $.get('api/tab/search/' + $this.search.text)
                            .done(function (result)
                            {
                                if (result.success) {
                                    $this.search.tabs = result.data;
                                }
                            });
                    }
                },
                filterResult: function (result)
                {
                    return result;
                }
            };

            resolve({
                template: template,
                props: $COMP.props,
                data: $COMP.data,
                methods: $COMP.methods,
                mounted: $COMP.mounted,
                watch: $COMP.watch
            });
        });
    });

}());
(function ()
{
    "use strict";

    window.VueComponents = window.VueComponents || {};


    window.VueComponents.companiesComponent = {
        template: '#companies-template',
        methods: {
            getList: function ()
            {
                return $.getJSON('api/company');
            },
            insertCompany: function ()
            {
                console.log('create company');
            },
            removeCompany: function ()
            {
                console.log('remove company');
            },
            filterCompanies: function (companies)
            {
                if (!companies.length) {
                    return companies;
                }

                var $this = this;
                var filterby = $this.table.filterby;

                if (filterby.length && typeof filterby === 'string') {
                    companies = companies.filter(function (row)
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

                return companies;
            }
        },
        data: function () {

            var $this = this;

            return {
                companies: [],
                menu: {
                    insert: {
                        title: '新增廠商',
                        icon: '<i class="fa fa-plus"></i>',
                        click: function ()
                        {
                            if (!this.disable) {
                                $this.insertCompany();
                            }
                        }
                    },
                    // remove: {
                    //     disable: true,
                    //     title: '刪除廠商',
                    //     icon: '<i class="fa fa-trash-o"></i>',
                    //     click: function ()
                    //     {
                    //         if (!this.disable) {
                    //             $this.removeCompany();
                    //         }
                    //     }
                    // },
                },
                navbar: {
                    locked: true
                },
                table: {
                    filterby: ''
                }
            };
        },
        mounted: function ()
        {
            var $this = this;

            // console.info('companies mounted', $this);

            $this.getList()
                .done(function (companies)
                {
                    // console.log(companies);
                    $this.companies = companies;
                });
        }
    };

    window.VueComponents.companyComponent = {
        template: '#company-template',
        methods: {
            setId: function (companyId)
            {
                var $this = this;

                $this.getCompany(companyId)
                    .done(function (data)
                    {
                        console.log(data);
                    })
                    .fail(function ()
                    {
                        $this.$router.push({ path: '/company' });
                    });

                return $this;
            },
            getCompany: function (id)
            {
                return $.getJSON('api/company/' + id);
            }
        },
        data: function ()
        {
            var $this = this;

            return {
                get id () {
                    return $this.$route.params.id;
                }
            };
        },
        mounted: function ()
        {
            var $this = this;

            console.info('company mounted', $this);

            $this.setId($this.$route.params.id);
        },
        beforeRouteUpdate: function (route, prev, next)
        {
            var $this = this;

            if ($this) {
                $this.setId(route.params.id);
            }

            next();
        }
    };

}());
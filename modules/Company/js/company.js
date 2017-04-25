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
        },
        data: function () {

            var $this = this;

            return {
                checkAll: false,
                companies: [],
                menu: {
                    insert: {
                        title: '新增廠商',
                        click: function ()
                        {
                            $this.insertCompany();
                        },
                        icon: '<i class="fa fa-plus"></i>'
                    },
                    remove: {
                        title: '刪除廠商',
                        click: function ()
                        {
                            $this.removeCompany();
                        },
                        icon: '<i class="fa fa-trash-o"></i>'
                    },
                },
                navbar: {
                    locked: true
                }
            };
        },
        watch: {
            checkAll: function (state)
            {
                this.companies.map(function (company)
                {
                    company.checked = state;
                    return company;
                });
            }
        },
        mounted: function ()
        {
            var $this = this;

            // console.info('companies mounted', $this);

            $this.getList()
                .done(function (companies)
                {
                    console.log(companies);
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
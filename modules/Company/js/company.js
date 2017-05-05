(function ()
{
    "use strict";

    window.VueComponents = window.VueComponents || {};

    window.VueComponents.companyListComponent = function (resolve)
    {
        var data = function ()
        {
            var $this = this;

            return {
                get id () {
                    return $this.$route.params.id;
                },
                layout: {
                    get header () {
                        return $this.id ? false : null;
                    }
                },
                companies: [],
                menu: {
                    insert: {
                        title: '新增廠商',
                        icon: '<i class="fa fa-plus"></i>',
                        click: function ()
                        {
                            $this.insertCompany();
                        }
                    }
                },
                sidebar: {
                    locked: true
                },
                table: {
                    filterby: ''
                }
            };
        };

        var getList = function ()
        {
            return $.getJSON('api/company');
        };

        var getCompany = function (id)
        {
            return
        };

        var updateCompany = function (id)
        {
            var $this = this;

            $.getJSON('api/company/' + id).then(function (data) {
                for (var key in $this.companies) {
                    if ($this.companies[key].id == data.id) {
                        $this.companies[key] = data;
                        break;
                    }
                }
            });
        };

        var insertCompany = function ()
        {
            console.log('create company');
        };

        var removeCompany = function (id)
        {
            console.log('remove company: ', id);
        };

        var filterCompanies = function (companies)
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
        };

        resolve({
            template: '#companies-template',
            data: data,
            methods: {
                getList: getList,
                insertCompany: insertCompany,
                removeCompany: removeCompany,
                filterCompanies: filterCompanies,
                updateCompany: updateCompany,
            },
            mounted: function ()
            {
                var $this = this;

                $this.getList()
                    .done(function (companies)
                    {
                        // console.log(companies);
                        $this.companies = companies;
                    });
            }
        });
    };

    window.VueComponents.companyComponent = function (resolve) {

        var data = function ()
        {
            var $this = this;
            var $route = $this.$route;

            var menu = {
                prev: {
                    title: '上一頁',
                    icon: '<i class="fa fa-arrow-left"></i>',
                    url: '/company'
                },
                save: {
                    get disable() {
                        return !($this.formstate.$valid && $this.formstate.$dirty);
                    },
                    title: '儲存',
                    icon: '<i class="fa fa-save"></i>',
                    click: function ()
                    {
                        $this.saveSubmit($this.formstate);
                    }
                }
            };

            var PhoneControl = {
                focus: false,
                newPhone: null,
                clear: function ()
                {
                    this.newPhone = null;
                    this.focus = false;
                },
                toggleFocus: function (item, state)
                {
                    if (item instanceof Object) {
                        Vue.set(item, 'focus', state);
                    }

                    return this;
                },
                toggleType: function (item)
                {
                    item.type = item.type == 0 ? 1 : 0;
                },
                insert: function (event)
                {
                    var company = $this.company;

                    if (this.newPhone) {
                        var length = company.phones.push({
                            contactor: null,
                            company_id: company.id,
                            phone: this.newPhone,
                            type: 0
                        });

                        if (event.type == 'keydown') {
                            $this.$nextTick(function ()
                            {
                                setTimeout(function () {
                                    var el = $('[index='+ (length-1) +']').focus();
                                    console.log(el);
                                });
                            });
                        }

                        $this.phoneschange += 1;
                    }

                    this.clear();
                },
                remove: function (key)
                {
                    if (key in $this.company.phones) {
                        if (confirm('確認要移除電話？')) {
                            $this.company.phones.splice(key, 1);
                            $this.phoneschange += 1;
                        }
                    }
                }
            };

            return {
                get id () { return $route.params.id; },
                formstate: {},
                company: {},
                menu: menu,
                PhoneControl: PhoneControl,
                phoneschange: 0,
            };
        };

        var getCompany = function (id)
        {
            return $.getJSON('api/company/' + id);
        };

        var setId = function (companyId)
        {
            var $this = this;

            $this.getCompany(companyId)
                .done(function (data)
                {
                    console.log(data);
                    $this.company = data;
                })
                .fail(function ()
                {
                    $this.$router.push({ name: 'companyList' });
                });

            return $this;
        };

        var setRoute = function (route)
        {
            var $this = this;
                $this.editmod = false;

            // console.log(route);

            // 如果不是當前公司，就重新拿一個
            if (route.params.id != $this.company.id) {
                $this.setId(route.params.id);
            }

            if (route.name == 'companyEditor') {
                $this.editmod = true;
            }
        };

        var saveSubmit = function (formstate)
        {
            var $this = this;

            if (formstate.$valid && formstate.$dirty) {

                var company = $this.company;

                console.log('submit', company);

                $.post('api/company/update', {
                    id: company.id,
                    title: company.title,
                    email: company.email,
                    summary: company.summary,
                    address: company.address,
                    owner: company.owner,
                    phones: company.phones
                })
                .then(function (data)
                {
                    $this.$router.push({ name: 'companyList' });

                    // console.log($this);
                    // location.reload();
                });
            }
        };

        resolve({
            template: '#company-template',
            data: data,
            methods: {
                getCompany: getCompany,
                setId: setId,
                setRoute: setRoute,
                saveSubmit: saveSubmit
            },
            mounted: function ()
            {
                var $this = this;
                $this.setRoute($this.$route);
            },
            watch: {
                phoneschange: function ()
                {
                    this.formstate.phones.$dirty = true;
                    this.formstate.phones.$touched = true;
                }
            },
            beforeRouteUpdate: function (route, prev, next)
            {
                var $this = this;

                if ($this) {
                    $this.setRoute(route);
                }

                next();
            }
        });

    };

}());
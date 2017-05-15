(function ()
{
    "use strict";

    var evt = window.evt || (window.evt = new Vue());
    var routeComps = window.RouteComponents || (window.RouteComponents = {});

    routeComps.companyComponent = function (resolve)
    {
        var data = function ()
        {
            var $this = this;
            var menu = {
                insert: {
                    title: '新增廠商',
                    icon: '<i class="fa fa-plus"></i>',
                    url: '/company/insert'
                }
            };

            return {
                layout: {
                    get header () {
                        return $this.editCompany ? false : null;
                    }
                },
                companies: [],
                editCompany: false,
                menu: menu,
                table: {
                    filterby: ''
                }
            };
        };

        var editCompanyById = function (id)
        {
            var $this = this;

            for (var key in $this.companies) {
                if ($this.companies[key].id == id) {
                    $this.editCompany = $this.companies[key];
                    break;
                }
            }

            return $this;
        };

        var insertCompany = function ()
        {
            console.log('create company');
            var $this = this;

            $this.editCompany = {};
        };

        var removeCompany = function (id)
        {
            var $this = this;

            if (id && confirm('確定要刪除廠商？')) {
                $.delete('api/company/' + id).done(function (result)
                {
                    if (result.success) {
                        $this.companies.forEach(function (company, key)
                        {
                            if (company.id == id) {
                                $this.companies.splice(key, 1);
                            }
                        });
                    }
                });
            }
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

        var checkRouteUpdate = function ()
        {
            var $this = this;
            var $route = $this.$route;

            if ($this.companies.length == 0) {
                return $.get('api/company').done(function (result)
                {
                    if (result.success) {
                        $this.companies = result.data;
                        $this.checkRouteUpdate();
                    }
                });
            }

            switch ($route.name) {
                case 'companyDetail':
                    $this.editCompanyById($route.params.id);
                break;
                case 'companyInsert':
                    $this.insertCompany();
                break;
            }

            return $this;
        }

        resolve({
            template: '#companies-template',
            data: data,
            methods: {
                insertCompany: insertCompany,
                removeCompany: removeCompany,
                filterCompanies: filterCompanies,
                editCompanyById: editCompanyById,
                checkRouteUpdate: checkRouteUpdate
            },
            mounted: function ()
            {
                var $this = this;

                setTimeout(function ()
                {
                    $this.checkRouteUpdate();
                });

                // 更新廠商
                evt.$on('save.company', function (company)
                {
                    console.log('save:', company);

                    $.extend($this.editCompany, company);
                    $this.$router.push({ name: 'companyList' });
                });

                // 新增廠商
                evt.$on('insert.company', function (company)
                {
                    console.log('insert: ', company);

                    $this.companies.push(company);
                    $this.$router.push({ name: 'companyDetail', params: { id: company.id } });
                });

                // evt.$on('delete.company', function (company)
                // {
                //     console.log('delete:', company);
                // });
            },
            beforeRouteUpdate: function (route, prev, next)
            {
                var $this = this;

                if ($this) {
                    $this.editCompany = false;

                    setTimeout(function ()
                    {
                        $this.checkRouteUpdate();
                    });
                }

                next();
            }
        });
    };

    Vue.component('company', function (resolve)
    {
        var data = function ()
        {
            var $this = this;

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
                        $this.company.phones.splice(key, 1);
                        $this.phoneschange += 1;
                    }
                }
            };

            return {
                get inserted() {
                    return $this.$route.name == 'companyInsert';
                },
                company: {},
                formstate: {},
                phoneschange: 0,
                menu: menu,
                PhoneControl: PhoneControl,
            };
        };

        var saveSubmit = function (formstate)
        {
            var $this = this;


            // 通過驗證並被修改過
            if (formstate.$valid && formstate.$dirty) {


                var company = $this.company;
                var $route = $this.$route;
                var eventName = 'save.company';
                var request = {
                    url: 'api/company/' + company.id,
                    type: 'PUT',
                    data: {
                        id      : company.id,
                        title   : company.title,
                        email   : company.email,
                        summary : company.summary,
                        address : company.address,
                        owner   : company.owner,
                        phones  : company.phones
                    },
                };

                if ($route.name == 'companyInsert') {
                    request.type = 'POST';
                    request.url  = 'api/company';
                    eventName    = 'insert.company';
                }

                $.ajax(request).done(function (result)
                {
                    if (result.success) {
                        evt.$emit(eventName, result.data);
                    }
                });
            }
        };

        resolve({
            template: '#company-template',
            props: {
                bind: {
                    type: Object,
                    required: true
                }
            },
            data: data,
            methods: {
                saveSubmit: saveSubmit
            },
            mounted: function ()
            {
                var $this = this;

                $this.company = JSON.parse(JSON.stringify($this.bind));

                $this.company.phones = $this.company.phones || [];
            },
            watch: {
                phoneschange: function ()
                {
                    this.formstate.phones.$dirty = true;
                    this.formstate.phones.$touched = true;
                }
            }
        });
    });

}());
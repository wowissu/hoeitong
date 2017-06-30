<style lang="scss" src="./scss/companyList.scss"></style>
<template src="./templates/companyList.html"></template>

<script>
var {deeploop} = require('../helper.js');

module.exports = {
    components: {
        company: require('./company.vue'),
        searchbar: require('../Searchbar.vue')
    },
    data () {
        var $this = this;
        var menu = {
            insert: {
                title: '新增廠商',
                icon: '<i class="fa fa-plus"></i>',
                url: '/company/insert'
            }
        };

        return {
            pageboxConfig: {
                sidebarLocked: true,
                get layoutHeader() {
                    return $this.editCompany ? false : true;
                }
            },
            searchValue: '',
            editCompany: false,
            companies: [],
            menu: menu,
        };
    },
    mounted: function ()
    {
        console.log('mounted company list');

        var $this = this;

        setTimeout(function ()
        {
            $this.checkRouteUpdate();
        });

        // 更新廠商
        this.$bus.$on('save.company', function (company)
        {
            console.log('save:', company);

            $.extend($this.editCompany, company);
            $this.$router.push({ name: 'companyList' });
        });

        // 新增廠商
        this.$bus.$on('insert.company', function (company)
        {
            console.log('insert: ', company);

            $this.companies.push(company);
            $this.$router.push({ name: 'companyDetail', params: { id: company.id } });
        });
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
    },
    computed: {
        filtedCompanies() {
            var companies = this.companies;
            var searchValue = this.searchValue;

            if (!companies.length) {} else if (searchValue && typeof searchValue === 'string') {
                return companies.filter(function (row)
                {
                    var live = false;

                    deeploop(row, function (column)
                    {
                        if (typeof column === 'string' || typeof column === 'number') {
                            if (column.toString().indexOf(searchValue) >= 0) {
                                live = true;
                                return false;
                            }
                        }

                    });

                    return live;
                });
            }

            return companies;
        }
    },
    methods: {
        editCompanyById: function (id)
        {
            var $this = this;

            for (var key in $this.companies) {
                if ($this.companies[key].id == id) {
                    $this.editCompany = $this.companies[key];
                    break;
                }
            }

            return $this;
        },
        insertCompany: function ()
        {
            var $this = this;

            $this.editCompany = {};
        },
        removeCompany: function (id)
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
        },
        checkRouteUpdate: function ()
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
    }
}

</script>
<style lang="scss" src="./scss/company.scss"></style>
<template src="./templates/company.html"></template>

<script>

import Vue from 'vue';

const data = function ()
{
    var $this = this;

    return {
        get inserted() {
            return $this.$route.name == 'companyInsert';
        },
        company: {},
        formstate: {},
        phoneschange: 0,
        menu: {
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
                click ()
                {
                    $this.saveSubmit($this.formstate);
                }
            }
        },
        PhoneControl: {
            focus: false,
            newPhone: null,
            clear ()
            {
                this.newPhone = null;
                this.focus = false;
            },
            toggleFocus (item, state)
            {
                if (item instanceof Object) {
                    Vue.set(item, 'focus', state);
                }

                return this;
            },
            toggleType (item)
            {
                item.type = item.type == 0 ? 1 : 0;
            },
            insert (event)
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
            remove (key)
            {
                if (key in $this.company.phones) {
                    $this.company.phones.splice(key, 1);
                    $this.phoneschange += 1;
                }
            }
        },
    };
};

const methods = {
    saveSubmit (formstate)
    {
        var $this = this;

        // 通過驗證並被修改過才能送出
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
                    $this.$bus.$emit(eventName, result.data);
                }
            });
        }
    }
}

export default {
    name: 'company',
    mounted ()
    {
        var $this = this;

        $this.company = JSON.parse(JSON.stringify($this.bind));

        $this.company.phones = $this.company.phones || [];
    },
    data,
    methods,
    props: {
        bind: {
            type: Object,
            required: true
        }
    },
    watch: {
        phoneschange ()
        {
            this.formstate.phones.$dirty = true;
            this.formstate.phones.$touched = true;
        }
    }
}
</script>
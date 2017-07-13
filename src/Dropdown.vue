<template>
<div class="dropdown">
    <div class="dropdown_trigger" ref="trigger">
        <slot name="trigger" :trigger="trigger">
            <div @click="trigger">
                <i class="fa fa-th-list"></i>
            </div>
        </slot>
    </div>
    <div class="dropdown_list" v-show="showing" ref="list">
        <slot name="list" :showing="showing"></slot>
    </div>
</div>
</template>

<script>
export default {
    name: 'dropdown',
    props: {
        list: {
            type: Object
        },
        global: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showing_uid: false
        };
    },
    computed: {
        refer_uid: {
            get() {
                return this.global ? window.dropdown_showing_uid : this.showing_uid;
            },
            set(val) {
                if (this.global) {
                    window.dropdown_showing_uid = val;
                } else {
                    this.showing_uid = val;
                }
            }
        },
        showing: {
            get() {
                return this._uid == this.refer_uid;
            },
            set(val) {
                this.refer_uid = Boolean(val) ? this._uid : 0;
            }
        }
    },
    methods: {
        trigger() {
            console.log(this);
            this.showing = !this.showing;

            if (this.showing) {
                var list = $(this.$refs.list);
                var trigger = $(this.$refs.trigger);



                list.css({
                    left: trigger.offset().left + ( trigger.width() / 2 ) - ( list.width() / 2 ),
                    top: trigger.offset().top + trigger.height() + 5
                });
            }
        }
    }
}
</script>

<style lang="sass">
@import "~styles/mixin"

.dropdown
    position: relative

    .dropdown_list
        $arrow_size: 10px;
        position: fixed
        top: -9999px
        left: -9999px
        z-index: 999
        background-color: #fff
        padding: 10px

        &::before
            @include transform(rotate(45deg))
            content: ''
            position: absolute
            z-index: 98
            width: $arrow_size
            height: $arrow_size
            bottom: calc(100% - #{$arrow_size / 2})
            left: calc(50% - #{$arrow_size / 2})
            background-color: inherit
</style>
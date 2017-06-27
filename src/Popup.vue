<template>
<div class="popup" v-show="show">
    <div class="popup_inner">
        <slot name="content"></slot>
        <!-- <slot name="close">
            <div class="popup_close">
                <i class="fa fa-close" @click="show = false"></i>
            </div>
        </slot> -->
    </div>
</div>
</template>

<script>
export default {
    name: 'popup',
    props: {
        show: {
            type: Boolean,
            default: () => {
                return false
            }
        }
    }
}
</script>

<style lang="sass">
.popup
    position: fixed
    width: 100%
    height: 100%
    text-align: center
    z-index: 9999
    top: 0
    left: 0

    .popup_inner
        display: inline-block
        vertical-align: middle
        text-align: left
        z-index: 1
        position: relative

        .popup_close
            position: absolute
            right: 10px
            top: 10px
            cursor: pointer

    &:before
        content: ''
        display: inline-block
        vertical-align: middle
        height: 100%
        width: 1px

    &:after
        content: ''
        position: fixed
        width: 100vw
        height: 100vh
        background-color: rgba(#000, 0.3)
        top: 0
        left: 0
</style>
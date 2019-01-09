<template>
<div class="searchbar">
    <label :for="id" class="searchbar_label">
        <div class="search_icon"><i class="fa fa-search" aria-hidden="true"></i></div>
        <input type="text" class="search_input" placeholder="搜尋..." v-model.trim="internalValue" @change="internalValueChange" :id="id">
        <span class="search_clean" @click="internalValueClean" v-show="internalValue"><i class="fa fa-remove"></i></span>
    </label>
    <slot name="behind"></slot>
</div>
</template>

<script>
export default {
    name: 'searchbar',
    props: ['value', 'id'],
    data () {
        return {
            internalValue: ''
        }
    },
    created: function () {
        this.internalValue = this.value;
    },
    methods: {
        internalValueChange () {
            this.$emit('input', this.internalValue);
            this.$emit('change', this.internalValue);
        },
        internalValueClean () {
            this.internalValue = '';
            this.$emit('input', this.internalValue);

            setTimeout(() => {
                this.$emit('clean');
            });
        },
        getInput () {
            return this.$el.querySelector('input.search_input')
        }
    }
}
</script>

<style lang="sass" scoped>
@import "~styles/mixin"

.searchbar
    $regionHeight: 30px;
    $fontColor: currentColor;
    $fontSize: 16px;
    $fontHoverSize: 14px;
    position: relative

    .searchbar_label
        position: relative
        height: $regionHeight
        @include inline-flex()
        @include flex-just(space-between)
        @include align-items(center)

    .search_icon
        @include flexbox()
        @include flex-just(center)
        @include align-items(center)
        min-width: $regionHeight
        width: $regionHeight
        height: $regionHeight
        cursor: pointer

    .search_clean
        cursor: pointer
        display: inline-block
        vertical-align: middle
        padding: 5px
        opacity: 0.6

        &:hover
            opacity: 1

        &:active
            margin-top: 1px

    .search_input
        height: 100%
        padding: 5px
        background-color: transparent
        border: none
        outline: none
        color: $fontColor
        @include flex(1)

        @include placeholder
            opacity: 0.5
            color: $fontColor
            font-size: $fontHoverSize
</style>
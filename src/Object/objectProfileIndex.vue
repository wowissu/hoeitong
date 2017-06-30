<template>
<div id="profile">
    <div class="profile_form_wrapper">
        <vue-form id="objectProfile" :state="formstate" class="vf-form profile_form" >
            <!-- @submit.prevent="saveObject" -->

            <validate tag="div" class="vf-group">
                <label class="vf-label" for="title">名稱：</label>
                <div class="vf-field">
                    <input type="text" class="vf-control" v-model.trim="object.title" required name="title" placeholder="*必填">
                    <field-messages name="title" show="$dirty && $touched" class="vf-after-field">未儲存</field-messages>
                </div>
            </validate>

            <validate tag="div" class="vf-group">
                <label class="vf-label" for="title">型號：</label>
                <div class="vf-field">
                    <input type="text" class="vf-control" v-model.trim="object.model" name="model">
                    <field-messages name="model" show="$dirty && $touched" class="vf-after-field">未儲存</field-messages>
                </div>
            </validate>

            <validate tag="div" class="vf-group">
                <label class="vf-label" for="title">規格：</label>
                <div class="vf-field">
                    <input type="text" class="vf-control" v-model.trim="object.spec" name="spec">
                    <field-messages name="spec" show="$dirty && $touched" class="vf-after-field">未儲存</field-messages>
                </div>
            </validate>

            <validate tag="div" class="vf-group">
                <label class="vf-label" for="summary">備註：</label>
                <div class="vf-field">
                    <textarea type="text" class="vf-control" v-model="object.summary" name="summary" style="height: 150px"></textarea>
                    <field-messages name="summary" show="$dirty && $touched" class="vf-after-field">未儲存</field-messages>
                </div>
            </validate>

            <div class="vf-group" v-if="object.tabs">
                <label class="vf-label">標籤：</label>
                <div class="vf-field">
                    <tabpanel :tabs="object.tabs" @change="tabchanged = true"></tabpanel>
                    <div v-show="tabchanged" class="vf-after-field">未儲存</div>
                </div>
            </div>

            <!-- <div class="vf-footer">
                <button class="vf-submit" type="submit">儲存</button>
            </div> -->
        </vue-form>
    </div>
</div>
</template>

<script>
module.exports = {
    components: {
        tabpanel: require('../Tab/TabPanel.vue')
    },
    props: ['object'],
    data() {
        return {
            formstate: {},
            tabchanged: false
        };
    },
    mounted() {
        this.$bus.$on('object.save', (object) => {
            this.tabchanged = false;
            this.formstate._reset();
        });
    }
}
</script>

<style lang="sass" scoped>
@import "~styles/variable"
@import "~styles/mixin"

$mainColor: darken(#2e88d0, 15%)

#profile
    &.phones_item__focus
        border-top: 1px solid #ddd
        border-bottom: 1px solid #ddd

    &.phones_item__focus,
    &:hover
        .item_type
            color: darken($mainColor, 15%)

        .item_control
            visibility: visible

.profile_form_wrapper
    display: block
    width: 50vw
    max-width: 500px
    min-width: 300px
    padding: 50px 10px

.profile_form
.phones_item
    @include flexbox()
    @include flex-wrap(nowrap)
    @include flex-just()
    @include align-items(center)
    padding: 5px 8px
    margin-bottom: 5px
    height: 30px
    border-top: 1px solid transparent
    border-bottom: 1px solid transparent

.item_type
    color: $mainColor
    width: 20px
    cursor: pointer
    font-size: 16px
    text-align: center

.item_contactor
    @include flex(1)

    input
        text-align: right

.item_phone
    @include flex(1)

    &.vf-field-dirty.vf-field-invalid-required
        input.vf-invalid-required
            @include placeholder
            color: $vf-invalid-color

.item_control
    $color: #9e9e9e
    width: 34px
    padding: 0 8px
    border-left: 1px solid #ddd
    cursor: pointer
    color: $color
    visibility: hidden

    &:hover
        color: darken($color, 20%)

    .plus_button
        font-size: 14px
        border: none
        outline: none
        background-color: transparent
        color: $color
        padding: 0
        margin: 0
        cursor: pointer

        &:focus
            @include box-shadow(0px 0px 8px -4px $mainColor)
            color: $mainColor
            font-size: 16px

input
    border: none
    outline: none
    border-bottom: 1px solid transparent
    display: block
    width: 100%
    font-size: 14px
    padding: 0 8px
    background-color: transparent
</style>
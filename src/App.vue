<!-- <style lang="scss" src="./scss/App.scss"></style> -->

<template>
    <div class="pagebox_wraper">
        <pagebox
            id="site"
            class="default"
            :menu="sitemenu"
            :config="{
                layoutHeader: false
            }"
        >
            <template slot="section">
                <router-view></router-view>
            </template>
        </pagebox>
    </div>
</template>

<script>
import Vue from 'vue';
import Router from './routes.js';
import Pagebox from './Pagebox.vue';
import Popup from './Popup.vue';

// global components
Vue.component('pagebox', Pagebox);
Vue.component('popup', Popup);

// App
export default {
    name: 'app',
    router: Router,
    data () {
        return {
            sitemenu: {
                company: {
                    title: '廠商管理',
                    url: '/company',
                    icon: '<i class="fa fa-briefcase"></i>'
                },
                object: {
                    title: '物件管理',
                    url: '/object',
                    icon: '<i class="fa fa-cubes"></i>'
                },
                tools: {
                    title: '工具管理',
                    url: '/tools',
                    icon: '<i class="fa fa-wrench"></i>'
                }
            }
        }
    }
}

</script>

<style lang="scss">
@charset "utf-8";

@import "~styles/mixin";
@import "~styles/Form";
@import "~styles/Pagebox";

html
{
    font-size: 14px;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
}

body
{
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    overflow: hidden;
    color: #333;
}

*, *:after, *:before
{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

.colorinherit
{
    color: inherit;
}

#site
{
    $mainColor: #82b440;

    @include pageboxtheme((
        itemActiveFontColor: $mainColor,
        itemHoverFontColor: lighten($mainColor, 10%)
    ));
}
</style>
<template>
    <div id="manual" ref="drophere">
        <quill-editor ref="quill" v-model="object.content" drop-region="#manual"></quill-editor>
    </div>
</template>

<script>
// import VueFroala from 'vue-froala-wysiwyg';
// import $ from 'jquery'
import {QuillEditor} from '@/components/Quill'

export default {
    name: 'objectProfileManual',
    components: {
        QuillEditor
    },
    props: ['object'],
    data () {
        return {};
    },
    mounted () {
        this.$bus.$on('object.save', (object) => {

        });
    }
}
</script>

<style lang="scss">
#manual {
    margin: 30px auto;
    padding: 0px 50px;
    max-width: 900px;
    min-height: 100vh;

    .fr-wrapper {
        padding-bottom: 80px;

        ~ * a[href*="www.froala.com"] {
            display: none !important;
        }
    }
}
</style>
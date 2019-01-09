<template>
    <div id="manual">
        <!-- <froala :tag="'textarea'"
            :config="froalaConfig"
            v-model="object.content"
            ref="froala"
        ></froala> -->
        <quill-editor ref="quill" v-model="object.content"></quill-editor>
    </div>
</template>

<script>
// import VueFroala from 'vue-froala-wysiwyg';
// import $ from 'jquery'
import QuillEditor from '@/components/QuillEditor.vue'

export default {
    name: 'objectProfileManual',
    components: {
        QuillEditor
    },
    props: ['object'],
    data () {
        return {
            imagesRemoved: [],
            imagesInserted: []
        };
    },
    mounted () {
        this.$bus.$on('object.save', (object) => {

        });

        // this.$bus.$on('object.save', (object) => {
        //     // deleted images
        //     if (this.imagesRemoved.length) {
        //         $.delete('api/manual/image/delete', {
        //             removed: this.imagesRemoved
        //         }).done(() => {
        //             this.imagesRemoved = [];
        //         });
        //     }
        // });

        // this.$bus.$on('object.before.save', (object) => {
        //     // upload images
        //     for(var blobUrl in this.imagesInserted) {
        //         var postdata = this.imagesInserted[blobUrl];
        //         var fd = new Formdata ();
        //         fd.append('image', postdata.file);

        //         $.ajax({
        //             url: 'api/manual/image/insert',
        //             method: 'POST',
        //             data: fd,
        //             contentType: false,
        //             processData: false
        //         }).done((res) => {
        //             postdata.img.attr('src', res.link);
        //             delete this.imagesInserted[blobUrl];
        //         });
        //     }
        // });
    }
}
</script>

<style lang="scss">
#manual {
    margin: 30px auto;
    padding: 0px 50px;
    max-width: 900px;

    .fr-wrapper {
        padding-bottom: 80px;

        ~ * a[href*="www.froala.com"] {
            display: none !important;
        }
    }
}
</style>
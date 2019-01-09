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
import $ from 'jquery'
import QuillEditor from '@/components/QuillEditor.vue'

export default {
    name: 'objectProfileManual',
    components: {
        QuillEditor
    },
    props: ['object'],
    data () {
        var $this = this;

        return {
            imagesRemoved: [],
            imagesInserted: [],
            froalaConfig: {
                placeholderText: '開始編輯文件',
                charCounterCount: false,
                heightMin: 300,
                toolbarInline: true,
                toolbarButtons: ['undo', 'redo', '|', 'color', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'insertImage', 'insertTable', '|', 'quote', 'insertHR', 'clearFormatting', 'selectAll'],
                // image upload
                imageAllowDragAndDrop: true,
                imageUploadParam: 'image',
                imageUploadURL: 'api/manual/image/upload',
                imageUploadMethod: 'POST',
                imageMaxSize: 1 * 1024 * 1024,
                imageAllowedTypes: ['jpeg', 'jpg', 'png'],
                requestHeaders: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                events: {
                    // 圖片刪除時伺服器也刪除
                    'froalaEditor.image.removed': (e, editor, $img) => {
                        var src = $img.attr('src');

                        if (src.includes('blob:')) {} else {
                            $this.imagesRemoved.push(src);
                        }
                    },
                    'froalaEditor.image.inserted': (e, editor, $img) => {
                        var src = $img.attr('src');
                        $this.imagesInserted.push(src);
                    }
                }
            }
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
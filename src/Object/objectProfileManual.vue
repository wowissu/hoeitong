<template>
    <div id="manual">
        <froala :tag="'textarea'"
            :config="froalaConfig"
            v-model="object.content"
            ref="froala"
        ></froala>
    </div>
</template>

<script>
import VueFroala from 'vue-froala-wysiwyg';

export default {
    name: 'objectProfileManual',
    props: ['object'],
    data() {
        var $this = this;

        return {
            editing: false,
            froalaConfig: {
                placeholderText: '開始編輯文件',
                charCounterCount: false,
                heightMin: 300,
                toolbarInline: true,
                toolbarButtons:  ['undo', 'redo', '|', 'color', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'insertImage', 'insertTable', '|', 'quote', 'insertHR', 'clearFormatting', 'selectAll'],
                // image upload
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

                        if ( !src.includes('blob:') ) {
                            $.delete('api/manual/image/delete', {
                                src: $img.attr('src')
                            }).done((res) => {});
                        }
                    },

                }
            }
        };
    }
}
</script>

<style lang="sass">
    #manual
        margin: 30px auto
        padding: 0px 50px
        max-width: 900px

        .fr-wrapper
            padding-bottom: 80px

            ~ * a[href*="www.froala.com"]
                display: none !important
</style>
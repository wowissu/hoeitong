<template>
  <div class="quill-editor">
    <!-- <div ref="toolbar">
      <button class="ql-bold">Bold</button>
      <button class="ql-italic">Italic</button>
    </div> -->
    <div ref="editor"></div>
  </div>
</template>

<script>
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';

Quill.register('modules/imageDrop', function (quill, options) {
  var el = quill.root;

  el.addEventListener('drop', function (dropEvent) {
    var files = dropEvent.dataTransfer.files

    if (files.length === 1) {
      for (var file of files) {
        if (file.type.includes('image')) {
          var range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', URL.createObjectURL(file), Quill.sources.USER);
        }
      }
    }

    event.stopPropagation();
    event.preventDefault();
  })
});

// NOTE 加上這段才不會吐 <img src="//:0">
var Image = Quill.import('formats/image');
Image.sanitize = function(url) {
  return url;
};

const toolbarOptions = [
  ['bold', 'italic', {'color': []}, {'background': []}, 'underline', 'strike', {'font': []}, {'size': []}],
  // 'blockquote', 'code-block',
  [{'list': 'ordered'}, {'list': 'bullet'}, {'script': 'sub'}, {'script': 'super'}, {'indent': '-1'}, {'indent': '+1'}, {'header': [1, 2, 3, 4, 5, 6, false]}],
  // [{'header': 1}, {'header': 2}],
  // [{'direction': 'rtl'}],
  [{'align': []}, 'clean']
];

export default {
  name: 'QuillEditor',
  props: ['value'],
  data () {
    return {
      content: this.value
    };
  },
  watch: {
    value (newValue, oldValue) {
      if (newValue && oldValue === undefined) {
        this.$quill.root.innerHTML = newValue;
      }
    }
  },
  mounted () {
    // init value
    this.$refs.editor.innerHTML = this.value

    this.$quill = new Quill(this.$refs.editor, {
      theme: 'snow',
      placeholder: '開始編輯手冊',
      modules: {
        toolbar: toolbarOptions,
        imageDrop: true
      }
    });

    // var $quill = this.$quill;
    this.$quill.on('text-change', (delta, oldDelta, source) => {
      if (source === 'api') {
        console.log('An API call triggered this change.', delta);
      } else if (source === 'user') {
        this.emitTextChange();
      }
    });

    // focus editor area
    this.$quill.focus();
  },
  methods: {
    emitTextChange () {
      this.$emit('input', this.$quill.root.innerHTML);
    }
  }
}
</script>

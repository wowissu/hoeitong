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
import Quill from 'quill'
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{'header': 1}, {'header': 2}],
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'script': 'sub'}, {'script': 'super'}],
  [{'indent': '-1'}, {'indent': '+1'}],
  [{'direction': 'rtl'}],
  [{'size': ['small', false, 'large', 'huge']}],
  [{'header': [1, 2, 3, 4, 5, 6, false]}],
  [{'color': []}, {'background': []}],
  [{'font': []}],
  [{'align': []}],
  ['clean']
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
    this.$quill = new Quill(this.$refs.editor, {
      theme: 'snow',
      placeholder: '開始編輯手冊',
      modules: {
        toolbar: toolbarOptions
      }
    });

    // var $quill = this.$quill;
    this.$quill.on('text-change', (delta, oldDelta, source) => {
      if (source === 'api') {
        console.log('An API call triggered this change.', delta);
      } else if (source === 'user') {
        this.handleInput();
      }
    });

    // focus editor area
    this.$quill.focus();
  },
  methods: {
    handleInput () {
      this.$emit('input', this.$quill.root.innerHTML);
    }
  }
}
</script>

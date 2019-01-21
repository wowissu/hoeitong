import Quill from 'quill';

export default class ImageDropModule {
  constructor(quill, options) {
    var el = options.region || quill.root;
    this.quill = quill;
    this.options = options;
    this.handleDragover = this.handleDragover.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    // this.handlePaste = this.handlePaste.bind(this);

    el.addEventListener('dragover', this.handleDragover);
    el.addEventListener('drop', this.handleDrop, false);
    // el.addEventListener('paste', this.handlePaste, false);
  }

  handleDragover(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.options.onDragover instanceof Function) {
      this.options.onDragover.call(this.quill, event);
    }

    return false;
  }

  handleDrop(evt) {
    if (evt.dataTransfer && evt.dataTransfer.files && evt.dataTransfer.files.length) {
      evt.stopPropagation();
      evt.preventDefault();
      let lastIndex = this.quill.getLength();

      let files = Array.from(evt.dataTransfer.files).map((blob) => {
        if (this.isImage(blob)) {
          let [delta, blot, index] = this.insert(blob);
          lastIndex = index;
          return {blob, delta, blot, index};
        }

        return false;
      }).filter(file => {
        return file;
      });

      this.quill.setSelection(lastIndex + 1, Quill.sources.API);

      if (this.options.onDrop instanceof Function) {
        this.options.onDrop.call(this.quill, files);
      }
    }

    return false;
  }

  // handlePaste(evt) {
  //   console.log('paste');
  //   if (evt.clipboardData && evt.clipboardData.files && evt.clipboardData.files.length) {
  //     evt.stopPropagation();
  //     evt.preventDefault();

  //     let files = Array.from(evt.clipboardData.files)
  //       .map((blob) => {
  //         if (blob && this.isImage(blob)) {
  //           let [delta, blot, index] = this.insert(blob);
  //           return {blob, delta, blot, index};
  //         }
  //         return false;
  //       }).filter(item => {
  //         return item;
  //       });

  //     if (this.options.onPaste instanceof Function) {
  //       this.options.onPaste.call(this.quill, files);
  //     }
  //   }
  // }

  isImage (file) {
    return file.type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp|vnd\.microsoft\.icon)/i);
  }

  insert (file) {
    let index = (this.quill.getSelection() || {}).index || this.quill.getLength();
    let delta = this.quill.insertEmbed(index, 'dropimage', URL.createObjectURL(file), Quill.sources.USER);
    let [blot] = this.quill.getLeaf(index + 1);
    return [delta, blot, index];
  }
}
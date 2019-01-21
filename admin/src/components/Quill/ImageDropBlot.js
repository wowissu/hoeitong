import './ImageDropBlot.scss';
import Quill from 'quill';
let Parchment = Quill.import('parchment');

const ATTRIBUTES = ['alt', 'height', 'width'];

class ImageDropBlot extends Parchment.Embed {
  constructor (node, value) {
    super(node);
    this.$node = node;
    this.$value = value;
    this.$message = null;
    this.$uploading = false;
  }

  set $message(msg) {
    const coverProgress = this.$node.querySelector('.cover-message');
    coverProgress.innerHTML = msg;
  }

  set $uploading(val) {
    if (val) {
      this.$node.classList.add('uploading');
    } else {
      this.$node.classList.remove('uploading');
    }
  }

  message(value) {
    this.$message = value;
    return this;
  }

  uploading() {
    this.$uploading = true;
    return this;
  }

  done() {
    this.$uploading = false;
    this.replaceWith('image', this.$value);
    return this;
  }

  setValue(src) {
    let domNode = this.$node;
    let img = domNode.querySelector('img');
    img.setAttribute('src', this.statics.sanitize(src));
    this.$value = src;
    return this;
  }

  static create(value) {
    const node = super.create(value);
    const img = document.createElement('img');
          img.setAttribute('src', this.sanitize(value));
    const cover = document.createElement('div');
    const coverProgress = document.createElement('div');
    // node
    node.classList.add('image-drop-block');
    node.appendChild(img);
    node.appendChild(cover);
    // cover
    cover.classList.add('uploading-cover');
    coverProgress.classList.add('cover-message');
    cover.appendChild(coverProgress);

    return node;
  }

  static formats(domNode) {
    return ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static match(url) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }

  static register() {
    if (/Firefox/i.test(navigator.userAgent)) {
      setTimeout(() => {
        // Disable image resizing in Firefox
        document.execCommand('enableObjectResizing', false, false);
      }, 1);
    }
  }

  static sanitize(url) {
    return url;
  }

  static value(domNode) {
    let img = domNode.querySelector('img');
    return img.getAttribute('src');
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
ImageDropBlot.blotName = 'dropimage';
ImageDropBlot.tagName = 'DIV';
Parchment.register(ImageDropBlot);

export default ImageDropBlot;
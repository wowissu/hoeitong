import Quill from 'quill';
let BlockEmbed = Quill.import('blots/block/embed');

class ImageDropBlot extends BlockEmbed {
  static create(value) {
    let node = super.create();
    console.log(node)
    return node;
  }
}
ImageDropBlot.blotName = 'dropimage';
ImageDropBlot.tagName = 'div';

export default ImageDropBlot
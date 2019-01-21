import Quill from 'quill';
let Image = Quill.import('formats/image');

class ImageSanitize extends Image {
  static sanitize = function (url) {
    return url;
  };
}

export default ImageSanitize;
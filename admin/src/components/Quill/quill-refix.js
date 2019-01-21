import Quill from 'quill';
// import Parchment from 'parchment';
// import ImageSanitize from './ImageSanitize';
import ImageDropBlot from './ImageDropBlot';
import ImageDropModule from './ImageDropModule';

// Quill.register(ImageSanitize, true);
Quill.register(ImageDropBlot, true);

// Modules
Quill.register('modules/imageDrop', ImageDropModule);

// AllowChildren
// Parchment.Container.allowedChildren = [ImageDropBlot];

export default Quill;
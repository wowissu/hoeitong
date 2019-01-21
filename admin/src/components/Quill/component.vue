<template>
  <div class="quill-editor">
    <div ref="editor"></div>
  </div>
</template>

<script>
import $ from 'jquery';
import Quill from './quill-refix.js';
import Delta from 'quill-delta';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';

// const toolbarOptions = [
//   ['bold', 'italic', {'color': []}, {'background': []}, 'underline', 'strike', {'font': []}, {'size': []}],
//   // 'blockquote', 'code-block',
//   [{'list': 'ordered'}, {'list': 'bullet'}, {'script': 'sub'}, {'script': 'super'}, {'indent': '-1'}, {'indent': '+1'}, {'header': [1, 2, 3, 4, 5, 6, false]}],
//   // [{'header': 1}, {'header': 2}],
//   // [{'direction': 'rtl'}],
//   [{'align': []}, 'clean']
// ];

export default {
  name: 'QuillEditor',
  props: ['value', 'dropRegion'],
  data () {
    return {
      dropRegionElement: null,
      content: this.value,
      uploadingList: []
    };
  },
  watch: {
    value (newValue, oldValue) {
      if (newValue && oldValue === undefined) {
        // console.log(newValue);
        this.quill.clipboard.dangerouslyPasteHTML(0, newValue);
        // this.quill.root.innerHTML = newValue;
      }
    }
  },
  mounted () {
    // init value
    if (typeof this.content === 'string' || this.content instanceof Element) {
      this.$refs.editor.innerHTML = this.content;
    }

    this.quill = new Quill(this.$refs.editor, {
      theme: 'bubble',
      placeholder: '開始編輯手冊',
      modules: {
        toolbar: undefined,
        imageDrop: {
          region: document.querySelector(this.dropRegion),
          onDrop: this.onDropImageHandler
        }
      }
    });

    this.quill.on('text-change', (delta, oldDelta, source) => {
      if (source === 'api') {
        console.log('An API call triggered this change.', delta);
      } else if (source === 'user') {
        this.emitTextChange();
      }
    });

    // focus editor area
    this.quill.focus();
  },
  methods: {
    emitTextChange () {
      this.$emit('input', this.quill.root.innerHTML);
    },
    // DropHandler -> uploadImage
    onDropImageHandler (dropList) {
      var comp = this;

      dropList.map((item, i) => {
        let blob = item.blob
        let formData = new FormData();
        formData.append(`image`, blob);
        return Object.assign(item, {
          formData: formData
        });
      }).forEach((dropItem) => {
        console.log(dropItem);
        var imageDropBlot = dropItem.blot;
        var dropItemIndex = comp.uploadingList.push(dropItem) - 1;

        imageDropBlot.uploading()

        comp.uploadImage('api/manual/image/upload', dropItem.formData)
          .progress((percentage) => {
            imageDropBlot.message(`${percentage}%`);
            comp.$set(comp.uploadingList, dropItemIndex, dropItem);
          })
          .done((res) => {
            if (res.success) {
              setTimeout(() => {
                comp.uploadImageSuccess(dropItem, res);
              }, 500);
            }
          })
          .catch((res) => {
            if (res.status === 413) {
              let reciprocal = function () {
                imageDropBlot.message(this.msg);
                this.t--;
                return reciprocal;
              }.bind({
                t: 3,
                get msg () { return `檔案過大無法上傳\n${this.t} 秒後取消`; }
              });
              let reciprocalInterval = setInterval(reciprocal(), 1000);

              setTimeout(() => {
                clearInterval(reciprocalInterval);
                comp.uploadImageFail(dropItem, res);
              }, 3000);
            }
          })
          .always((res) => {
            comp.$set(comp.uploadingList, dropItemIndex, dropItem);
          });
      });
    },
    //
    uploadImageFail (dropItem, res) {
      let blot = dropItem.blot;
      let offset = blot.offset(this.quill.root);
      let delta = new Delta().retain(offset).delete(1);
      let range = this.quill.getSelection(true);
      this.quill.updateContents(delta, Quill.sources.USER);
      this.quill.setSelection(range, Quill.sources.USER);
    },
    //
    uploadImageSuccess (dropItem, res) {
      let img = document.createElement('img')
      img.onload = () => {
        dropItem.blot.setValue(res.uri).done();
      };
      img.src = res.uri;
    },
    //
    uploadImage (url, data) {
      var deferred = $.Deferred();

      $.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: deferred.resolve,
        error: deferred.reject,
        complete: deferred.always,
        processData: false,
        contentType: false,
        xhr () {
          var xhr = $.ajaxSettings.xhr();
          if (xhr.upload) {
            xhr.upload.addEventListener('progress', function (progressEvent) {
              if (progressEvent.lengthComputable) {
                var percentage = parseInt(progressEvent.loaded / progressEvent.total * 100, 10);
                deferred.notify(percentage, progressEvent);
              }
            }, false);
          }
          return xhr;
        }
      });

      return deferred.promise();
    }
  }
}
</script>

<style lang="scss">
.quill-editor {
  position: relative;
}
.uploading-list {
  width: 100%;
  height: 100px;
  position: relative;

  li {
    display: inline-block;
    list-style: none;
    position: relative;

    &.onloading {
      .cover {
        display: block;
      }
    }
  }

  .upload-img {
    height: 100px;
    display: block;
  }

  .cover {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(grey, .3);
    text-align: center;
    line-height: 100px;
    color: #fff;
    font-size: 22px;
  }
}
</style>
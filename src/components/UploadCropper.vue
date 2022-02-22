<template>
  <div>
    <b-field label="사진 업로드">
      <b-upload
        v-if="selectedFile == null && !loaded"
        v-model="selectedFile"
        drag-drop
        accept="image/jpeg, image/png, image/gif"
        @input="setImage"
      >
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <b-icon icon="upload" size="is-large"> </b-icon>
            </p>
            <p>파일을 선택하거나 드래그하세요</p>
          </div>
        </section>
      </b-upload>
    </b-field>
    <div class="content">
      <section class="cropper-area">
        <div class="img-cropper">
          <vue-cropper
            v-show="selectedFile != null || loaded"
            ref="cropper"
            :aspect-ratio="aspectRatio"
            :src="imgSrc"
          />
        </div>
        <div v-if="imgSrc != null" id="cancel">
          <b-button class="is-danger" @click="deleteImage">
            사진 제거
          </b-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Inko from "inko";
let inko = new Inko();
import VueCropper from "vue-cropperjs";
export default {
  components: {
    VueCropper,
  },
  props: {
    initImg: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    aspectRatio: {
      type: Number,
      default: 2.4,
    },
  },
  data() {
    return {
      selectedFile: null,
      currentImage: null,
      imgSrc: "",
      loaded: false,
    };
  },
  mounted() {
    if (this.initImg != null) this.setImageFromUri(this.initImg);
    this.loaded = true;
  },
  methods: {
    deleteImage() {
      this.selectedFile = null;
      this.currentImage = null;
      this.loaded = false;
      this.$refs.cropper.destroy();
    },
    setImage() {
      const file = this.selectedFile;
      console.log(file);
      if (file.type.indexOf("image/") === -1) {
        alert("Please select an image file");
        return;
      }
      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          // rebuild cropperjs with the updated source
          console.log(this.$refs.cropper);
          this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    },
    setImageFromUri(uri) {
      this.loaded = true;
      this.imgSrc = uri;
      // rebuild cropperjs with the updated source
      console.log(this.$refs.cropper);
      this.$refs.cropper.replace(uri);
    },
    getImageFile() {
      if (this.selectedFile != null || this.initImg != null) {
        this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
          const file = new File(
            [blob],
            inko.ko2en(this.name) + `.${blob.type.split("/")[1]}`
          );
          this.$emit("onImageCropped", file);
        });
      } else return null;
    },
  },
};
</script>

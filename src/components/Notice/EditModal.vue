<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ title }}
        </p>

        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <section class="modal-card-body">
        <b-field label="제목">
          <b-input v-model="notice.title" />
        </b-field>
        <b-field label="내용">
          <b-input v-model="notice.content" />
        </b-field>
        * 이미지를 업로드 하지 않으면 기존의 이미지를 사용합니다.

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
                :aspect-ratio="2.4"
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
      </section>
      <footer class="modal-card-foot">
        <b-button label="닫기" @click="$emit('close')" />
        <b-button
          :label="type == 'add' ? '추가' : '변경'"
          type="is-primary"
          @click="submit"
        />
      </footer>
    </div>
  </form>
</template>

<script>
import Inko from "inko";
let inko = new Inko();
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import { addNotice, modifyNotice } from "../../networking/notice";
import notification from "@/js/notification";
export default {
  components: {
    VueCropper,
  },
  props: ["email", "password", "canCancel", "title", "type", "noticeToModify"],
  data() {
    return {
      selectedFile: null,
      imgSrc: "",
      notice: {
        id: null,
        title: null,
        content: null,
        date: null,
        img: null,
      },
      compkey: 0,
    };
  },
  computed: {
    dateString() {
      return this.notice.date != null
        ? this.notice.date.toLocaleDateString()
        : "";
    },
    url() {
      return this.currentImage == null
        ? require("@/assets/logo.png")
        : URL.createObjectURL(this.currentImage);
    },
  },
  created() {
    if (this.type == "modify") {
      this.noticeToModify.date = new Date(this.noticeToModify.date);
      console.log(this.noticeToModify);
      this.notice = this.noticeToModify;
    }
  },
  mounted() {
    if (this.type == "modify") this.setImageFromUri(this.noticeToModify.img);
  },
  methods: {
    deleteImage() {
      this.selectedFile = null;
      this.currentImage = null;
      this.$refs.cropper.destroy();
    },
    processResult(res) {
      console.log(res);
      if (res.status) {
        notification
          .show(this, "공지사항 처리에 성공했습니다.", "is-success", 2500)
          .then((_) => {
            this.$router.push("/notice");
          });
      } else {
        notification
          .show(
            this,
            `공지사항 처리에 실패했습니다: ${res.message}`,
            "is-danger",
            2500
          )
          .then((_) => {
            this.$router.push("/notice");
          });
      }
    },
    submit() {
      if (this.selectedFile != null || this.type == "modify")
        this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
          const file = new File(
            [blob],
            inko.ko2en(this.event.name) + `.${blob.type.split("/")[1]}`
          );
          this.sendRequest(file);
        });
      else this.sendRequest(null);
    },
    sendRequest(file) {
      if (file != null) formData.append("file", file);
      formData.append("title", this.notice.title);
      formData.append("content", this.notice.content);
      if (this.type == "add") {
        addNotice(formData).then((res) => {
          this.processResult(res);
        });
      } else {
        modifyNotice(this.notice.id, formData).then((res) => {
          this.processResult(res);
        });
      }
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
  },
};
</script>

<style scoped>
.hidden {
  display: none;
}
img {
  display: block;
  max-width: 100%;
}
</style>

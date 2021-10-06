<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">이벤트 추가</p>

        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <section class="modal-card-body">
        <b-field label="이벤트명">
          <b-input v-model="event.name" />
        </b-field>
        <b-field label="이벤트 상세 설명">
          <b-input v-model="event.desc" />
        </b-field>
        <b-field label="할인 금액">
          <b-input v-model="event.amount" type="number" />
        </b-field>
        <b-field label="시작 일시">
          <b-datepicker v-model="event.start" :mobile-native="false">
            <template v-slot:trigger>
              <b-button icon-left="calendar" type="is-primary" />
            </template>
          </b-datepicker>
          <b-input expanded readonly :value="startString" />
        </b-field>
        <b-field label="종료 일시">
          <b-datepicker v-model="event.end" :mobile-native="false">
            <template v-slot:trigger>
              <b-button icon-left="calendar" type="is-primary" />
            </template>
          </b-datepicker>
          <b-input expanded readonly :value="endString" />
        </b-field>
        <b-field label="총 수량">
          <b-input v-model="event.totalqty" />
        </b-field>
        <b-field label="사진 업로드">
          <b-upload
            v-if="selectedFile == null"
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
                v-if="selectedFile != null"
                ref="cropper"
                :aspect-ratio="2.4"
                :src="imgSrc"
              />
            </div>
            <div id="cancel" v-if="imgSrc != null">
              <b-button class="is-danger" @click="deleteImage"
                >사진 제거</b-button
              >
            </div>
          </section>
        </div>
      </section>
      <footer class="modal-card-foot">
        <b-button label="닫기" @click="$emit('close')" />
        <b-button label="추가" @click="submit" type="is-primary" />
      </footer>
    </div>
  </form>
</template>

<script>
import Inko from "inko";
let inko = new Inko();
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

export default {
  components: {
    VueCropper,
  },
  props: ["email", "password", "canCancel", "title", "type", "productToModify"],
  data() {
    return {
      selectedFile: null,
      imgSrc: "",
      event: {},
      compkey: 0,
    };
  },
  methods: {
    deleteImage() {
      this.currentImage = null;
      this.$refs.cropper.destroy();
    },
    processResult(res) {
      console.log(res);
      if (res.data.status) {
        this.$buefy.notification.open({
          message: "처리가 완료되었습니다.",
          type: "is-primary",
          duration: 1000,
        });
        this.$router.go();
      } else {
        this.$buefy.notification.open({
          message: "처리에 실패했습니다.",
          type: "is-danger",
          duration: 1000,
        });
      }
    },
    submit() {
      const formData = new FormData();
      this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
        const file = new File(
          [blob],
          inko.ko2en(this.event.name) + `.${blob.type.split("/")[1]}`
        );
        formData.append("file", file);
        formData.append("name", this.event.name);
        formData.append("desc", this.event.desc);
        formData.append("start", this.event.start);
        formData.append("end", this.event.end);
        formData.append("totalqty", this.event.totalqty);
        formData.append("amount", this.event.amount);

        this.$axios
          .post(`${process.env.VUE_APP_API_URL}/event`, formData)
          .then((res) => {
            this.processResult(res);
          });
      });
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
  },
  computed: {
    startString() {
      return this.event.start ? this.event.start.toLocaleDateString() : "";
    },
    endString() {
      return this.event.end ? this.event.end.toLocaleDateString() : "";
    },
    url() {
      return this.currentImage == null
        ? require("@/assets/logo.png")
        : URL.createObjectURL(this.currentImage);
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
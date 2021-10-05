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
            v-if="currentImage == null"
            v-model="currentImage"
            drag-drop
            accept="image/jpeg, image/png, image/gif"
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
        <div>
          <img
            ref="image"
            :src="url"
            class="hidden"
            id="image"
            alt="image-edit"
          />
          <div class="preview" />
          <div id="cancel" v-if="currentImage != null">
            <b-button class="is-danger" @click="deleteImage"
              >사진 제거</b-button
            >
          </div>
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
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import Inko from "inko";
let inko = new Inko();

export default {
  components: {},
  props: ["email", "password", "canCancel", "title", "type", "productToModify"],
  data() {
    return {
      currentImage: null,
      imagePreview: "",
      event: {},
      options: {
        // for tui-image-editor component's "options" prop
        cssMaxWidth: 700,
        cssMaxHeight: 500,
      },
      src: "",
      image: {},
      cropper: {},
      uploadedImage: File,
      compkey: 0,
    };
  },
  methods: {
    deleteImage() {
      this.currentImage = null;
      this.cropper.destroy();
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
      console.log(this.cropper);
      this.cropper.getCroppedCanvas().toBlob((blob) => {
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
  watch: {
    /**
     * Watch for currnetImage to read image file and open dialog for Image Cropper.
     * @param {File} img Image file.
     */
    currentImage: function (img) {
      if (img) {
        let image = document.getElementById("image");
        this.src = URL.createObjectURL(img);
        this.cropper = new Cropper(image, {
          preview: ".preview",
          viewMode: 2,
          aspectRatio: 2.4,
        });

        const fr = new FileReader();
        fr.readAsDataURL(img);
        fr.addEventListener("load", () => {
          // Save the file and preview.
          this.currentImage = img;
          this.imagePreview = fr.result;
          // Open the crop dialog.
        });
        this.compkey++;
      }
      // console.log('mounted', this.imageObjects);
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
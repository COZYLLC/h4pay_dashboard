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
          <b-datepicker v-model="startDate" :mobile-native="false">
            <template v-slot:trigger>
              <b-button icon-left="calendar" type="is-primary" />
            </template>
          </b-datepicker>
          <b-input expanded readonly :value="startString" />
        </b-field>
        <b-field label="종료 일시">
          <b-datepicker v-model="endDate" :mobile-native="false">
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
        <b-button label="추가" type="is-primary" @click="submit" />
      </footer>
    </div>
  </form>
</template>

<script>
import Inko from "inko";
let inko = new Inko();
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import { addEvent, modifyEvent } from "../../networking/event";

export default {
  components: {
    VueCropper,
  },
  props: ["email", "password", "canCancel", "title", "type", "eventToModify"],
  data() {
    return {
      selectedFile: null,
      imgSrc: "",
      event: {
        id: null,
        name: null,
        desc: null,
        amount: null,
        start: null,
        end: null,
        totalqty: null,
      },
      compkey: 0,
    };
  },
  computed: {
    startString() {
      return this.event.start != null
        ? this.event.start.toLocaleDateString()
        : "";
    },
    endString() {
      return this.event.end != null ? this.event.end.toLocaleDateString() : "";
    },
    url() {
      return this.currentImage == null
        ? require("@/assets/logo.png")
        : URL.createObjectURL(this.currentImage);
    },
  },
  created() {
    if (this.type == "modify") {
      this.eventToModify.start = new Date(this.eventToModify.start);
      this.eventToModify.end = new Date(this.eventToModify.end);
      console.log(this.eventToModify);
      this.event = this.eventToModify;
    }
  },
  methods: {
    deleteImage() {
      this.currentImage = null;
      this.$refs.cropper.destroy();
    },
    processResult(res) {
      console.log(res);
      if (res.status) {
        notification
          .show(this, "이벤트 처리에 성공했습니다.", "is-success", 2500)
          .then((_) => {
            this.$router.push("/");
          });
      } else {
        notification
          .show(
            this,
            `이벤트 처리에 실패했습니다: ${res.message}`,
            "is-success",
            2500
          )
          .then((_) => {
            this.$router.push("/");
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
        if (this.type == "add") {
          addEvent(formData).then((res) => {
            this.processResult(res);
          });
        } else {
          modifyEvent(this.event.id, formData).then((res) => {
            this.processResult(res);
          });
        }
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
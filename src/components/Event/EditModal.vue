<template>
  <form action="">
    <div class="modal-card" style="width: 600px">
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
        <upload-cropper
          ref="upload-cropper"
          :init-img="event.img"
          :name="event.name"
          @onImageCropped="sendRequest"
        ></upload-cropper>
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
import { addEvent, modifyEvent } from "../../networking/event";
import notification from "@/js/notification";
export default {
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
      loaded: false,
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
    processResult(res) {
      console.log(res);
      if (res.status) {
        notification
          .show(this, "이벤트 처리에 성공했습니다.", "is-success", 2500)
          .then((_) => {
            this.$router.go(0);
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
            this.$router.go(0);
          });
      }
    },
    submit() {
      this.$refs["upload-cropper"].getImageFile();
    },
    sendRequest(file) {
      const formData = new FormData();
      if (file != null) formData.append("file", file);
      formData.append("name", this.event.name);
      formData.append("desc", this.event.desc);
      formData.append("start", this.event.start.toISOString());
      formData.append("end", this.event.end.toISOString());
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

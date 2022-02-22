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
        <upload-cropper
          ref="upload-cropper"
          :init-img="notice.img"
          :name="notice.title"
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
import { addNotice, modifyNotice } from "../../networking/notice";
import notification from "@/js/notification";
export default {
  props: ["email", "password", "canCancel", "title", "type", "noticeToModify"],
  data() {
    return {
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
  },
  created() {
    if (this.type == "modify") {
      this.noticeToModify.date = new Date(this.noticeToModify.date);
      console.log(this.noticeToModify);
      this.notice = this.noticeToModify;
    }
  },
  methods: {
    submit() {
      this.$refs["upload-cropper"].getImageFile();
    },
    processResult(res) {
      console.log(res);
      if (res.status) {
        notification
          .show(this, "공지사항 처리에 성공했습니다.", "is-success", 2500)
          .then((_) => {
            this.$router.go(0);
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
            this.$router.go(0);
          });
      }
    },
    sendRequest(file) {
      const formData = new FormData();
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

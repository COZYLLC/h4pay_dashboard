<template>
  <div class="has-text-right">
    <b-button class="is-success" @click="showModal('add')"> 추가 </b-button>
    <b-modal
      v-if="modalActive"
      v-model="modalActive"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Example Modal"
      aria-modal
    >
      <template #default="props">
        <EditModal
          style="text-align: left"
          v-bind="formProps"
          :title="title"
          :type="type"
          :school-to-modify="checkedRows[0]"
          @close="props.close"
        />
      </template>
    </b-modal>
    <span v-if="checkedRows.length == 1">
      <b-button
        style="margin-left: 10px"
        class="is-primary"
        @click="showModal('modify')"
      >
        수정
      </b-button>
      <b-button
        class="is-danger"
        style="margin-left: 10px"
        @click="_deleteSchool"
      >
        삭제
      </b-button>
    </span>
  </div>
</template>

<script>
import { deleteSchool } from "../../networking/school";
import EditModal from "./EditModal.vue";
import notification from "@/js/notification";
export default {
  components: {
    EditModal,
  },
  props: ["checkedRows"],
  data() {
    return {
      modalActive: false,
      formProps: {
        email: "evan@you.com",
        password: "testing",
      },
      title: "",
      type: "",
      school: "",
    };
  },
  methods: {
    showModal(type) {
      console.log(type);
      this.title = type == "add" ? "학교 추가" : "학교 정보 변경";
      this.type = type;
      this.modalActive = true;
      if (type == "modify") {
        this.school = this.checkedRows[0];
      }
    },
    _deleteSchool() {
      deleteSchool(this.checkedRows[0])
        .then((res) => {
          if (res.status) {
            notification
              .show(this, "학교 제거가 완료되었습니다.", "is-success", 2500)
              .then((_) => {
                this.$router.go(0);
              });
          }
        })
        .catch((e) => {
          notification.show(
            this,
            `학교 제거에 실패했습니다: ${e.response.message}`,
            "is-danger",
            2500
          );
        });
    },
  },
};
</script>

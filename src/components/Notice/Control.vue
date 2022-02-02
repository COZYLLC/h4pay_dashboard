<template>
  <div class="has-text-right">
    <b-button
      v-if="checkedRows.length == 1"
      class="is-primary"
      @click="showModal('modify')"
    >
      편집
    </b-button>
    <b-button
      class="is-primary"
      style="margin-left: 5px"
      @click="showModal('add')"
    >
      추가
    </b-button>
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
          :notice-to-modify="notice"
          @close="props.close"
        />
      </template>
    </b-modal>
  </div>
</template>

<script>
import EditModal from "./EditModal.vue";
export default {
  components: {
    EditModal,
  },
  props: ["checkedRows"],
  data() {
    return {
      modalActive: false,
      formProps: {},
      title: "",
      type: "",
      notice: "",
    };
  },
  methods: {
    showModal(type) {
      this.title = type == "add" ? "공지사항 추가" : "공지사항 수정";
      this.type = type;
      if (type == "modify") {
        this.notice = this.checkedRows[0];
      }
      this.modalActive = true;
    },
  },
};
</script>

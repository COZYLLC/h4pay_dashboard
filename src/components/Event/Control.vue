<template>
  <div class="has-text-right">
    <b-button class="is-primary" @click="modalActive = true"> 추가 </b-button>
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
          :product-to-modify="product"
          @close="props.close"
        />
      </template>
    </b-modal>
  </div>
</template>

<script>
import { addEvent } from "../../networking/event";
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
      product: "",
    };
  },
  methods: {
    showModal(type) {
      console.log(type);
      this.title = type == "add" ? "제품 추가" : "제품 정보 변경";
      this.type = type;
      this.modalActive = true;
      if (type == "modify") {
        this.product = this.checkedRows[0];
      }
    },
  },
};
</script>
<template>
  <div class="has-text-right">
    <span v-if="checkedRows.length != 0">
      <b-button
        v-if="!checkedRows[0].soldout"
        @click="toggleSoldout(checkedRows[0])"
        class="is-danger"
        style="margin-right: 7px"
        >품절 처리</b-button
      >
      <b-button
        v-else-if="checkedRows[0].soldout"
        @click="toggleSoldout(checkedRows[0])"
        class="is-primary"
        style="margin-right: 7px"
        >재고보유 처리</b-button
      >

      <!--       <b-button class="is-danger" style="margin-right: 7px">제거</b-button>
 -->
      <b-button
        class="is-info"
        style="margin-right: 7px"
        @click="showModal('modify')"
        >제품 정보 변경</b-button
      >
    </span>

    <b-button class="is-primary" @click="showModal('add')">추가</b-button>
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
          @close="props.close"
          :title="title"
          :type="type"
          :productToModify="product"
        />
      </template>
    </b-modal>
  </div>
</template>

<script>
import EditModal from "@/components/Product/EditModal";
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

    toggleSoldout(product) {
      this.$axios
        .post(`${process.env.VUE_APP_API_URL}/product/modify`, {
          target: product.id,
          productName: product.productName,
          price: product.price,
          desc: product.desc != null ? product.desc : "",
          img: product.img,
          soldout: !product.soldout,
        })
        .then((res) => {
          console.log(res);
          if (res.data.status) {
            this.$router.go("");
            this.$buefy.notification.open({
              message: "제품 정보 변경이 정상처리 되었습니다.",
              type: "is-primary",
              duration: 1000,
            });
          } else {
            this.$buefy.notification.open({
              message: "제품 정보 변경에 실패했습니다.",
              type: "is-danger",
              duration: 1000,
            });
          }
        });
    },
  },
};
</script>
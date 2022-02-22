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
        <p v-if="type == 'modify'" style="color: red">
          상품 정보 변경은 가격, 이미지 변경만 하는 것을 권장합니다!
        </p>
        <b-field label="제품명">
          <b-input v-model="product.productName" />
        </b-field>
        <b-field label="바코드 정보">
          <b-input v-model="product.barcode" maxlength="13" />
        </b-field>
        <b-field label="가격">
          <b-input v-model="product.price" type="number" />
        </b-field>
        <b-field label="설명">
          <b-input v-model="product.desc" />
        </b-field>
        <upload-cropper
          ref="upload-cropper"
          :init-img="product.img"
          :name="product.productName"
          :aspect-ratio="1"
          @onImageCropped="sendRequest"
        ></upload-cropper>
        <b-field label="품절 여부">
          <b-switch
            v-model="product.soldout"
            :passive-type="product.soldout ? 'is-danger' : 'is-primary'"
            :type="product.soldout ? 'is-danger' : 'is-primary'"
          >
            {{ product.soldout ? "품절" : "재고 보유중" }}
          </b-switch>
        </b-field>
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
import { addProduct, modifyProduct } from "../../networking/product";
import notification from "@/js/notification";

export default {
  props: ["email", "password", "canCancel", "title", "type", "productToModify"],
  data() {
    return {
      product: {
        id: null,
        productName: null,
        barcode: null,
        price: null,
        desc: null,
        img: "",
        soldout: false,
      },
      compkey: 0,
    };
  },
  created() {
    if (this.type == "modify") {
      this.product = this.productToModify;
    }
  },
  methods: {
    processResult(res) {
      if (res.status) {
        notification
          .show(this, `제품 정보 처리에 성공했습니다.`, "is-success", 2500)
          .then((_) => {
            this.$router.go(0);
          });
      } else {
        this.$buefy.notification.open({
          message: "처리에 실패했습니다.",
          type: "is-danger",
          duration: 1000,
        });
      }
    },
    submit() {
      this.$refs["upload-cropper"].getImageFile();
    },
    sendRequest(file) {
      const formData = new FormData();
      formData.append("productName", this.product.productName);
      formData.append("barcode", this.product.barcode);
      formData.append("price", this.product.price);
      if (file != null) formData.append("file", file);
      if (this.type == "add") {
        formData.append("desc", this.product.desc);
        formData.append("soldout", this.product.soldout);
        addProduct(formData).then((res) => {
          this.processResult(res);
        });
      } else if (this.type == "modify") {
        formData.append("target", this.product.id);
        formData.append(
          "desc",
          this.product.desc != null ? this.product.desc : ""
        );
        formData.append("img", this.product.img);
        formData.append("soldout", !this.product.soldout);
        modifyProduct(formData).then((res) => {
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

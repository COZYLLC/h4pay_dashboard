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
        <b-field label="이미지 업로드">
          * 이미지를 업로드 하지 않으면 기존의 이미지를 사용합니다.
          <b-upload
            v-if="selectedFile == null && !loaded"
            v-model="selectedFile"
            drag-drop
            accept="image/*"
            @input="setImage()"
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
                v-show="selectedFile != null || loaded"
                ref="cropper"
                :aspect-ratio="1"
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
import Inko from "inko";
let inko = new Inko();
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import { addProduct, modifyProduct } from "../../networking/product";
import notification from "@/js/notification";

export default {
  components: {
    VueCropper,
  },
  props: ["email", "password", "canCancel", "title", "type", "productToModify"],
  data() {
    return {
      selectedFile: null,
      imgSrc: "",
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
  mounted() {
    if (this.type == "modify") this.setImageFromUri(this.productToModify.img);
  },
  methods: {
    deleteImage() {
      this.selectedFile = null;
      this.currentImage = null;
      this.$refs.cropper.destroy();
    },
    processResult(res) {
      if (res.status) {
        notification
          .show(this, `제품 정보 처리에 성공했습니다.`, "is-success", 2500)
          .then((_) => {
            this.$router.push("/product");
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
      if (this.selectedFile != null || this.type == "modify")
        this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
          const file = new File(
            [blob],
            inko.ko2en(this.product.productName) + `.${blob.type.split("/")[1]}`
          );
          this.sendRequest(file);
        });
      else this.sendRequest(null);
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
    setImageFromUri(uri) {
      this.loaded = true;
      this.imgSrc = uri;
      // rebuild cropperjs with the updated source
      console.log(this.$refs.cropper);
      this.$refs.cropper.replace(uri);
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

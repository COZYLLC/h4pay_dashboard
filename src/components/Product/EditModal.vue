<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>

        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <section class="modal-card-body">
        <p v-if="type == 'modify'" style="color: red">
          상품 정보 변경은 가격, 이미지 변경만 하는 것을 권장합니다!
        </p>
        <b-field label="제품명">
          <b-input v-model="product.productName" />
        </b-field>
        <b-field label="가격">
          <b-input v-model="product.price" type="number" />
        </b-field>
        <b-field label="설명">
          <b-input v-model="product.desc" />
        </b-field>
        <b-field label="이미지 업로드">
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

        <b-field label="품절 여부">
          <b-switch
            :passive-type="product.soldout ? 'is-danger' : 'is-primary'"
            v-model="product.soldout"
            :type="product.soldout ? 'is-danger' : 'is-primary'"
            >{{ product.soldout ? "품절" : "재고 보유중" }}</b-switch
          >
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <b-button label="닫기" @click="$emit('close')" />
        <b-button
          :label="type == 'add' ? '추가' : '변경'"
          @click="submit"
          type="is-primary"
        />
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
  created() {
    //this.image = this.$refs.image;
    if (this.type == "modify") {
      this.product = this.productToModify;
    }
  },
  data() {
    return {
      currentImage: null,
      imagePreview: "",
      product: {
        id: null,
        productName: null,
        price: null,
        desc: null,
        img: "",
        soldout: false,
      },
      compkey: 0,
      options: {
        // for tui-image-editor component's "options" prop
        cssMaxWidth: 700,
        cssMaxHeight: 500,
      },
      src: "",
      image: {},
      cropper: {},
    };
  },
  methods: {
    deleteImage() {
      this.currentImage = null;
      this.cropper.destroy();
    },
    processResult(res) {
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
      if (this.type == "add") {
        const formData = new FormData();
        this.cropper.getCroppedCanvas().toBlob((blob) => {
          const file = new File(
            [blob],
            inko.ko2en(this.product.productName) + `.${blob.type.split("/")[1]}`
          );
          formData.append("file", file);
          formData.append("productName", this.product.productName);
          formData.append("price", this.product.price);
          formData.append("desc", this.product.desc);
          formData.append("soldout", this.product.soldout);
          this.$axios
            .post(`${process.env.VUE_APP_API_URL}/product/add`, formData)
            .then((res) => {
              this.processResult(res);
            });
        });
      } else if (this.type == "modify") {
        this.product.target = this.product.id;
        this.$axios
          .post(`${process.env.VUE_APP_API_URL}/product/modify`, this.product)
          .then((res) => {
            this.processResult(res);
          });
      }
    },
  },
  computed: {
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
      console.log(img);
      if (img) {
        let image = document.getElementById("image");
        console.log(image);
        this.cropper = new Cropper(image, {
          preview: ".preview",
          viewMode: 2,
          aspectRatio: 1,
        });
        setTimeout(function () {
          const fr = new FileReader();
          fr.readAsDataURL(img);
          fr.addEventListener("load", () => {
            // Save the file and preview.
            this.currentImage = img;
            this.imagePreview = fr.result;
            // Open the crop dialog.
          });
        }, 1000);
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
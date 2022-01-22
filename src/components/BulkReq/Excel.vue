<template>
  <b-steps v-model="activeStep" :has-navigation="false">
    <b-step-item step="1" label="양식 다운로드" icon="file-download">
      <p>
        아래 엑셀 양식을 다운로드 받아 쿠폰을 받고자 하는 학생들의 정보를
        입력해주세요.
      </p>

      <a :href="templateURL">
        <b-button
          variant="primary"
          size="lg"
          style="margin-bottom: 20px"
          @click="activeStep++"
        >
          양식 다운로드
        </b-button>
      </a>
      <b-button
        variant="primary"
        size="lg"
        style="margin-bottom: 20px; margin-left: 20px"
        @click="activeStep++"
      >
        이미 양식이 있어요.
      </b-button>
    </b-step-item>
    <b-step-item step="2" label="정보 입력" icon="keyboard">
      <p>
        품목 정보를 입력해주시고, 파일 첨부란에 엑셀 파일을 첨부해주세요.
        <br />
        <span style="color: red">
          (전화번호는 엑셀과 주문자 정보 모두 '-' 없이 숫자만 입력해주세요.)
        </span>
      </p>
      <ProductSelector
        :selectable="true"
        :target-index="0"
        :products="products"
        :products-to-select="productsToSelect"
        :item="requestData.item"
        @itemUpdate="itemUpdate"
      />
      <b-field label="선물 메시지">
        <b-input
          v-model="requestData.reason"
          type="text"
          size="lg"
          style="margin-bottom: 20px"
        />
      </b-field>
      <b-button
        class="is-primary"
        size="lg"
        style="float: right"
        @click="goToUpload"
      >
        다음
      </b-button>
    </b-step-item>
    <b-step-item step="4" label="학생 명단 업로드" icon="upload">
      <b-field label="엑셀 파일 업로드">
        <b-upload v-model="requestData.file" drag-drop>
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon icon="upload" size="is-large"> </b-icon>
              </p>
              <p v-if="typeof requestData.file == 'function'">
                파일을 선택하거나 드래그하세요
              </p>
              <div v-else>
                {{ requestData.file.name }}
              </div>
            </div>
          </section>
        </b-upload>
      </b-field>
      <b-button class="is-primary" style="float: right" @click="submit">
        제출
      </b-button>
    </b-step-item>
  </b-steps>
</template>
<script>
import ProductSelector from "@/components/Product/Selector.vue";
import { getVisibleProducts } from "../../networking/product";
export default {
  components: {
    ProductSelector,
  },
  data() {
    return {
      activeStep: 0,
      requestData: {
        qty: null,
        reason: "",
        product: null,
        file: File,
        form: FormData,
        item: {},
      },
      productsToSelect: [],
      products: [],
      templateURL: process.env.VUE_APP_API_URL + "/../excelTemplate.xlsx",
    };
  },
  created() {
    this.fetchProduct();
  },
  methods: {
    fetchProduct() {
      getVisibleProducts()
        .then((res) => {
          if (res != undefined) {
            res.result.forEach((item) => {
              this.productsToSelect.push({
                value: item.id,
                text: item.productName,
              });
            });
            this.products = res.result;
          }
        })
        .catch((error) => {
          alert(
            "제품 목록을 불러오지 못했습니다. 개발자에게 문의해주세요. (1)"
          );
        });
    },
    goToUpload() {
      if (this.requestData.reason == "") {
        alert("정보를 모두 입력해주세요!");
      } else {
        let form = new FormData();
        console.log(this.requestData.item);
        form.append("item", JSON.stringify(this.requestData.item));
        form.append("reason", this.requestData.reason);
        this.activeStep++;
        this.requestData.form = form;
      }
    },
    submit() {
      var amount = 0;
      for (var key in this.requestData.item) {
        const qty = this.requestData.item[key];
        const matchProduct = this.products.filter(
          (product) => product.id == key
        )[0];
        amount += matchProduct.price * qty;
      }
      console.log(amount);
      this.requestData.form.append("amountPerTarget", amount);
      this.requestData.form.append("excel", this.requestData.file);
      this.$emit("submit", this.requestData.form);
    },
    itemUpdate(params) {
      const item = params.item;
      this.requestData.item = item;
    },
  },
};
</script>
<style>
#bulk {
  padding: 30px;
  text-align: left;
  margin-bottom: 100px;
}
.upload {
  width: 100% !important;
}
.upload-draggable {
  width: 100% !important;
}
</style>

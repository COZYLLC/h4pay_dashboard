<template>
  <div v-if="customer.teacherCheck" id="bulkform">
    <p class="title is-8" style="margin-bottom: 5vh">교내 매점 쿠폰 대량선물</p>
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
            @click="activeStep = 1"
            >양식 다운로드</b-button
          ></a
        >
        <b-button
          variant="primary"
          size="lg"
          style="margin-bottom: 20px; margin-left: 20px"
          @click="activeStep = 1"
        >
          이미 양식이 있어요.
        </b-button>
      </b-step-item>
      <b-step-item step="2" label="정보 입력" icon="keyboard">
        <p>
          품목 정보를 입력해주시고, 파일 첨부란에 엑셀 파일을 첨부해주세요.
          <br />
          <span style="color: red"
            >(전화번호는 엑셀과 주문자 정보 모두 '-' 없이 숫자만
            입력해주세요.)</span
          >
        </p>
        <b-field label="주문 품목">
          <b-select
            v-model="product"
            style="margin-bottom: 20px"
            size="lg"
            placeholder="제품을 선택해주세요."
          >
            <option
              v-for="(product, idx) in prodList"
              :key="idx"
              :value="product"
            >
              {{ product.text }}
            </option>
          </b-select>
        </b-field>
        <b-field label="1인 당 수량">
          <b-input
            v-model="customer.qty"
            type="number"
            size="lg"
            placeholder="1인 당 수량"
            style="margin-bottom: 20px"
            maxlength="3"
          />
        </b-field>
        <b-field label="선물 메시지">
          <b-input
            v-model="customer.reason"
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
      <b-step-item step="2" label="학생 명단 업로드" icon="upload">
        <b-field label="엑셀 파일 업로드">
          <b-upload v-model="file" drag-drop>
            <section class="section">
              <div class="content has-text-centered">
                <p>
                  <b-icon icon="upload" size="is-large"> </b-icon>
                </p>
                <p v-if="typeof file == 'function'">
                  파일을 선택하거나 드래그하세요
                </p>
                <div v-else>
                  {{ file.name }}
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeStep: 0,
      customer: {
        uid: "",
        name: "",
        role: "",
        teacherCheck: true,
        reason: "",
      },
      file: File,
      product: null,
      form: FormData,
      prodList: [],
      templateURL: process.env.VUE_APP_API_URL + "/../excelTemplate.xlsx",
    };
  },
  created() {
    this.fetchUser();
    this.fetchProduct();
  },
  methods: {
    fetchUser() {
      this.$store.dispatch("loginCheckA").then(
        function () {
          if (
            this.$store.getters.getName == null ||
            this.$store.getters.getRole == null
          ) {
            this.$router.push("/login");
          } else {
            this.customer.name = this.$store.getters.getName;
            this.customer.role = this.$store.getters.getRole;
            this.customer.uid = this.$store.getters.getUid;
            if (this.customer.role == "T" || this.customer.role == "A") {
              this.customer.teacherCheck = true;
            }
          }
        }.bind(this)
      );
    },
    fetchProduct() {
      this.$axios
        .get(`${process.env.VUE_APP_API_URL}/product`)
        .then((res) => {
          if (res != undefined) {
            res.data.list.forEach((item) => {
              this.prodList.push({
                value: item.id,
                text: item.productName,
              });
            });
          }
          console.log(this.prodList);
        })
        .catch((error) => {
          alert(
            "제품 목록을 불러오지 못했습니다. 개발자에게 문의해주세요. (1)"
          );
        });
    },
    goToUpload() {
      const customer = this.customer;
      if (customer.reason == "") {
        alert("정보를 모두 입력해주세요!");
      } else if (this.product == null) {
        alert("품목을 선택해주세요!");
      } else if (customer.qty <= 0) {
        alert("수량을 올바르게 입력해주세요! ");
      } else if (customer.qty > 100) {
        alert("1인당 선물 개수는 100개 이하입니다!");
      } else {
        let form = new FormData();
        form.append("senderUid", customer.uid);
        form.append("senderName", customer.name);
        form.append("product", this.product.value);
        form.append("reason", customer.reason);
        form.append("qty", customer.qty);
        this.activeStep = 2;
        this.form = form;
      }
    },
    submit() {
      this.form.append("excel", this.file);
      this.$emit("submit", this.form);
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

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

    <b-step-item step="2" label="상품권 선택" icon="hand-pointer">
      <b-field horizontal label="금액 직접 입력하기">
        <b-input v-model="inputedAmount" type="number" min="1000" />
        <b-button @click="activeStep++"> 확인 </b-button>
      </b-field>
      <div
        v-for="i in Math.round(vouchers.length / 3) + 1"
        :key="i"
        class="columns"
      >
        <div v-for="j in 3" :key="j" class="column">
          <image-card
            v-if="(i - 1) * 3 + (j - 1) < vouchers.length"
            @click="cardClick((i - 1) * 3 + (j - 1))"
          >
            <template v-slot:image>
              <img
                :src="
                  require(`@/assets/voucher/${
                    vouchers[(i - 1) * 3 + (j - 1)].amount
                  }.svg`)
                "
                :alt="`${
                  vouchers[(i - 1) * 3 + (j - 1)].amount
                } 원 상품권 이미지`"
              />
            </template>
            <template v-slot:content>
              <p class="title is-4">
                {{ vouchers[(i - 1) * 3 + (j - 1)].name }}
              </p>
            </template>
          </image-card>
        </div>
      </div>
    </b-step-item>
    <b-step-item step="3" label="학생 명단 업로드" icon="upload">
      <b-field label="수신자 메시지">
        <b-input v-model="message" type="textarea"></b-input>
      </b-field>
      <b-field label="엑셀 파일 업로드">
        <b-upload v-model="file" drag-drop accept=".xls,.xlsx">
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
</template>
<script>
import ImageCard from "@/components/ImageCard.vue";
import vouchers from "@/vouchers.json";
export default {
  components: { ImageCard },
  data() {
    return {
      vouchers: vouchers,
      activeStep: 0,
      inputedAmount: null,
      templateURL: process.env.VUE_APP_API_URL + "/../excelTemplate.xlsx",
      file: File,
      selectedVoucher: null,
      message: "",
    };
  },
  created() {
    this.vouchers.sort((a, b) => a.amount - b.amount);
  },
  methods: {
    cardClick(id) {
      console.log(id);
      this.activeStep++;
      this.selectedVoucher = id;
    },
    submit() {
      if (this.inputedAmount < 1000) {
        this.$buefy.notification.open({
          message: "액면가는 1000원 이상이어야 합니다!",
          type: "is-danger",
          duration: 1000,
        });
        return;
      } else if (this.inputedAmount > 1000000) {
        this.$buefy.notification.open({
          message: "액면가는 일금 백만원정 이하여야 합니다!",
          type: "is-danger",
          duration: 1000,
        });
        return;
      } else if (this.inputedAmount > 100000) {
        const amountRegex = /(\d)(?=(?:\d{3})+(?!\d))/g;
        const process = confirm(
          `입력하신 금액은 일금 십만원정 이상(${this.inputedAmount.replace(
            amountRegex,
            "$1,"
          )} 원) 입니다. 진행하시겠습니까?`
        );
        if (!process) return;
      }
      const names = this.file.name.split(".");
      const fileType = names[names.length - 1];
      if (fileType == "xlsx" || fileType == "xls") {
        const formData = new FormData();
        formData.append("message", this.message);
        formData.append(
          "amount",
          this.inputedAmount ?? vouchers[this.selectedVoucher].amount
        );
        formData.append("excel", this.file);
        this.$emit("submit", formData);
      } else {
        alert("엑셀 파일이 아닙니다!");
      }
    },
  },
};
</script>

<style scoped>
@media screen and (min-width: 1024px) {
  .columns {
    width: 70vh;
  }
}
</style>

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
          @click="activeStep = 1"
        >
          양식 다운로드
        </b-button>
      </a>
      <b-button
        variant="primary"
        size="lg"
        style="margin-bottom: 20px; margin-left: 20px"
        @click="activeStep = 1"
      >
        이미 양식이 있어요.
      </b-button>
    </b-step-item>
    <b-step-item step="2" label="상품권 선택" icon="hand-pointer">
      <div
        v-for="i in Math.round(vouchers.length / 3) + 1"
        :key="i"
        class="columns"
      >
        <div v-for="j in 3" :key="j" class="column">
          <image-card
            v-if="(i - 1) * 3 + (j - 1) < vouchers.length"
            :src="require('@/assets/notready.png') /* 실제 사진명으로 변경요망*/" 
            @click="cardClick((i - 1) * 3 + (j - 1))"
          >
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
                <b-icon icon="upload" size="is-large">
                </b-icon>
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
      templateURL: process.env.VUE_APP_API_URL + "/../excelTemplate.xlsx",
      file: File,
      selectedVoucher: null,
      message: "",
    };
  },
  methods: {
    cardClick(id) {
      console.log(id);
      this.activeStep = 3;
      this.selectedVoucher = id;
    },
    submit() {
      console.log(this.file);
      console.log(this.activeStep);
      const names = this.file.name.split(".");
      const fileType = names[names.length - 1];
      if (fileType == "xlsx" || fileType == "xls") {
        const formData = new FormData();
        formData.append("message", this.message);
        formData.append("amount", vouchers[this.selectedVoucher].amount);
        formData.append("excel", this.file);
        this.$emit("submit", formData);
      } else {
        alert("엑셀 파일이 아닙니다!");
      }
    },
  },
};
</script>

<style>
@media screen and (min-width: 1024px) {
  .columns {
    width: 70vh;
  }
}
</style>

<template>
  <div id="contract-form">
    <b-steps
      v-if="token != null && token != ''"
      v-model="activeStep"
      :has-navigation="false"
    >
      <b-step-item
        step="1"
        label="학생 명단 양식 다운로드"
        class="has-text-centered"
      >
        <div id="loading" class="m-6"></div>
        <p class="title m-2">학생 명단 양식을 다운로드 중입니다...</p>
        <a class="subtitle m-2 is-underlined" :href="getExcelLink()">
          혹시 다운로드가 시작되지 않았나요?
        </a>
        <br />
        <b-button class="m-6 is-primary" rounded @click="goNextStep">
          다운로드했어요
        </b-button>
      </b-step-item>
      <b-step-item step="2" label="학생 명단 업로드" class="has-text-right">
        <b-field>
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
        <b-button class="is-primary" rounded @click="goNextStep">다음</b-button>
      </b-step-item>
      <b-step-item
        step="3"
        label="교환앱 로그인 비밀번호 설정"
        class="has-text-right"
      >
        <b-field
          label="비밀번호"
          class="has-text-left"
          :type="passwordValidity ? 'is-success' : 'is-danger'"
        >
          <b-input v-model="password" type="password" password-reveal></b-input>
        </b-field>
        <b-button
          v-if="passwordValidity"
          class="is-primary"
          rounded
          @click="goNextStep"
          >다음</b-button
        >
      </b-step-item>
      <b-step-item step="4" label="관리자 계정 생성" class="has-text-right">
        <register class="has-text-left" @register="submit" />
      </b-step-item>
    </b-steps>
    <div
      v-else
      style="
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        height: 90vh;
      "
    >
      <img :src="require('@/assets/error.png')" width="200" class="m-6" />
      <p class="title">토큰이 없거나 올바르지 않습니다.</p>
    </div>
  </div>
</template>

<script>
import { createHash } from "crypto";
import Register from "@/views/Contract/Register.vue";
import notification from "@/js/notification";
import { uploadStudentInfos } from "@/networking/contract";
import { changeSchoolPassword } from "../../networking/school";
import { register } from "../../networking/users";

export default {
  components: {
    Register,
  },
  props: {
    token: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      activeStep: 0,
      loading: true,
      file: File,
      password: null,
    };
  },
  computed: {
    passwordValidity() {
      const pwRegExp =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
      return pwRegExp.test(this.password);
    },
  },
  created() {
    console.log(this.token);
    this.downloadExcel();
  },
  methods: {
    downloadExcel() {
      window.location.replace(this.getExcelLink());
    },
    getExcelLink() {
      return `${window.location.origin}/studentExcelTemplate.xlsx`;
    },
    async submit(admin) {
      const encrpytedPassword = createHash("sha256")
        .update(this.password)
        .digest("base64");
      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("token", this.token);
      const uploadStudentInfoResult = await uploadStudentInfos(formData);
      if (uploadStudentInfoResult.status) {
        const changePasswordResult = await changeSchoolPassword({
          token: this.token,
          password: encrpytedPassword,
        });
        if (changePasswordResult.status) {
          const registerResult = await register({
            name: admin.name,
            password: admin.password,
            email: admin.email,
            gID: "",
            aID: "",
            tel: admin.tel.replace(/-/g, ""),
            role: "AT",
          });
          if (registerResult.status) {
            notification
              .show(
                this,
                "H4Pay를 이용해주셔서 감사합니다!",
                "is-success",
                2500
              )
              .then((_) => {
                this.$router.push("/");
              });
          } else {
            notification
              .show(this, "관리자 계정 생성에 실패했습니다.", "is-danger", 2500)
              .then((_) => {
                this.$router.push(`/contract/${this.token}`);
              });
          }
        } else {
          notification
            .show(
              this,
              "매점 교환앱 비밀번호 설정에 실패했습니다.",
              "is-danger",
              2500
            )
            .then((_) => {
              this.$router.push(`/contract/${this.token}`);
            });
        }
      } else {
        notification
          .show(this, "학생 정보 입력에 실패했습니다.", "is-danger", 2500)
          .then((_) => {
            this.$router.push(`/contract/${this.token}`);
          });
      }
    },
    goNextStep() {
      this.activeStep++;
    },
  },
};
</script>
<style>
@media screen and (min-width: 767px) {
  #contract-form {
    padding: 0 20vw;
  }
}
</style>
<style scoped>
#loading {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  border-top-color: rgb(0, 0, 0);
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>

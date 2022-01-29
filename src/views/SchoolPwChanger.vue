<template>
  <div id="changepass-page">
    <p class="title">H4Pay 매점 교환앱 접근 비밀번호 변경</p>
    <p class="subtitle">
      안녕하세요! H4Pay를 이용해주셔서 감사합니다. 본 페이지는 매점 교환앱에
      접근하기 위한 비밀번호를 변경하는 페이지입니다.
    </p>
    <p class="subtitle">
      변경하고자 하는 비밀번호를 입력 후 제출 버튼을 클릭해주세요.
    </p>
    <b-field>
      <b-input v-model="password"></b-input>
    </b-field>
    <b-button class="is-success" @click="_changePassword"> 제출 </b-button>
  </div>
</template>
<script>
import { changeSchoolPassword, validatePassToken } from "@/networking/school";
export default {
  props: {
    token: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      password: null,
      isValid: false,
    };
  },
  created() {
    validatePassToken(this.token)
      .then((res) => {
        this.isValid = res.status;
        if (!res.status) {
          this.$buefy.notification.open({
            message: "토큰이 올바르지 않습니다.",
            type: "is-danger",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.isValid = false;
        this.$buefy.notification.open({
          message: "토큰 검증 중 오류가 발생했습니다.",
          type: "is-danger",
        });
      });
  },
  methods: {
    _changePassword() {
      if (this.password != null && this.token) {
        changeSchoolPassword(this.token, this.password)
          .then((res) => {
            if (res.status) {
              this.$buefy.notification.open({
                message:
                  "비밀번호 변경이 완료되었습니다. 로그인 페이지로 이동합니다.",
                duration: 2000,
              });
              setTimeout(() => {
                this.$router.push("/");
              }, 2000);
            } else {
              this.$buefy.notification.open({
                message: "비밀번호 변경에 실패했습니다.",
                duration: 2000,
              });
            }
          })
          .catch((err) => {
            this.$buefy.notification.open({
              message: `비밀번호 변경에 실패했습니다: ${err.message}`,
              duration: 2000,
            });
          });
      }
    },
  },
};
</script>
<style>
@media screen and (min-width: 1024px) {
  #changepass-page {
    margin: 0 20vw;
  }
}
</style>
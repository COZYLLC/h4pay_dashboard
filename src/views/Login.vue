<template>
  <div id="login">
    <div style="width: 80vw; margin: 15vh auto 0">
      <img :src="require('@/assets/logo.png')" style="width: 30vh" />
    </div>
    <div class="columns" is-vcentered style="margin: auto; width: 80vw">
      <div class="column" style="margin: auto">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <p class="title">로그인</p>
              <b-field
                label="휴대전화번호"
                :type="telState ? 'is-primary' : 'is-danger'"
              >
                <b-input v-model="tel" @keyup.native="getPhoneMask"></b-input>
              </b-field>
              <b-field
                label="비밀번호"
                :type="pwState ? 'is-primary' : 'is-danger'"
              >
                <b-input
                  v-model="pw"
                  type="password"
                  password-reveal
                  @keyup.native.enter="submit"
                ></b-input>
              </b-field>
              <b-button
                class="is-primary"
                style="margin-right: 10px"
                @click="submit"
              >
                로그인
              </b-button>
              <b-button class="is-primary" @click="$router.push('register')">
                회원가입
              </b-button>
            </div>
          </div>
        </div>
      </div>
      <div class="column" style="margin: auto">
        <figure>
          <img :src="require('@/assets/5193278.jpg')" />
          <figcaption>
            <a href="https://www.freepik.com/vectors/people"
              >People vector created by stories - www.freepik.com</a
            >
          </figcaption>
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
import { createHash } from "crypto";
import { getMask } from "@/js/telMask";
export default {
  data() {
    return {
      tel: "",
      pw: "",
    };
  },
  computed: {
    telState() {
      const telRegExp = RegExp(/^\d{3}-\d{4}-\d{4}$/);
      return this.tel.length > 0 && telRegExp.test(this.tel);
    },
    pwState() {
      return this.pw.length > 0 && this.pw != "";
    },
  },
  created() {
    this.$store.commit("logoutM");
  },
  methods: {
    getPhoneMask() {
      this.tel = getMask(this.tel);
    },
    submit() {
      this.$axios
        .post(`${process.env.VUE_APP_API_URL}/users/login`, {
          tel: this.tel.replace(/-/gi, ""),
          password: createHash("sha256").update(this.pw).digest("base64"),
        })
        .then((res) => {
          console.log(res);
          if (res.status) {
            const token = res.headers["x-access-token"];
            this.$store.commit("loginTokenM", token);
            this.$router.push({ path: "/" });
          }
          if (!res.status) {
            alert("아이디 또는 비밀번호가 틀립니다.");
          }
        })
        .catch((error) => {
          //this.$Sentry.captureException(error);
          if (error.response.status == 400) {
            this.$buefy.notification.open({
              message:
                "아이디 혹은 비밀번호가 일치하지 않습니다.\n관리자에게 가입 요청을 승인 받았는지 확인하세요.",
              type: "is-danger",
              duration: 3000,
            });
          } else {
            console.log(error);
            alert("서버 오류입니다. 개발자에게 문의해주세요.");
          }
        });
    },
  },
};
</script>
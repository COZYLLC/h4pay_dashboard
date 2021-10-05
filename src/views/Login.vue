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
                label="아이디"
                :type="idState ? 'is-primary' : 'is-danger'"
              >
                <b-input v-model="id" @keyup.native.enter="submit"></b-input>
              </b-field>
              <b-field
                label="비밀번호"
                :type="pwState ? 'is-primary' : 'is-danger'"
              >
                <b-input
                  v-model="pw"
                  @keyup.native.enter="submit"
                  type="password"
                  password-reveal
                ></b-input>
              </b-field>
              <b-button @click="submit" class="is-primary" style="margin-right:10px">로그인</b-button>
              <b-button @click="$router.push('register')" class="is-primary">회원가입</b-button>
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
export default {
  methods: {
    submit() {
      this.$axios
        .post(process.env.VUE_APP_API_URL + `/users/login`, {
          uid: this.id,
          password: createHash("sha256").update(this.pw).digest("base64"),
        })
        .then((res) => {
          console.log(res);
          if (res.data.status) {
            this.$store.commit("loginTokenM", res.data.accessToken);
            this.$router.push({ path: "/" });
          }
          if (!res.data.status) {
            alert("아이디 또는 비밀번호가 틀립니다.");
          }
        })
        .catch((error) => {
          this.$Sentry.captureException(error);
          if (error) {
            alert("서버 오류입니다. 개발자에게 문의해주세요.");
          }
        });
    },
  },
  created() {
    this.$store.commit("logoutM");
  },
  data() {
    return {
      id: "",
      pw: "",
    };
  },
  computed: {
    idState() {
      return this.id.length > 0 && this.id != "";
    },
    pwState() {
      return this.pw.length > 0 && this.pw != "";
    },
  },
};
</script>
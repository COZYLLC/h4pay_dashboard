<template>
  <div class="outer-container">
    <div id="findpw-container">
      <b-steps v-model="currentStep" :has-navigation="false">
        <b-step-item step="1">
          <p class="title is-4">비밀번호 찾기</p>
          <b-field label="이름" :type="isValid(nameValidator)">
            <b-input v-model="name" />
          </b-field>
          <b-field label="전화번호" :type="isValid(telValidator)">
            <b-input v-model="tel" @keyup.native="getPhoneMask" />
          </b-field>
          <b-button
            style="float: right"
            type="is-primary"
            label="찾기"
            @click="submit"
          />
        </b-step-item>
        <b-step-item step="2">
          <p class="title is-4">인증번호 입력</p>
          <b-field label="인증번호" :type="isValid(authPinCorrectValidator)">
            <b-input
              v-model="inputedPin"
              type="text"
              maxlength="6"
              @keyup.native="checkAuthPin"
            />
          </b-field>
        </b-step-item>
        <b-step-item step="3">
          <p class="title is-4">비밀번호 변경하기</p>
          <b-field label="비밀번호 입력" :type="isValid(pwValidator)">
            <b-input v-model="password" type="password" password-reveal />
          </b-field>
          <b-field label="비밀번호 재입력" :type="isValid(pwCheckValidator)">
            <b-input v-model="passwordCheck" type="password" password-reveal />
          </b-field>
          <b-button label="변경" @click="changeSubmit" />
        </b-step-item>
      </b-steps>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import {
  nameValidator,
  telValidator,
  pwValidator,
  pwCheckValidator,
} from "../../js/validator";
import { findPassword, changePassword } from "../../networking/users";
import { getMask } from "../../js/telMask";
import { createHash } from "crypto";

export default Vue.extend({
  data() {
    return {
      tel: "",
      name: "",
      authPin: null,
      inputedPin: "",
      currentStep: 0,
      password: "",
      passwordCheck: "",
    };
  },
  computed: {
    telValidator() {
      return telValidator(this.tel);
    },
    nameValidator() {
      return nameValidator(this.name);
    },
    authPinValidator() {
      return this.inputedPin.length == 6;
    },
    authPinCorrectValidator() {
      return (
        createHash("sha256").update(this.inputedPin).digest("base64") ==
        this.authPin
      );
    },
    pwValidator() {
      return pwValidator(this.password);
    },
    pwCheckValidator() {
      return pwCheckValidator(this.password, this.passwordCheck);
    },
  },
  methods: {
    isValid(bool) {
      return bool ? "is-success" : "is-danger";
    },
    submit() {
      if (this.telValidator && this.nameValidator) {
        const data = {
          tel: this.tel.replace(/-/g, ""),
          name: this.name,
        };
        findPassword(data).then((res) => {
          if (res.status && res.result) {
            this.currentStep++;
            this.authPin = res.result;
          } else {
            this.$buefy.notification.open({
              message: res.message,
              type: "is-danger",
            });
          }
        });
      }
    },
    changeSubmit() {
      if (this.pwValidator && this.pwCheckValidator) {
        const data = {
          name: this.name,
          tel: this.tel.replace(/-/g, ""),
          password: createHash("sha256").update(this.password).digest("base64"),
        };
        changePassword(data).then((res) => {
          this.$buefy.notification.open({
            message: res.message,
            type: res.status ? "is-success" : "is-danger",
          });
          this.$router.push("/login");
        });
      }
    },
    getPhoneMask() {
      this.tel = getMask(this.tel);
    },
    checkAuthPin() {
      if (this.authPinCorrectValidator) {
        this.currentStep++;
      }
    },
  },
});
</script>

<style>
.outer-container {
  display: flex;
  height: 100vh;
  background: #f1f3f6;
}
#findpw-container {
  width: 60vh;
  margin: auto;
  background: rgb(244, 244, 244);
  padding: 30px;
  border-radius: 28px;
  box-shadow: inset 0 0 15px rgba(55, 84, 170, 0),
    inset 0 0 20px rgba(255, 255, 255, 0), 7px 7px 15px rgba(55, 84, 170, 0.15),
    -7px -7px 20px rgba(255, 255, 255, 1),
    inset 0px 0px 4px rgba(255, 255, 255, 0.2);
}
</style>

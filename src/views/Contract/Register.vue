<template>
  <div class="has-text-right">
    <b-field label="이름" :type="isValid(nameState)" horizontal>
      <b-input v-model="admin.name" type="text" />
    </b-field>
    <b-field
      horizontal
      label="비밀번호"
      class="has-text-left"
      :type="isValid(pwState)"
    >
      <b-input
        v-model="admin.password"
        type="password"
        password-reveal
      ></b-input>
    </b-field>
    <b-field
      horizontal
      label="비밀번호 확인"
      class="has-text-left"
      :type="isValid(pw2State)"
    >
      <b-input
        v-model="admin.password2"
        type="password"
        password-reveal
      ></b-input>
    </b-field>
    <b-field label="이메일" :type="isValid(emailState)" horizontal>
      <b-input v-model="admin.email" type="email" />
    </b-field>
    <b-field label="전화번호" :type="isValid(telState)" horizontal>
      <b-input
        v-model="admin.tel"
        type="tel"
        maxlength="13"
        @keyup.native="getPhoneMask"
      />
    </b-field>
    <div v-for="(agreement, idx) in agreements" :key="idx">
      <b-checkbox
        v-model="admin.checks.selected[idx]"
        :state="checkState"
        @input="onCheck(idx)"
      >
        {{ agreement.text }}
      </b-checkbox>
    </div>

    <b-button rounded class="is-primary" @click="submit"> 제출 </b-button>

    <b-modal v-model="policyModalActive">
      <div class="card">
        <div class="card-content">
          <b-tabs v-model="tabIndex">
            <b-tab-item
              v-for="(agreement, idx) in agreements"
              :key="idx"
              :label="agreement.text"
            >
              <iframe
                :src="`https://h4pay.co.kr/law/${agreement.url}.html`"
                style="width: 100%; height: 400px; border: none"
              ></iframe>
            </b-tab-item>
          </b-tabs>
        </div>

        <footer class="card-footer">
          <a href="#" class="card-footer-item" @click="agree">동의합니다</a>
        </footer>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { getMask } from "@/js/telMask.js";
import notification from "@/js/notification";
export default {
  data() {
    return {
      tabIndex: 3,
      admin: {
        name: null,
        password: null,
        password2: null,
        email: null,
        tel: null,
        checks: {
          indeterminate: false,
          allSelected: false,
          selected: [false, false],
        },
      },
      policyModalActive: false,
      agreements: [
        { text: "(필수) H4Pay 이용약관", url: "terms" },
        { text: "(필수) 개인정보 처리방침", url: "privacyPolicy" },
      ],
    };
  },
  computed: {
    checkState() {
      return this.admin.checks.allSelected;
    },
    telState() {
      const telRegExp = /^\d{3}-\d{4}-\d{4}$/;
      return telRegExp.test(this.admin.tel);
    },
    emailState() {
      const emailRegExp =
        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return emailRegExp.test(this.admin.email);
    },
    nameState() {
      const nameRegExp = /^[가-힣]{2,8}$/;
      return nameRegExp.test(this.admin.name);
    },
    idState() {
      return this.admin.uid != "" || this.admin.uid.length > 6;
    },
    pwState() {
      const pwRegExp =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
      return pwRegExp.test(this.admin.password);
    },
    pw2State() {
      return (
        this.admin.password == this.admin.password2 &&
        this.admin.password2 != null
      );
    },
  },
  watch: {
    "admin.checks.selected"(newValue) {
      if (newValue.length === 0) {
        this.admin.checks.indeterminate = false;
        this.admin.checks.allSelected = false;
      } else if (newValue.length === this.agreements.length) {
        this.admin.checks.indeterminate = false;
        this.admin.checks.allSelected = true;
      } else {
        this.admin.checks.indeterminate = true;
        this.admin.checks.allSelected = false;
      }
    },
  },
  methods: {
    submit() {
      if (
        this.telState &&
        this.emailState &&
        this.pwState &&
        this.pw2State &&
        this.nameState &&
        this.checkState
      ) {
        this.$emit("register", this.admin);
      } else {
        notification.show(
          this,
          "모든 값을 올바르게 입력해주세요!",
          "is-danger",
          2500
        );
      }
    },
    isValid(bool) {
      return bool ? "is-primary" : "is-danger";
    },
    onCheck(checked) {
      if (this.admin.checks.selected[checked]) {
        console.log(checked);
        this.tabIndex = checked;
        this.policyModalActive = true;
      }
    },
    getPhoneMask(tel) {
      console.log(getMask(this.admin.tel));
      this.admin.tel = getMask(this.admin.tel);
    },
    agree() {
      if (this.tabIndex == this.agreements.length - 1) {
        this.policyModalActive = false;
      } else {
        this.tabIndex++;
        this.admin.checks.selected[this.tabIndex] = true;
      }
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 38px !important;
}
</style>

<template>
  <div class="App">
    <section id="form" style="text-align: left; width: 45vw; margin: auto">
      <p class="title" style="text-align: center; color: black">회원가입</p>
      <b-field label="학교" horizontal>
        <b-select v-model="form.schoolId">
          <option
            v-for="(option, i) in schoolOptions"
            :key="i"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </b-select>
      </b-field>
      <b-field label="이름" :type="isValid(nameState)" horizontal>
        <b-input v-model="form.name" type="text" />
      </b-field>
      <b-field label="사용자 유형" horizontal>
        <b-select v-model="form.role">
          <option
            v-for="(option, i) in roleOptions"
            :key="i"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </b-select>
      </b-field>
      <b-field label="인증코드" horizontal>
        <b-input v-model="form.code" type="text" />
      </b-field>
      <b-field label="아이디" :type="isValid(idState)" horizontal>
        <b-input v-model="form.uid" type="text" />
      </b-field>
      <b-field label="비밀번호" :type="isValid(pwState)" horizontal>
        <b-input v-model="form.password" type="password" password-reveal>
        </b-input>
      </b-field>
      <b-field label="비밀번호 재입력" :type="isValid(pw2State)" horizontal>
        <b-input v-model="form.password2" type="password" password-reveal>
        </b-input>
      </b-field>
      <b-field label="이메일" :type="isValid(emailState)" horizontal>
        <b-input v-model="form.email" type="email" />
      </b-field>
      <b-field label="전화번호" :type="isValid(telState)" horizontal>
        <b-input
          v-model="maskedTel"
          type="tel"
          maxlength="13"
          @keyup="getPhoneMask(form.tel)"
        />
      </b-field>
      <b-field>
        <b-checkbox
          v-for="(agreement, idx) in agreements"
          :key="idx"
          v-model="form.checks.selected[idx]"
          :state="checkState"
          @input="onCheck(idx)"
        >
          {{ agreement.text }}
        </b-checkbox>
      </b-field>
      <b-button type="submit" class="is-primary" @click="loginSubmit">
        회원가입
      </b-button>
    </section>

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
          <a href="#" class="card-footer-item" @click="closeModal"
            >동의합니다</a
          >
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import { createHash } from "crypto";
import { register } from "../networking/users";
import { getSchools } from "../networking/school";

export default {
  data() {
    return {
      url: window.location.origin,
      tabIndex: 3,
      roleOptions: [
        { value: null, text: "항목을 선택해주세요" },
        { value: "A", text: "행정실 관리자" },
        { value: "AT", text: "매점 관리 교사" },
        { value: "T", text: "일반 교사" },
      ],
      schoolOptions: [
        {
          value: null,
          text: "학교를 선택하세요.",
        },
      ],
      agreements: [
        { text: "(필수) H4Pay 이용약관", url: "terms" },
        { text: "(필수) 개인정보 처리방침", url: "privacyPolicy" },
      ],
      form: {
        schoolId: null,
        name: "",
        role: null,
        studentid: "",
        uid: "",
        password: null,
        password2: null,
        passwordFieldType: "password",
        showPassword: false,
        code: "",
        email: "",
        gID: "",
        aID: "",
        tel: "",
        checks: {
          indeterminate: false,
          allSelected: false,
          selected: [false, false],
        },
      },
      policyModalActive: false,
    };
  },
  computed: {
    maskedTel: {
      get() {
        return this.form.tel;
      },
      set(newVal) {
        this.form.tel = this.getMask(newVal);
      },
    },
    checkState() {
      let state = true;
      for (let i = 0; i < this.form.checks.selected.length; i++) {
        if (!this.form.checks.selected[i]) {
          state = false;
        }
      }
      return state;
    },
    telState() {
      const telRegExp = /^\d{3}-\d{4}-\d{4}$/;
      return telRegExp.test(this.form.tel);
    },
    emailState() {
      const emailRegExp =
        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return emailRegExp.test(this.form.email);
    },
    nameState() {
      const nameRegExp = /^[가-힣]{2,8}$/;
      return nameRegExp.test(this.form.name);
    },
    roleState() {
      return this.form.role != null;
    },
    idState() {
      return this.form.uid != "" || this.form.uid.length > 6;
    },
    sIdState() {
      const reg = /^\d{4}/;
      return reg.test(this.form.studentid);
    },
    pwState() {
      const pwRegExp =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
      return pwRegExp.test(this.form.password);
    },
    pw2State() {
      return (
        this.form.password == this.form.password2 && this.form.password2 != null
      );
    },
    codeState() {
      return this.checkValidKey(this.form.role);
    },
  },
  watch: {
    selected(newValue) {
      // Handle changes in individual flavour checkboxes
      if (newValue.length === 0) {
        this.form.checks.indeterminate = false;
        this.form.checks.allSelected = false;
      } else if (newValue.length === this.checkString.length) {
        this.form.checks.indeterminate = false;
        this.form.checks.allSelected = true;
      } else {
        this.form.checks.indeterminate = true;
        this.form.checks.allSelected = false;
      }
    },
  },
  created() {
    getSchools().then((res) => {
      if (res.status) {
        res.result.forEach((school) => {
          this.schoolOptions.push({
            value: school.id,
            text: school.name,
          });
        });
      }
    });
  },
  metaInfo: {
    meta: [
      { name: "theme-color", content: "#ecf5ff" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "#ecf5ff" },
    ],
  },
  methods: {
    checkValidKey(role) {
      console.log(role);
      let valid = false;
      switch (role) {
        case "A":
          console.log(process.env.VUE_APP_AUTH_CODE_ADMIN);
          valid = this.form.code == process.env.VUE_APP_AUTH_CODE_ADMIN;
          break;
        case "AT":
          console.log(process.env.VUE_APP_AUTH_CODE_ADMIN_TEACHER);
          valid = this.form.code == process.env.VUE_APP_AUTH_CODE_ADMIN_TEACHER;
          break;
        case "T":
          console.log(process.env.VUE_APP_AUTH_CODE_TEACHER);
          valid = this.form.code == process.env.VUE_APP_AUTH_CODE_TEACHER;
          break;
      }
      return valid;
    },

    closeModal() {
      this.policyModalActive = false;
    },
    onCheck(checked) {
      if (this.form.checks.selected[checked]) {
        console.log(checked);
        this.tabIndex = checked;
        this.policyModalActive = true;
      }
    },
    isValid(bool) {
      return bool ? "is-primary" : "is-danger";
    },
    getMask(phoneNumber) {
      if (!phoneNumber) return phoneNumber;
      phoneNumber = phoneNumber.replace(/[^0-9]/g, "");

      let res = "";
      if (phoneNumber.length < 3) {
        res = phoneNumber;
      } else {
        if (phoneNumber.length < 8) {
          res = phoneNumber;
        } else if (phoneNumber.length == 8) {
          res = phoneNumber.substr(0, 4) + "-" + phoneNumber.substr(4);
        } else if (phoneNumber.length == 9) {
          res =
            phoneNumber.substr(0, 3) +
            "-" +
            phoneNumber.substr(3, 3) +
            "-" +
            phoneNumber.substr(6);
        } else if (phoneNumber.length == 10) {
          res =
            phoneNumber.substr(0, 3) +
            "-" +
            phoneNumber.substr(3, 3) +
            "-" +
            phoneNumber.substr(6);
        } else if (phoneNumber.length > 10) {
          //010-1234-5678
          res =
            phoneNumber.substr(0, 3) +
            "-" +
            phoneNumber.substr(3, 4) +
            "-" +
            phoneNumber.substr(7);
        }
      }
      return res;
    },
    sendRequest() {
      console.log("clicked");
      const data = {
        schoolId: this.form.schoolId,
        name: this.form.name,
        uid: this.form.uid,
        password: createHash("sha256")
          .update(this.form.password)
          .digest("base64"),
        studentid: this.form.studentid,
        email: this.form.email,
        gID: this.form.gID,
        aID: this.form.aID,
        tel: this.form.tel.replace(/-/g, ""),
        role: this.form.role,
      };
      register(data)
        .then((res) => {
          if (res.status == true) {
            alert(
              "가입 요청이 처리되었습니다. 매점 담당 선생님께 승인을 요청하세요."
            );
            this.$router.push({ path: "/login" });
          } else {
            alert("이미 존재하는 아이디입니다.");
          }
          //this.$store.commit('loginToken', res)
        })
        .catch((error) => {
          this.$Sentry.captureException(error);
          alert("회원가입에 실패했습니다.");
        });
    },
    loginSubmit() {
      console.log(
        `${this.telState} ${this.emailState} ${this.pwState} ${this.pw2State} ${this.idState} ${this.sIdState} ${this.roleState} ${this.nameState}`
      );
      if (
        this.telState &&
        this.emailState &&
        this.pwState &&
        this.pw2State &&
        this.idState &&
        this.roleState &&
        this.nameState
      ) {
        if (this.checkState) {
          if (this.codeState) {
            this.form.studentid == null;
            this.sendRequest();
          } else {
            alert("올바른 선생님 인증 코드를 입력해주세요!");
          }
        } else {
          alert("약관에 모두 동의해주세요!");
        }
      } else {
        alert("필요한 값을 모두 입력해주세요.");
      }
    },
  },
};
</script>

<style>
body {
  margin: 0;
}

.App {
  width: 100%;
  height: 100%;
  padding: 100px;
}

#form {
  background: rgb(243, 243, 243);
  border-radius: 38px;
  padding: 30px;
}

.alert-danger p {
  color: red;
}
</style>
<style scoped>
.title {
  color: white;
}
</style>

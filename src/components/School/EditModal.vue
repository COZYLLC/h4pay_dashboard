<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ title }}
        </p>
        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <section class="modal-card-body">
        <p v-if="type == 'modify'" style="color: red">
          학교 정보 변경 기능은 현재 지원이 안되고 있습니다.
        </p>
        <b-field label="학교명">
          <b-input v-model="school.name" />
        </b-field>
        <b-field label="나이스 학교코드">
          <b-input v-model="school.id" />
        </b-field>
        나이스 학교코드 검색은
        <a @click="openSchoolSearch">여기</a>에서 가능합니다.
        <b-field label="매점 법인명">
          <b-input v-model="school.seller.name" />
        </b-field>
        <b-field label="매점 법인 대표">
          <b-input v-model="school.seller.founderName" />
        </b-field>
        <b-field label="매점 법인 사업장 주소">
          <b-input v-model="school.seller.address" />
        </b-field>
        <b-field label="매점 법인 전화번호">
          <b-input v-model="school.seller.tel" />
        </b-field>
        <b-field label="매점 법인 사업자번호">
          <b-input v-model="school.seller.businessId" />
        </b-field>
        <b-field label="매점 법인 통신판매업신고번호">
          <b-input v-model="school.seller.sellerId" />
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <b-button label="닫기" @click="$emit('close')" />
        <b-button
          :label="type == 'add' ? '추가' : '변경'"
          type="is-primary"
          @click="submit"
        />
      </footer>
    </div>
  </form>
</template>

<script>
import { addSchool, modifySchool } from "../../networking/school";

export default {
  props: ["canCancel", "title", "type", "schoolToModify"],
  data() {
    return {
      school: {
        id: null,
        name: null,
        seller: {
          name: null,
          founderName: null,
          address: null,
          tel: null,
          businessId: null,
          sellerId: null,
        },
      },
      compkey: 0,
    };
  },
  created() {
    if (this.type == "modify") {
      this.school = this.schoolToModify;
    }
  },
  methods: {
    copyString(string) {
      const t = document.createElement("textarea");
      document.body.appendChild(t);
      t.value = string;
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
    },
    openSchoolSearch() {
      window.open(
        "http://jubsoo2.bscu.ac.kr/src_gogocode/src_gogocode.asp",
        "_blank",
        "width=800, height=600"
      );
      return false;
    },
    processResult(res) {
      if (res.status) {
        console.log(res);
        this.copyString(
          `${window.location.href.split("?")[0]}init/${res.result}`
        );
        this.$buefy.notification.open({
          message: "처리가 완료되었습니다.",
          type: "is-primary",
          duration: 1000,
        });

        this.$router.go();
      } else {
        this.$buefy.notification.open({
          message: "처리에 실패했습니다.",
          type: "is-danger",
          duration: 1000,
        });
      }
    },
    submit() {
      if (this.type == "add") {
        addSchool(this.school).then((res) => {
          this.processResult(res);
        });
      } else if (this.type == "modify") {
        modifySchool(this.school).then((res) => {
          this.processResult(res);
        });
      }
    },
  },
};
</script>

<style scoped>
.hidden {
  display: none;
}
img {
  display: block;
  max-width: 100%;
}
</style>
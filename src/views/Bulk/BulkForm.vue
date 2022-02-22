<template>
  <div v-if="customer.teacherCheck" id="bulkform">
    <p class="title is-8" style="margin-bottom: 5vh">교내 매점 쿠폰 대량선물</p>
    <b-steps v-model="activeStep" :has-navigation="false">
      <b-step-item step="1" label="명단 입력 방식 선택" class="columns">
        <div class="column">
          <b-button
            icon-left="table"
            class="is-primary"
            expanded
            @click="switchToNext('excel')"
          >
            엑셀로 입력하기
          </b-button>
        </div>
        <div class="column">
          <b-button
            icon-left="mouse-pointer"
            class="is-info"
            expanded
            @click="switchToNext('manual')"
          >
            직접 입력하기
          </b-button>
        </div>
      </b-step-item>
      <b-step-item step="2" label="명단 입력">
        <item-select v-if="type == 'manual'" @submit="submit"></item-select>
        <Excel
          v-if="type == 'excel'"
          :customer="customer"
          @submit="submitWithExcel"
        />
      </b-step-item>
    </b-steps>
  </div>
</template>
<script>
import ItemSelect from "@/components/BulkReq/Gift/ItemSelect.vue";
import Excel from "@/components/BulkReq/Excel.vue";
export default {
  components: {
    ItemSelect,
    Excel,
  },
  data() {
    return {
      activeStep: 0,
      type: null,
      customer: {
        uid: "",
        name: "",
        role: "",
        teacherCheck: true,
      },
    };
  },
  created() {
    this.fetchUser();
  },
  methods: {
    switchToNext(type) {
      this.type = type;
      this.activeStep++;
    },
    fetchUser() {
      this.$store.dispatch("loginCheckA").then(
        function () {
          if (
            this.$store.getters.getName == null ||
            this.$store.getters.getRole == null
          ) {
            this.$router.push("/login");
          } else {
            this.customer.name = this.$store.getters.getName;
            this.customer.role = this.$store.getters.getRole;
            this.customer.uid = this.$store.getters.getUid;
            if (this.customer.role == "T" || this.customer.role == "A") {
              this.customer.teacherCheck = true;
            }
          }
        }.bind(this)
      );
    },
    submitWithExcel(data) {
      data.append("senderUid", this.customer.uid);
      data.append("senderName", this.customer.name);
      this.$emit("submitWithExcel", data);
    },
    submit(data) {
      data.senderUid = this.customer.uid;
      data.senderName = this.customer.name;
      this.$emit("submit", data);
    },
  },
};
</script>
<style></style>

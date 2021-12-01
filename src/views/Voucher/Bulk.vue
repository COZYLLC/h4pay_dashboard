<template>
  <div>
    <p class="title is-4">상품권 대량 선물</p>
    <p class="subtitle is-6">
      금액 상품권을 학생들에게 대량으로 선물할 수 있습니다.
    </p>
    <BulkForm @submit="submit" />
  </div>
</template>

<script>
import BulkForm from "@/views/Voucher/BulkForm.vue";
export default {
  components: {
    BulkForm,
  },
  methods: {
    submit(formData) {
      this.$store.dispatch("loginCheckA").then(() => {
        const token = this.$store.getters.getToken;
        const uid = this.$store.getters.getUid;
        const name = this.$store.getters.getName;
        formData.append("issuerId", uid);
        formData.append("issuerName", name);
        this.$axios
          .post(`${process.env.VUE_APP_API_URL}/voucher/bulk`, formData, {
            headers: {
              "X-Access-Token": token,
            },
          })
          .then((res) => {
            if (res.status == 200) {
              this.$buefy.notification.open({
                message: "상품권 발행 및 선물이 정상 처리되었습니다.",
                type: "is-success",
                duration: 1000,
              });
              this.$router.push("/voucher/log/publish");
            } else {
              this.$buefy.notification.open({
                message: "상품권 발행에 실패했습니다.",
                type: "is-danger",
                duration: 1000,
              });
            }
          })
          .catch((err) => {
            this.$buefy.notification.open({
              message: `오류가 발생했습니다: ${err.message}`,
              type: "is-danger",
              duration: 1000,
            });
          });
      });
    },
  },
};
</script>

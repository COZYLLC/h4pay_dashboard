<template>
  <div>
    <p class="title is-4">무승인 상품권 대량 선물</p>
    <p class="subtitle is-6">
      금액 상품권을 학생들에게 결제하지 않고 대량으로 선물할 수 있습니다.
    </p>
    <BulkForm @submit="submit" />
  </div>
</template>

<script>
import BulkForm from "@/views/Voucher/BulkForm.vue";
import {
  issueVoucherRequest,
  approveVoucherRequest,
} from "@/networking/voucher";
export default {
  components: {
    BulkForm,
  },
  methods: {
    submit(formData) {
      this.$store.dispatch("loginCheckA").then(() => {
        const uid = this.$store.getters.getUid;
        const name = this.$store.getters.getName;
        const issuer = {
          uid: uid,
          name: name,
        };
        formData.append("issuer", JSON.stringify(issuer));

        issueVoucherRequest(formData)
          .then((res) => {
            console.log(res);
            if (res.status) {
              this.approveDirectly(res.result);
            } else {
              this.$buefy.notification.open({
                message:
                  "선물에 실패했습니다. 서버 내부 오류입니다. 관리자에게 문의해주세요.",
                type: "is-danger",
                duration: 3000,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            this.$buefy.notification.open({
              message: `오류가 발생했습니다: ${err.message}`,
              type: "is-danger",
              duration: 3000,
            });
          });
      });
    },
    approveDirectly(requestId) {
      approveVoucherRequest(requestId)
        .then((res) => {
          if (res.status) {
            this.$buefy.notification.open({
              message: "상품권 발행 및 선물이 정상 처리되었습니다.",
              type: "is-success",
              duration: 3000,
            });
            this.$router.push("/voucher/log/publish");
          } else {
            this.$buefy.notification.open({
              message: "요청에 실패했습니다.",
              type: "is-danger",
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$buefy.notification.open({
            message: `오류가 발생했습니다: ${err.message}`,
            type: "is-danger",
            duration: 3000,
          });
        });
    },
  },
};
</script>

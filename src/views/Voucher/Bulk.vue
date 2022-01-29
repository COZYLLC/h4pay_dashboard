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
import notification from "@/js/notification";
import BulkForm from "@/views/Voucher/BulkForm.vue";
import { issueVoucherRequest } from "@/networking/voucher";
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
              notification
                .show(
                  this,
                  "상품권 발행 및 선물 요청이 정상 처리되었습니다.",
                  "is-success",
                  2500
                )
                .then((_) => {
                  this.$router.push("/voucher/log/publish");
                });
            } else {
              notification
                .show(
                  this,
                  "상품권 발행 및 선물 요청에 실패했습니다. 다시 시도해주세요.",
                  "is-danger",
                  2500
                )
                .then((_) => {
                  this.$router.push("/voucher/bulk");
                });
            }
          })
          .catch((err) => {
            notification
              .show(
                this,
                `오류가 발생했습니다: ${err.message}`,
                "is-danger",
                2500
              )
              .then((_) => {
                this.$router.push("/voucher/bulk");
              });
          });
      });
    },
  },
};
</script>

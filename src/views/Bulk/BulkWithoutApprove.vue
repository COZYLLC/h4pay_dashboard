<template>
  <BulkForm @submit="submit" @submitWithExcel="submitWithExcel" />
</template>
<script>
import BulkForm from "./BulkForm.vue";
import {
  bulkRequest,
  bulkRequestWithExcel,
  approveRequest,
} from "@/networking/bulk";
export default {
  components: {
    BulkForm,
  },
  methods: {
    submit(data) {
      console.log("non-excel");

      bulkRequest(data)
        .then((res) => {
          if (res.status) {
            this.approveDirectly(res.result.id);
          } else {
            notification
              .show(
                this,
                `오류가 발생했습니다: ${res.message}`,
                "is-danger",
                2500
              )
              .then((_) => {
                this.$router.push("/gift");
              });
          }
        })
        .catch((err) => {
          notification
            .show(
              this,
              `오류가 발생했습니다: ${err.response.message}`,
              "is-danger",
              2500
            )
            .then((_) => {
              this.$router.push("/gift");
            });
          this.$router.push("/gift");
        });
    },
    submitWithExcel(data) {
      if (
        typeof data.get("excel") == "function" &&
        data.get("excel") == undefined
      ) {
        alert("파일을 업로드해주세요!");
      } else {
        bulkRequestWithExcel(data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
          .then((res) => {
            console.log(res);
            if (res.status && res.result.id != null) {
              this.approveDirectly(res.result.id);
            } else {
              notification
                .show(
                  this,
                  `오류가 발생했습니다: ${res.message}`,
                  "is-danger",
                  2500
                )
                .then((_) => {
                  this.$router.push("/gift");
                });
            }
          })
          .catch((err) => {
            notification
              .show(
                this,
                `오류가 발생했습니다: ${err.response.message}`,
                "is-danger",
                2500
              )
              .then((_) => {
                this.$router.push("/gift");
              });
          });
      }
    },
    approveDirectly(requestId) {
      approveRequest(requestId).then((res) => {
        if (res.status) {
          this.$buefy.notification.open({
            message: "정상 처리되었습니다.",
            type: "is-primary",
            duration: 1000,
          });
          this.$router.push("/gift");
        } else {
          this.$buefy.notification.open({
            message: "대량선물 처리에 실패했습니다. 개발자에게 문의 바랍니다.",
            type: "is-primary",
            duration: 1000,
          });
          this.$router.push("/gift");
        }
      });
    },
  },
};
</script>

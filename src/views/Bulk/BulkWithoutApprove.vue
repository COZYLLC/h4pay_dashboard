<template>
  <BulkForm @submit="submit" @submitWithExcel="submitWithExcel" />
</template>
<script>
import BulkForm from "./BulkForm.vue";
export default {
  components: {
    BulkForm,
  },
  methods: {
    submit(data) {
      console.log("non-excel");

      this.$axios
        .post(`${process.env.VUE_APP_API_URL}/bulk/request/`, data)
        .then((res) => {
          if (res.status == 200 && res.data.status) {
            this.approveDirectly(res.data.id);
          } else {
            alert(res.data.message);
            this.$router.push("/gift");
          }
        })
        .catch((err) => {
          alert(`오류가 발생했습니다: ${err.message}`);
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
        this.$axios
          .post(`${process.env.VUE_APP_API_URL}/bulk/request`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            console.log(res);
            if (res.data.status == true && res.data.id != null) {
              this.approveDirectly(res.data.id);
            } else {
              alert(res.data.message);
            }
          })
          .catch((error) => {
            alert(error.status);
          });
      }
    },
    approveDirectly(requestId) {
      this.$axios
        .post(`${process.env.VUE_APP_API_URL}/bulk/${requestId}/approve`)
        .then((res) => {
          if (res.data.status) {
            this.$buefy.notification.open({
              message: "정상 처리되었습니다.",
              type: "is-primary",
              duration: 1000,
            });
            this.$router.push("/gift");
          } else {
            this.$buefy.notification.open({
              message:
                "대량선물 처리에 실패했습니다. 개발자에게 문의 바랍니다.",
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
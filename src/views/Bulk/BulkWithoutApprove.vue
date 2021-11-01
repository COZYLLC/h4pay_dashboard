<template>
  <BulkForm @submit="submit" />
</template>
<script>
import BulkForm from "./BulkForm.vue";
export default {
  components: {
    BulkForm,
  },
  methods: {
    submit(data) {
      if (typeof data.get("excel") == "function") {
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
            this.$Sentry.captureException(error);
            alert(error.status);
          });
      }
    },
    approveDirectly(requestId) {
        const data = {
            id: 'noPayment',
        }
      this.$axios
        .post(`${process.env.VUE_APP_API_URL}/v2/bulk/${requestId}/approve`,data)
        .then((res) => {
          console.log(res);
        });
    },
  },
};
</script>
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
            if (res.data.status == true) {
              alert("제출이 완료되었습니다. 빠른 시일 내에 답변드리겠습니다.");
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
  },
};
</script>

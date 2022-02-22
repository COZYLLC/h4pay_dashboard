<template>
  <BulkForm @submit="submit" @submitWithExcel="submitExcel" />
</template>
<script>
import BulkForm from "./BulkForm.vue";
import { bulkRequest, bulkRequestWithExcel } from "@/networking/bulk";
export default {
  components: {
    BulkForm,
  },
  methods: {
    submit(data) {
      console.log("non-excel");
      console.log(data);
      bulkRequest(data)
        .then((res) => {
          if (res.status == 200 && res.status) {
            alert("제출이 완료되었습니다. 빠른 시일 내에 답변드리겠습니다.");
            this.$router.push("/gift");
          } else {
            alert(res.message);
            this.$router.push("/gift");
          }
        })
        .catch((err) => {
          alert(`오류가 발생했습니다: ${err.message}`);
          this.$router.push("/gift");
        });
    },
    submitExcel(data) {
      console.log("excel");
      if (typeof data.get("excel") == "function") {
        alert("파일을 업로드해주세요!");
      } else {
        bulkRequestWithExcel(data)
          .then((res) => {
            console.log(res);
            if (res.status) {
              alert("제출이 완료되었습니다. 빠른 시일 내에 답변드리겠습니다.");
              this.$router.push("/gift");
            } else {
              alert(res.message);
              this.$router.push("/gift");
            }
          })
          .catch((error) => {
            console.log(error);
            alert(error.status);
            this.$router.push("/gift");
          });
      }
    },
  },
};
</script>

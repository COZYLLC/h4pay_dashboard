<template>
  <div v-if="checkedRows.length >= 1" class="has-text-right">
    <b-button class="is-success" @click="_approveUser"> 승인 </b-button>
    <b-button class="is-danger" style="margin-left: 10px" @click="_rejectUser">
      거절
    </b-button>
  </div>
</template>

<script>
import { approveUser, rejectUser } from "../../networking/users";
import notification from "@/js/notification";
export default {
  props: ["checkedRows"],
  methods: {
    _approveUser() {
      approveUser(this.checkedRows)
        .then((res) => {
          if (res.status) {
            notification
              .show(this, "가입 승인이 완료되었습니다!", "is-success", 2500)
              .then((_) => {
                this.$router.push("/admin");
              });
          }
        })
        .catch((e) => {
          notification.show(
            this,
            `가입 거절에 실패했습니다: ${e.response.message}`,
            "is-danger",
            2500
          );
        });
    },
    _rejectUser() {
      rejectUser(this.checkedRows)
        .then((res) => {
          if (res.status) {
            notification
              .show(this, "가입 거절이 완료되었습니다.", "is-success", 2500)
              .then((_) => {
                this.$router.push("/admin");
              });
          }
        })
        .catch((e) => {
          notification.show(
            this,
            `가입 거절에 실패했습니다: ${e}`,
            "is-danger",
            2500
          );
        });
    },
  },
};
</script>
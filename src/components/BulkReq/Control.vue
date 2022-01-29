<template>
  <div v-if="checkedRows.length == 1" class="has-text-right">
    <!--     <b-button class="is-primary" @click="modalActive = true"
      >지출품의서 다운로드</b-button
    > -->
    <div v-if="!checkedRows[0].approved">
      <b-button class="is-success" style="margin-left: 10px" @click="payment">
        승인
      </b-button>
      <!--      <b-button class="is-danger" style="margin-left: 10px" @click="remove">
        거부
      </b-button> -->
    </div>
  </div>
</template>

<script>
import { loadTossPayments } from "@tosspayments/sdk";
import orderIdgen from "@/js/orderidgen";
import notification from "@/js/notification";

export default {
  props: ["type", "checkedRows"],
  data() {
    return {
      modalActive: false,
      formProps: {},
      title: "",
      product: "",
    };
  },
  methods: {
    saveToLocalStorage(orderId, amount) {
      localStorage.setItem(
        "tempApprove",
        JSON.stringify({
          orderId: orderId,
          requestId: this.checkedRows[0].id,
          amount: amount,
        })
      );
    },
    async payment() {
      const request = this.checkedRows[0];
      if (this.type != "voucher" && this.type != "gift") {
        notification
          .show(this, "대량선물 승인에 실패했습니다.", "is-danger", 2500)
          .then((_) => {
            this.$router.push("/");
          });
        return;
      }
      const orderId =
        (this.type == "voucher" ? 3 : this.type == "gift" ? 2 : null) +
        orderIdgen.orderIdgen();
      const amount =
        this.type == "gift"
          ? request.amount
          : this.type == "voucher"
          ? request.amount * request.targets.length
          : null;
      this.saveToLocalStorage(orderId, amount);
      const tossPayments = await loadTossPayments(
        process.env.VUE_APP_TOSS_CLIENTKEY
      );
      tossPayments
        .requestPayment("카드", {
          amount: amount,
          orderId: orderId,
          orderName: "서전고 사회적협동조합 대량선물",
          customerName: this.checkedRows[0].senderName,
          successUrl: window.location.origin + "/success",
          failUrl: window.location.origin + "/fail",
          flowMode: "DEFAULT",
        })
        .catch((error) => {
          console.log(error);
        });
    },
    remove() {},
  },
};
</script>

<template>
  <div v-if="checkedRows.length != 0" class="has-text-right">
    <!--     <b-button class="is-primary" @click="modalActive = true"
      >지출품의서 다운로드</b-button
    > -->
    <div v-if="checkedRows">
      <b-button class="is-primary" style="margin-left: 10px" @click="payment">
        승인
      </b-button>
    </div>
  </div>
</template>

<script>
import { loadTossPayments } from "@tosspayments/sdk";
import orderIdgen from "@/js/orderidgen";

export default {
  props: ["checkedRows", "type"],
  data() {
    return {
      modalActive: false,
      formProps: {},
      title: "",
      product: "",
    };
  },
  methods: {
    saveToLocalStorage(orderId) {
      localStorage.setItem(
        "tempApprove",
        JSON.stringify({
          orderId: orderId,
          requestId: this.checkedRows[0].id,
          amount: this.checkedRows[0].amount,
        })
      );
    },
    async payment() {
      const orderId = "2" + orderIdgen.orderIdgen();
      this.saveToLocalStorage(orderId);
      const tossPayments = await loadTossPayments(
        process.env.VUE_APP_TOSS_CLIENTKEY
      );
      tossPayments
        .requestPayment("카드", {
          amount: this.checkedRows[0].amount,
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
  },
};
</script>

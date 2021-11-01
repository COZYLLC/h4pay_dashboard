<template>
  <div />
</template>
<script>
export default {
  data() {
    return {
      orderId: "",
      paymentKey: "",
      amount: "",
    };
  },
  created() {
    this.getParams();
    this.approveBulk();
  },
  methods: {
    getParams() {
      this.orderId = this.$route.query.orderId;
      this.paymentKey = this.$route.query.paymentKey;
      this.amount = this.$route.query.amount;
    },
    approveBulk() {
      const tempOrder = JSON.parse(localStorage.getItem("tempApprove"));
      console.log(tempOrder);
      console.log(this.amount);
      if (
        tempOrder.orderId == this.orderId &&
        tempOrder.amount == this.amount
      ) {
        this.$axios
          .post(
            `${process.env.VUE_APP_API_URL}/bulk/${tempOrder.requestId}/approve`,
            {
              paymentKey: this.paymentKey,
              orderId: this.orderId,
            }
          )
          .then((res) => {
            console.log(res);
            if (res.data.status) {
              alert("대량발주 승인에 성공했습니다!");
              this.$router.push("/");
            } else {
              alert("대량발주 승인에 실패했습니다..");
              this.$router.push("/");
            }
          });
      }
    },
  },
};
</script>
<template>
  <div />
</template>
<script>
import { approveRequest } from "@/networking/bulk";
import { approveVoucherRequest } from "@/networking/voucher";
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
    this._approveBulk();
  },
  methods: {
    getParams() {
      this.orderId = this.$route.query.orderId;
      this.paymentKey = this.$route.query.paymentKey;
      this.amount = this.$route.query.amount;
    },
    _approveGift(requestId) {
      approveRequest(requestId, {
        paymentKey: this.paymentKey,
        orderId: this.orderId,
      }).then((res) => {
        console.log(res);
        if (res.status) {
          alert("대량선물 승인에 성공했습니다!");
          this.$router.push("/");
        } else {
          alert("대량선물 승인에 실패했습니다..");
          this.$router.push("/");
        }
      });
    },
    _approveVoucher(requestId) {
      approveVoucherRequest(requestId, {
        paymentKey: this.paymentKey,
        orderId: this.orderId,
      }).then((res) => {
        console.log(res);
        if (res.status) {
          alert("대량선물 승인에 성공했습니다!");
          this.$router.push("/");
        } else {
          alert("대량선물 승인에 실패했습니다..");
          this.$router.push("/");
        }
      });
    },
    _approveBulk() {
      const tempOrder = JSON.parse(localStorage.getItem("tempApprove"));
      console.log(tempOrder);
      console.log(this.amount);
      if (
        tempOrder.orderId == this.orderId &&
        tempOrder.amount == this.amount
      ) {
        if (this.orderId.startsWith("2")) {
          this._approveGift(tempOrder.requestId);
        } else if (this.orderId.startsWith("3")) {
          this._approveVoucher(tempOrder.requestId);
        } else {
          alert("허용되지 않은 접근입니다.");
        }
      }
    },
  },
};
</script>

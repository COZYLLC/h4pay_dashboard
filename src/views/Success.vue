<template>
  <div>
    <span v-if="success == null">
      <h1>결제가 처리중입니다...</h1>
      <div id="container">
        <div id="ball-1" class="circle"></div>
        <div id="ball-2" class="circle"></div>
        <div id="ball-3" class="circle"></div>
      </div>
    </span>
    <span v-else-if="success == true">
      <h1>결제가 정상 처리되었습니다!</h1>
    </span>
    <span v-else>
      <h1>결제에 실패했습니다..</h1>
    </span>
  </div>
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
      success: null,
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
          this.success = true;
          this.$router.push("/gift");
        } else {
          alert("대량선물 승인에 실패했습니다..");
          this.success = false;
          this.$router.push("/gift/bulk/lookup");
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
          this.$router.push("/gift");
        } else {
          alert("대량선물 승인에 실패했습니다..");
          this.$router.push("/gift/bulk/lookup");
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
<style scoped>
body {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
h1 {
  font-size: 2rem;
  text-align: center;
}

.circle {
  display: inline-block;
  background-color: #4f83d6;
  height: 25px;
  width: 25px;
  border-radius: 25px;
  margin: 0 5px;
}

#container {
  height: 200px;
  margin-top: 10vh;
  text-align: center;
}

#ball-1 {
  -webkit-animation-name: bounce;
  -webkit-animation-delay: 0s;
  -webkit-animation-duration: 1.2s;
  -webkit-animation-iteration-count: infinite;
}
#ball-2 {
  -webkit-animation-name: bounce;
  -webkit-animation-delay: 0.1s;
  -webkit-animation-duration: 1.2s;
  -webkit-animation-iteration-count: infinite;
}
#ball-3 {
  -webkit-animation-name: bounce;
  -webkit-animation-delay: 0.2s;
  -webkit-animation-duration: 1.2s;
  -webkit-animation-iteration-count: infinite;
}

@-webkit-keyframes bounce {
  0% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(23px);
  }
  60% {
    transform: translateY(-25px);
  }
  80% {
    transform: translateY(0);
  }
}
</style>

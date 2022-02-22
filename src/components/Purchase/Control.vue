<template>
  <div class="has-text-right">
    <b-button
      v-if="checkedRows.length != 0 && !checkedRows[0].exchanged"
      class="is-info"
      style="margin-right: 7px"
      @click="exchange(type)"
    >
      교환
    </b-button>
    <b-button
      v-if="
        type == 'order' && checkedRows.length != 0 && !checkedRows[0].exchanged
      "
      class="is-danger"
      style="margin-right: 7px"
      @click="cancel"
    >
      취소
    </b-button>
  </div>
</template>

<script>
import { exchangeGift } from "../../networking/gift";
import { cancelOrder, exchangeOrder } from "../../networking/order";
import notification from "@/js/notification";
export default {
  props: ["checkedRows", "type"],
  data() {
    return {
      modalActive: false,
      formProps: {
        email: "evan@you.com",
        password: "testing",
      },
    };
  },
  created() {
    console.log(this.checkedRows);
  },
  methods: {
    addProduct() {
      console.log("add");
    },
    exchange() {
      let exchanged = 0;
      let orderIdArray = [];
      for (let i = 0; i < this.checkedRows.length; i++) {
        orderIdArray.push(this.checkedRows[i].orderId);
        if (this.checkedRows[i].exchanged) {
          exchanged++;
        }
      }
      if (exchanged > 0) {
        if (exchanged == orderIdArray.length) {
          this.$buefy.notification.open({
            message: "이미 교환된 구매 내역입니다.",
            type: "is-danger",
            duration: 1000,
          });
          return;
        } else {
          this.$buefy.notification.open({
            message:
              "이미 교환된 구매 내역을 포함하고 있습니다. 나머지 모두를 교환처리합니다.",
            type: "is-info",
            duration: 1000,
          });
        }
      }
      const exchangePromise =
        this.type == "order" ? exchangeOrder : exchangeGift;
      exchangePromise({
        orderId: orderIdArray,
      }).then((res) => {
        notification
          .show(
            this,
            res.message,
            res.status ? "is-primary" : "is-danger",
            2500
          )
          .then((_) => {
            this.$router.go(0);
          });
      });
    },
    cancel() {
      if (this.type == "order") {
        cancelOrder(this.checkedRows[0].orderId).then((res) => {
          notification
            .show(
              this,
              res.message,
              res.status ? "is-primary" : "is-danger",
              2500
            )
            .then((_) => {
              this.$router.go(0);
            });
        });
      }
    },
  },
};
</script>

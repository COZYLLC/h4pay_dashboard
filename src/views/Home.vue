<template>
  <div id="home">
    <div class="tile is-ancestor">
      <div class="tile">
        <div class="tile is-parent is-vertical is-6">
          <article class="tile is-child notification">
            <p class="title">최근 일주일 주문량</p>
            <chart
              v-if="loaded"
              :labels="weekly.labels"
              :datasets="weekly.ordersData"
              style="width: 25vh"
            />
          </article>
          <article class="tile is-child notification is-primary">
            <p class="title">오늘 주문량</p>
            <p class="subtitle is-2">
              {{ today.orders }}
            </p>
          </article>
        </div>
        <div class="tile is-parent is-vertical is-6">
          <article class="tile is-child notification">
            <p class="title">주간 판매금액</p>
            <chart
              v-if="loaded"
              :labels="weekly.labels"
              :datasets="weekly.priceData"
              style="width: 25vh"
            />
          </article>
          <article class="tile is-child notification is-primary">
            <p class="title">가장 많이 팔린 상품</p>
            <p class="subtitle">
              {{ weekly.manySoldProduct }}
            </p>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "../components/Chart.vue";
import { getProducts } from "../networking/product";
import { getOrders } from "../networking/order";
export default {
  components: { Chart },
  data() {
    return {
      loaded: false,
      products: [],
      today: {
        orders: 0,
      },
      weekly: {
        labels: ["", "", "", "", "", "", ""],
        ordersData: [
          {
            label: "주간 주문량",
            backgroundColor: "#f87979",
            data: [0, 0, 0, 0, 0, 0, 0],
          },
        ],
        priceData: [
          {
            label: "주간 판매금액",
            backgroundColor: "#30c8ff",
            data: [0, 0, 0, 0, 0, 0, 0],
          },
        ],
        manySoldProduct: "",
      },
    };
  },
  created() {
    getProducts().then((productRes) => {
      if (productRes.status) {
        this.products = productRes.result;
        let start = new Date();
        const end = new Date();
        console.log(end);
        start.setDate(start.getDate() - 6);
        getOrders({
          type: "date",
          start: start,
          end: end,
        }).then((res) => {
          if (res.status) {
            const orders = res.result;
            this.setTableData(orders, start);
            this.today.orders = this.getTodayOrders(orders, end);
            this.getManySoldProduct(orders);
          }
        });
      }
    });
  },
  methods: {
    setTableData(orders, start) {
      for (let i = 0; i < orders.length; i++) {
        const date = new Date(orders[i].date);
        this.$set(
          this.weekly.ordersData[0].data,
          date.getDate() - start.getDate(),
          this.weekly.ordersData[0].data[date.getDate() - start.getDate()] + 1
        );
        this.$set(
          this.weekly.priceData[0].data,
          date.getDate() - start.getDate(),
          this.weekly.priceData[0].data[date.getDate() - start.getDate()] +
            orders[i].amount
        );
      }
      for (let i = 0; i < 7; i++) {
        this.$set(this.weekly.labels, i, start.getDate() + i + "일");
      }
      this.loaded = true;
    },
    getTodayOrders(orders, end) {
      return orders.filter(
        (order) => new Date(order.date).getDate() == end.getDate()
      ).length;
    },
    getManySoldProduct(orders) {
      let qty = [];
      orders.forEach((order) => {
        const item = order.item;
        for (var key in item) {
          qty[key] = item[key];
        }
      });
      let max = [0, 0];
      qty.forEach((item, idx) => {
        if (max[1] < item) {
          max[0] = idx;
          max[1] = item;
        }
      });
      this.weekly.manySoldProduct = this.products[max[0]].productName;
    },
  },
};
</script>

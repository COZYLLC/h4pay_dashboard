<template>
  <div id="home">
    <div class="tile is-ancestor">
      <div class="tile is-vertical is-8">
        <div class="tile">
          <div class="tile is-parent is-vertical">
            <article class="tile is-child notification">
              <p class="title">최근 일주일 주문량</p>
              <chart
                v-if="loaded"
                :labels="weekly.labels"
                :datasets="weekly.datasets"
              />
            </article>
            <article class="tile is-child notification is-warning">
              <p class="title">오늘 주문량</p>
              <p class="subtitle">{{ today.orders }}</p>
            </article>
            <article class="tile is-child notification is-danger">
              <p class="title">가장 많이 팔린 상품</p>
              <p class="subtitle">{{ weekly.manySoldProduct }}</p>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child notification is-info">
              <p class="title">Middle tile</p>
              <p class="subtitle">With an image</p>
              <figure class="image is-4by3">
                <img src="https://bulma.io/images/placeholders/640x480.png" />
              </figure>
            </article>
          </div>
        </div>
        <div class="tile is-parent"></div>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child notification is-success">
          <div class="content">
            <p class="title">Tall tile</p>
            <p class="subtitle">With even more content</p>
            <div class="content"></div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "../components/Chart.vue";
export default {
  components: { Chart },
  created() {
    this.$axios
      .get(`${process.env.VUE_APP_API_URL}/product`)
      .then((productRes) => {
        if (productRes.data.status) {
          this.products = productRes.data.list;
        }
      });
    let today = new Date();
    const end = new Date();
    today.setDate(today.getDate() - 7);
    const start = today;
    this.$axios
      .post(`${process.env.VUE_APP_API_URL}/orders/filter`, {
        type: "date",
        start: start,
        end: end,
      })
      .then((res) => {
        if (res.data.status) {
          const orders = res.data.result;
          this.setTableData(orders, start);
          this.today.orders = this.getTodayOrders(orders, end);
          this.getManySoldProduct(orders);
        }
      });
  },
  methods: {
    setTableData(orders, start) {
      for (let i = 0; i < orders.length; i++) {
        const date = new Date(orders[i].date);
        this.$set(
          this.weekly.datasets[0].data,
          date.getDate() - start.getDate(),
          this.weekly.datasets[0].data[date.getDate() - start.getDate()] + 1
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
        order.item.forEach((item) => {
          if (item.qty > 0) {
            if (qty[item.id] != null) {
              qty[item.id] += item.qty;
            } else {
              qty[item.id] = item.qty;
            }
          }
        });
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
  data() {
    return {
      loaded: false,
      products: [],
      today: {
        orders: 0,
      },
      weekly: {
        labels: ["", "", "", "", "", "", ""],
        datasets: [
          {
            label: "주간 주문량",
            backgroundColor: "#f87979",
            data: [0, 0, 0, 0, 0, 0, 0],
          },
        ],
        manySoldProduct: "",
      },
    };
  },
};
</script>
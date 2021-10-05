<template>
  <div class="home">
    <p class="title is-8">이벤트 내역 조회</p>
    <p class="subtitle is-8">이벤트 내역을 조회할 수 있습니다.</p>
    <Table
      v-if="loaded"
      type="event"
      :products="products"
      :columns="columns"
      :data="data"
      :detailKey="table.detailKey"
      :checkable="false"
      :page="table.page"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import Table from "@/components/Table";
export default {
  name: "Home",
  components: {
    Table,
  },
  created() {
    this.$axios
      .get(`${process.env.VUE_APP_API_URL}/product`)
      .then((productRes) => {
        if (productRes.data.status) {
          this.products = productRes.data.list;
          this.lookup();
        }
      });
    if (this.$route.query.page == undefined) {
      if (this.$route.query.orderId) {
        this.$router.replace({ query: { page: 1 } });
      }
    } else {
      this.page = parseInt(this.$route.query.page);
    }
    let idx = this.data.findIndex(
      (element) => element.orderId == "1202109261632631132259000"
    );
    this.checkedRows[0] = this.data[idx];
    this.page = Math.ceil(idx / 10);
  },
  methods: {
    lookup() {
      this.$axios
        .get(`${process.env.VUE_APP_API_URL}/event/`)
        .then((eventRes) => {
          console.log(eventRes);
          if (eventRes.data.result != null) {
            this.data = eventRes.data.result;
            this.loaded = true;
          }
        });
    },
  },
  data() {
    return {
      loaded: false,
      data: [],
      products: [],
      table: {
        detailKey: "id",
        page: 1,
      },
      columns: [
        {
          field: "id",
          label: "이벤트 번호",
        },
        {
          field: "name",
          label: "이벤트명",
        },
        {
          field: "amount",
          label: "할인금액",
        },
        {
          field: "start",
          label: "시작 일시",
        },
        {
          field: "end",
          label: "종료 일시",
        },
        {
          field: "totalqty",
          label: "총 수량",
        },
        {
          field: "qty",
          label: "교환 된 수량",
        },
      ],
    };
  },
};
</script>

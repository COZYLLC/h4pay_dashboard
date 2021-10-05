<template>
  <div class="home">
    <p class="title is-8">주문 내역 조회</p>
    <p class="subtitle is-8">
      주문 내역을 날짜 범위, ID를 조건으로 이용해 조회할 수 있습니다.
    </p>
    <b-field label="주문 내역 날짜 범위 선택" grouped>
      <b-datepicker v-model="selectedStart" :mobile-native="false">
        <template v-slot:trigger>
          <b-button icon-left="calendar" type="is-primary" />
        </template>
      </b-datepicker>
      <b-input expanded readonly :value="startString" />
      <b-datepicker v-model="selectedEnd" :mobile-native="false">
        <template v-slot:trigger>
          <b-button icon-left="calendar" type="is-primary" />
        </template>
      </b-datepicker>
      <b-input expanded readonly :value="endString" />
    </b-field>

    <b-field label="ID로 검색">
      <b-input type="text" v-model="id"></b-input>
    </b-field>
    <b-button @click="findOrder" type="is-primary">조회</b-button>
    <Table
      v-if="loaded"
      type="order"
      :products="products"
      :columns="columns"
      :data="data"
      :detailKey="table.detailKey"
      :checkable="true"
    />
    <table-loading v-else-if="loaded == false" />
  </div>
</template>

<script>
// @ is an alias to /src
import Table from "@/components/Table";
import TableLoading from "../components/TableLoading.vue";
export default {
  name: "Home",
  components: {
    Table,
    TableLoading,
  },
  created() {
    this.$axios
      .get(`${process.env.VUE_APP_API_URL}/product`)
      .then((productRes) => {
        if (productRes.data.status) {
          this.products = productRes.data.list;
          if (this.$route.query.orderId != null) {
            this.findOrder();
          }
        }
      });
  },
  methods: {
    setCheckedRows(value) {
      this.checkedRows = value;
    },
    setPage(value) {
      this.page = value;
    },
    findOrder() {
      let data = {};
      if (this.selectedStart != null && this.selectedEnd != null) {
        // 날짜 범위 있음
        if (this.id == "") {
          // id가 비어 있으면
          data = {
            type: "date",
            start: this.selectedStart,
            end: this.selectedEnd,
          };
        } else {
          // 아니면
          data = {
            type: "all",
            start: this.selectedStart,
            end: this.selectedEnd,
            uid: this.id,
          };
        }
      } else if (this.selectedStart == null && this.selectedEnd == null) {
        // 날짜 범위 없음
        if (this.id == "") {
          data = {
            type: "null",
          };
        } else {
          data = {
            type: "uid",
            uid: this.id,
          };
        }
      }
      console.log(data);
      this.$axios
        .post(`${process.env.VUE_APP_API_URL}/orders/filter`, data)
        .then((orderRes) => {
          console.log(orderRes);
          if (orderRes.data.status) {
            this.data = orderRes.data.result.reverse();
            this.loaded = true;
            this.$buefy.notification.open({
              message: "조회에 성공했습니다!",
              type: "is-primary",
              duration: 1000,
            });
          }
        });
    },
  },
  computed: {
    startString() {
      return this.selectedStart ? this.selectedStart.toLocaleDateString() : "";
    },
    endString() {
      return this.selectedEnd ? this.selectedEnd.toLocaleDateString() : "";
    },
  },
  data() {
    return {
      selectedStart: null,
      selectedEnd: null,
      id: "",
      loaded: null,
      data: [],
      products: [],
      table: {
        detailKey: "orderId",
        page: 1,
        checkedRows: [],
      },
      columns: [
        {
          field: "orderId",
          label: "주문번호",
          width: 1,
        },
        {
          field: "uid",
          label: "주문자 ID",
        },
        {
          field: "amount",
          label: "결제금액",
        },
        {
          field: "date",
          label: "주문 일시",
        },
        {
          field: "expire",
          label: "교환 만료 일시",
        },
        {
          field: "exchanged",
          label: "교환 여부",
        },
      ],
    };
  },
};
</script>

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
        }
      });
  },
  methods: {
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
      console.log(data)
      this.$axios
        .post(`${process.env.VUE_APP_API_URL}/orders/filter`, data)
        .then((orderRes) => {
          console.log(orderRes)
          if (orderRes.data.status) {
            this.data = orderRes.data.result;
            this.loaded = true;
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
      loaded: false,
      data: [],
      products: [],
      table: {
        detailKey: "orderid",
      },
      columns: [
        {
          field: "orderid",
          label: "주문번호",
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

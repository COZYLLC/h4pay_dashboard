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
      <b-input v-model="id" type="text"></b-input>
    </b-field>
    <b-button type="is-primary" @click="findOrder">
      {{ notInputed ? "전체 조회" : "조회" }}
    </b-button>
    <Table
      v-if="loaded"
      type="order"
      :products="products"
      :columns="columns"
      :data="data"
      :detail-key="table.detailKey"
      :checkable="true"
    >
      <template v-slot:detail="props">
        <PurchaseDetail :item="props.row.item" :products="products" />
      </template>
      <template v-slot:control="props">
        <PurchaseControl type="order" :checked-rows="props.checkedRows" />
      </template>
    </Table>
    <table-loading v-else-if="loaded == false" />
  </div>
</template>

<script>
// @ is an alias to /src
import dateUtil from "@/js/dateUtil.js";
import Table from "@/components/Table";
import TableLoading from "../components/TableLoading.vue";
import PurchaseDetail from "@/components/Purchase/Detail.vue";
import PurchaseControl from "@/components/Purchase/Control.vue";
import { getProducts } from "../networking/product";
import { getOrders } from "../networking/order";
export default {
  components: {
    Table,
    TableLoading,
    PurchaseDetail,
    PurchaseControl,
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
  computed: {
    notInputed() {
      return (
        this.selectedStart == null && this.selectedEnd == null && this.id == ""
      );
    },
    startString() {
      return this.selectedStart ? this.selectedStart.toLocaleDateString() : "";
    },
    endString() {
      return this.selectedEnd ? this.selectedEnd.toLocaleDateString() : "";
    },
  },
  created() {
    getProducts().then((productRes) => {
      if (productRes.status) {
        this.products = productRes.result;
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
      if (this.selectedStart != null && this.selectedEnd != null) {
        this.selectedEnd = dateUtil.addTime(this.selectedEnd, 23, 59, 59);
      }
      getOrders({
        dateFrom:
          this.selectedStart != null
            ? this.selectedStart.toISOString()
            : undefined,
        dateTo:
          this.selectedEnd != null ? this.selectedEnd.toISOString() : undefined,
        uid: this.id,
      }).then((orderRes) => {
        console.log(orderRes);
        if (orderRes.status) {
          this.data = orderRes.result.reverse();
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
};
</script>

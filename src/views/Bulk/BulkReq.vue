<template>
  <div class="home">
    <p class="title is-8">대량선물 요청 조회</p>
    <p class="subtitle is-8">
      대량선물 요청 내역을 날짜 범위, ID를 조건으로 이용해 조회할 수 있습니다.
    </p>
    <b-field label="요청 내역 날짜 범위 선택" grouped>
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
    <b-button type="is-primary" @click="findRequest">
      {{ notInputed ? "전체 조회" : "조회" }}
    </b-button>
    <Table
      v-if="loaded"
      type="bulkreq"
      :products="products"
      :columns="columns"
      :data="data"
      :detail-key="table.detailKey"
      :checkable="true"
    >
      <template v-slot:detail="props">
        <BulkReqDetail :targets="props.row.targets" :products="products" />
      </template>
      <template v-slot:control="props">
        <BulkReqControl type="gift" :checked-rows="props.checkedRows" />
      </template>
    </Table>
    <table-loading v-else-if="loaded == false" />
  </div>
</template>

<script>
// @ is an alias to /src
import Table from "@/components/Table";
import TableLoading from "../../components/TableLoading.vue";
import BulkReqDetail from "@/components/BulkReq/Detail";
import BulkReqControl from "@/components/BulkReq/Control";
import dateUtil from "@/js/dateUtil.js";
import { getBulkRequests } from "@/networking/bulk";
import { getProducts } from "../../networking/product";

export default {
  name: "Home",
  components: {
    Table,
    TableLoading,
    BulkReqDetail,
    BulkReqControl,
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
        detailKey: "id",
        page: 1,
        checkedRows: [],
      },
      columns: [
        {
          field: "id",
          label: "요청ID",
          width: 1,
        },
        {
          field: "senderUid",
          label: "주문자 ID",
        },
        {
          field: "date",
          label: "요청 일시",
        },
        {
          field: "approved",
          label: "승인 여부",
        },
        {
          field: "amount",
          label: "결제 금액",
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
        this.products = productRes.result.reverse();
        if (this.$route.query.orderId != null) {
          this.findRequest();
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
    findRequest() {
      let data = {};
      console.log(data);
      if (this.selectedEnd != null) {
        this.selectedEnd = dateUtil.addTime(this.selectedEnd, 23, 59, 59);
      }
      getBulkRequests({
        dateFrom:
          this.selectedStart != null
            ? this.selectedStart.toISOString()
            : undefined,
        dateTo:
          this.selectedEnd != null ? this.selectedEnd.toISOString() : undefined,
        issuer: this.id || undefined,
        amountMin: this.amountMin || undefined,
        amountMax: this.amountMax || undefined,
      }).then((res) => {
        console.log(res);
        if (res.status) {
          this.data = res.result;
          this.loaded = true;
          this.$buefy.notification.open({
            message: "조회에 성공했습니다!",
            type: "is-primary",
            duration: 1000,
          });
        } else {
          this.$buefy.notification.open({
            message: `조회에 실패했습니다: ${res.message}`,
            type: "is-danger",
            duration: 2500,
          });
        }
      });
    },
  },
};
</script>

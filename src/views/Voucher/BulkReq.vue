<template>
  <div class="home">
    <p class="title is-8">상품권 선물 요청 조회</p>
    <p class="subtitle is-8">
      상품권 선물 요청 내역을 날짜 범위, ID를 조건으로 이용해 조회할 수
      있습니다.
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
    <b-button type="is-primary" @click="findRequest"> 조회 </b-button>
    <Table
      v-if="loaded"
      type="voucherReq"
      :products="products"
      :columns="columns"
      :data="data"
      :detail-key="table.detailKey"
      :checkable="true"
    >
      <template v-slot:detail="props">
        <BulkReqDetail :names="props.row.names" :targets="props.row.targets" />
      </template>
    </Table>
    <table-loading v-else-if="loaded == false" />
  </div>
</template>

<script>
import Table from "@/components/Table";
import TableLoading from "../../components/TableLoading.vue";
export default {
  name: "Home",
  components: {
    Table,
    TableLoading,
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
          field: "issuerId",
          label: "요청자 ID",
        },
        {
          field: "issuerName",
          label: "요청자 이름",
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
          label: "상품권 금액",
        },
        {
          field: "qty",
          label: "요청 개수",
        },
      ],
    };
  },
  computed: {
    startString() {
      return this.selectedStart ? this.selectedStart.toLocaleDateString() : "";
    },
    endString() {
      return this.selectedEnd ? this.selectedEnd.toLocaleDateString() : "";
    },
  },
  created() {
    this.$axios
      .get(`${process.env.VUE_APP_API_URL}/product`)
      .then((productRes) => {
        if (productRes.data.status) {
          this.products = productRes.data.list.reverse();
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
      this.loaded = true;
      this.$axios
        .get(`${process.env.VUE_APP_API_URL}/bulk/request/`)
        .then((requestRes) => {
          console.log(requestRes);
          if (requestRes.data.status) {
            this.data = requestRes.data.result;
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

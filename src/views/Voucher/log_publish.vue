<template>
  <div class="home">
    <p class="title is-8">상품권 발행 기록 조회</p>
    <p class="subtitle is-8">
      상품권 발행 기록을 조건과 함께 조회할 수 있습니다.
    </p>
    <b-field label="발행일시 범위 선택" grouped>
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
    <b-button type="is-primary" @click="findVoucher">
      {{ notInputed ? "전체 조회" : "조회" }}
    </b-button>

    <Table
      v-if="loaded"
      type="voucher"
      :products="products"
      :columns="columns"
      :data="data"
      :detail-key="table.detailKey"
      :checkable="true"
    >
      <template v-slot:detail="props">
        <VoucherDetail :voucher="props.row" />
      </template>
      <template v-slot:control="props">
        <VoucherControl :checked-rows="props.checkedRows" />
      </template>
    </Table>
    <table-loading v-else-if="loaded == false" />
  </div>
</template>

<script>
import Table from "@/components/Table";
import TableLoading from "@/components/TableLoading.vue";
import VoucherDetail from "@/components/Voucher/Detail.vue";
import VoucherControl from "@/components/Voucher/Control.vue";
import dateUtil from "@/js/dateUtil.js";
import { getProducts } from "../../networking/product";
import { getVouchers } from "@/networking/voucher";

export default {
  name: "Home",
  components: {
    Table,
    TableLoading,
    VoucherDetail,
    VoucherControl,
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
          label: "일련번호",
          width: 1,
        },
        {
          field: "issuer",
          label: "발행인",
        },
        {
          field: "receiver",
          label: "수신인",
        },
        {
          field: "amount",
          label: "액면가",
        },
        {
          field: "date",
          label: "발행일시",
        },
        {
          field: "expire",
          label: "사용기한",
        },
        {
          field: "exchanged",
          label: "사용 여부",
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
          this.findVoucher();
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
    findVoucher() {
      if (this.selectedEnd != null)
        this.selectedEnd = dateUtil.addTime(this.selectedEnd, 23, 59, 59);

      getVouchers({
        dateFrom:
          this.selectedStart != null
            ? this.selectedStart.toISOString()
            : undefined,
        dateTo:
          this.selectedEnd != null ? this.selectedEnd.toISOString() : undefined,
        issuer: this.id || undefined,
        amountMin: this.amountMin || undefined,
        amountMax: this.amountMax || undefined,
      }).then((requestRes) => {
        console.log(requestRes);
        if (requestRes.status) {
          this.data = requestRes.result;
          this.loaded = true;
          if (this.selectedEnd != null)
            this.selectedEnd = dateUtil.addTime(
              this.selectedEnd,
              -23,
              -59,
              -59
            );
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

<template>
  <div class="home">
    <p class="title is-8">상품권 발행 기록 조회</p>
    <p class="subtitle is-8">
      상품권 발행 기록을 조건과 함께 조회할 수 있습니다.
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
    <b-button type="is-primary" @click="findVoucher"> 조회 </b-button>

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
        .get(`${process.env.VUE_APP_API_URL}/voucher/request/`)
        .then((requestRes) => {
          console.log(requestRes);
          if (requestRes.data.status) {
            //this.data = requestRes.data.result;
            this.data = [
              {
                id: "32021120142342343243334",
                issuer: {
                  uid: "chiwon0923",
                  name: "송치원",
                },
                amount: 5000,
                message: "우수 동아리 선정",
                date: new Date(),
                expire: new Date(),
                exchanged: false,
                item: {
                  4: 5,
                },
              },
            ];
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

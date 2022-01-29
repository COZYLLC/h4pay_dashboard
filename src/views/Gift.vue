<template>
  <div class="home">
    <p class="title is-8">선물 내역 조회</p>
    <p class="subtitle is-8">
      선물 내역을 날짜 범위, ID를 조건으로 이용해 조회할 수 있습니다.
    </p>
    <b-field label="선물 내역 날짜 범위 선택" grouped>
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
      <div class="columns">
        <div class="column">
          <b-field label="발송자 ID">
            <b-input
              v-model="uidfrom"
              type="text"
              :disabled="isMassiveGift"
            ></b-input>
          </b-field>
        </div>
        <div class="column">
          <b-field label="수신자 ID">
            <b-input
              v-model="uidto"
              type="text"
              :disabled="isMassiveGift"
            ></b-input>
          </b-field>
        </div>
      </div>
    </b-field>
    <b-field label="대량선물 옵션">
      <b-radio v-model="isMassiveGift" name="name" :native-value="true">
        대량선물만 조회
      </b-radio>
      <b-radio v-model="isMassiveGift" name="name" :native-value="false">
        일반 선물만 조회
      </b-radio>
      <b-radio v-model="isMassiveGift" name="name" :native-value="null">
        모두 조회
      </b-radio>
    </b-field>
    <b-button type="is-primary" @click="findGift">
      {{ notInputed ? "전체 조회" : "조회" }}
    </b-button>
    <Table
      v-if="loaded"
      type="gift"
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
        <PurchaseControl type="gift" :checked-rows="props.checkedRows" />
      </template>
    </Table>
    <table-loading v-else-if="loaded == false" />
  </div>
</template>

<script>
import dateUtil from "@/js/dateUtil.js";
import Table from "@/components/Table";
import TableLoading from "../components/TableLoading.vue";
import PurchaseDetail from "@/components/Purchase/Detail.vue";
import PurchaseControl from "@/components/Purchase/Control.vue";
import { getProducts } from "../networking/product";
import { getGifts } from "../networking/gift";

export default {
  components: {
    Table,
    TableLoading,
    PurchaseDetail,
    PurchaseControl,
  },
  data() {
    return {
      isMassiveGift: false,
      loaded: null,
      selectedStart: null,
      selectedEnd: null,
      uidfrom: null,
      uidto: null,
      data: [],
      products: [],
      table: {
        detailKey: "orderId",
      },
      columns: [
        {
          field: "orderId",
          label: "주문번호",
        },
        {
          field: "uidfrom",
          label: "발송인 ID",
        },
        {
          field: "uidto",
          label: "수신인 ID",
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
        this.selectedStart == null &&
        this.selectedEnd == null &&
        this.uidfrom == null &&
        this.uidto == null
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
          this.findGift();
        }
      }
    });
  },
  methods: {
    findGift() {
      this.loaded = false;

      let data = {};
      if (this.isMassiveGift == true) {
        this.uidfrom = "massiveGift";
      }
      if (this.selectedStart != null && this.selectedEnd != null) {
        this.selectedEnd = dateUtil.addTime(this.selectedEnd, 23, 59, 59);
      }
      getGifts({
        dateFrom:
          this.selectedStart != null
            ? this.selectedStart.toISOString()
            : undefined,
        dateTo:
          this.selectedEnd != null ? this.selectedEnd.toISOString() : undefined,
        uidFrom: this.uidfrom,
        uidTo: this.uidto,
      }).then((giftRes) => {
        if (giftRes.status) {
          this.data = giftRes.result;
          console.log(this.isMassiveGift);
          if (this.isMassiveGift == false) {
            this.data = this.data
              .filter((gift) => gift.uidfrom != "massiveGift")
              .reverse();
          }
          this.loaded = true;
        }
      });
    },
  },
};
</script>

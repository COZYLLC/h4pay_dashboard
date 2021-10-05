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
              type="text"
              v-model="uidfrom"
              :disabled="isMassiveGift"
            ></b-input>
          </b-field>
        </div>
        <div class="column">
          <b-field label="수신자 ID">
            <b-input
              type="text"
              v-model="uidto"
              :disabled="isMassiveGift"
            ></b-input>
          </b-field>
        </div>
      </div>
    </b-field>
    <b-field label="대량발주 옵션">
      <b-radio v-model="isMassiveGift" name="name" :native-value="true">
        대량발주만 조회
      </b-radio>
      <b-radio v-model="isMassiveGift" name="name" :native-value="false">
        일반 선물만 조회
      </b-radio>
      <b-radio v-model="isMassiveGift" name="name" :native-value="null">
        모두 조회
      </b-radio>
    </b-field>
    <b-button @click="findGift" type="is-primary">조회</b-button>
    <Table
      v-if="loaded"
      type="gift"
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
          this.products = productRes.data.list
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
        console.log("날짜 범위 있음");
        // 날짜 범위 있음
        if (this.uidfrom != null || this.uidto != null) {
          console.log("ID 있음");
          // ID중 하나라도 비어있지 않으면
          data = {
            type: "all",
            start: this.selectedStart,
            end: this.selectedEnd,
            uidfrom: this.uidfrom,
            uidto: this.uidto,
          };
        } else {
          console.log("ID 없음");

          // 모두 다 비어있으면
          data = {
            type: "date",
            start: this.selectedStart,
            end: this.selectedEnd,
          };
        }
      } else if (this.selectedStart == null && this.selectedEnd == null) {
        console.log("날짜 범위 없음");

        // 날짜 범위 없음
        if (this.uidfrom != null || this.uidto != null) {
          data = {
            type: "uid",
            uidfrom: this.uidfrom,
            uidto: this.uidto,
          };
          // ID중 하나라도 비어있지 않으면
          console.log("ID 있음");
        } else {
          // 모두 다 비어있으면
          data = {
            type: "null",
          };
          console.log("ID 없음");
        }
      }
      console.log(data);
      this.$axios
        .post(`${process.env.VUE_APP_API_URL}/gift/filter`, data)
        .then((giftRes) => {
          if (giftRes.data.status) {
            this.data = giftRes.data.result;
            console.log(this.isMassiveGift);
            if (this.isMassiveGift == false) {
              this.data = this.data.filter(
                (gift) => gift.uidfrom != "massiveGift"
              ).reverse();
            }
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
};
</script>

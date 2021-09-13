<template>
  <div class="home">
    <p class="title is-8">주문 내역 조회</p>
    <p class="subtitle is-8">
      주문 내역을 날짜 범위, ID를 조건으로 이용해 조회할 수 있습니다.
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
      <b-field label="발송자 ID">
        <b-input type="text" v-model="id" :disabled="isMassiveGift"></b-input>
      </b-field>
      <b-field label="수신자 ID">
        <b-input type="text" v-model="id" :disabled="isMassiveGift"></b-input>
      </b-field>
    </b-field>
    <b-field label="대량발주 옵션">
      <b-radio v-model="isMassiveGift" name="name" :native-value="true">
        대량발주만 조회
      </b-radio>
      <b-radio v-model="isMassiveGift" name="name" :native-value="false">
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
    findGift() {
      let data = {};
      if (this.isMassiveGift == true) {
        this.id = "massiveGift";
      } else {
        this.id = "";
      }
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
            uidfrom: this.id,
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
            uidfrom: this.id,
          };
        }
      }
      console.log(data);
      this.$axios
        .post(`${process.env.VUE_APP_API_URL}/gift/filter`, data)
        .then((giftRes) => {
          if (giftRes.data.status) {
            console.log(giftRes);
            this.data = giftRes.data.result;
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
      loaded: false,
      selectedStart: null,
      selectedEnd: null,
      id: "",
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
          field: "uidfrom",
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

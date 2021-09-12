<template>
  <div class="home">
    <p class="title is-8">주문 내역 조회</p>
    <p class="subtitle is-8">
      주문 내역을 날짜 범위, ID를 조건으로 이용해 조회할 수 있습니다.
    </p>
    <b-field label="주문 날짜 범위 선택">
      <b-datepicker ref="datepicker_start" expanded placeholder="시작" />
      <b-button
        @click="$refs.datepicker_start.toggle()"
        icon-left="calendar"
        type="is-primary"
      />
      <div style="width: 4%" />
      <b-datepicker ref="datepicker_end" expanded placeholder="끝" />
      <b-button
        @click="$refs.datepicker_end.toggle()"
        icon-left="calendar"
        type="is-primary"
      />
    </b-field>
    <b-field label="ID로 검색">
      <b-input type="text"></b-input>
    </b-field>
    <b-button @click="$refs.datepicker_end.toggle()" type="is-primary"
      >조회</b-button
    >
    <Table
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
          this.$axios
            .get(`https://yoon-lab.xyz:23408/api/gift/`)
            .then((giftRes) => {
              console.log(giftRes);
              if (giftRes.data != null) {
                this.data = giftRes.data;
              }
            });
        }
      });
  },
  data() {
    return {
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

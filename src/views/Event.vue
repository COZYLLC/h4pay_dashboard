<template>
  <div class="home">
    <p class="title is-8">이벤트 내역 조회</p>
    <p class="subtitle is-8">
      이벤트 내역을 날짜 범위, ID를 조건으로 이용해 조회할 수 있습니다.
    </p>
    <b-field label="이벤트 날짜 범위 선택">
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
    <b-button @click="$refs.datepicker_end.toggle()" type="is-primary"
      >조회</b-button
    >
    <Table
      v-if="loaded"
      type="event"
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
            .get(`${process.env.VUE_APP_API_URL}/event/`)
            .then((eventRes) => {
              console.log(eventRes);
              if (eventRes.data.result != null) {
                this.data = eventRes.data.result;
                this.loaded = true
              }
            });
        }
      });
  },
  data() {
    return {
      loaded: false,
      data: [],
      products: [],
      table: {
        detailKey: "id",
      },
      columns: [
        {
          field: "id",
          label: "이벤트 번호",
        },
        {
          field: "name",
          label: "이벤트명",
        },
        {
          field: "price",
          label: "할인금액",
        },
        {
          field: "start",
          label: "시작 일시",
        },
        {
          field: "end",
          label: "종료 일시",
        },
        {
          field: "totalqty",
          label: "총 수량",
        },
        {
          field: "qty",
          label: "교환 된 수량",
        },
      ],
    };
  },
};
</script>

<template>
  <div class="home">
    <p class="title is-8">사용자 관리</p>
    <p class="subtitle is-8">사용자 관리 기능을 제공합니다.</p>
    <b-field label="ID로 검색">
      <b-input type="text" v-model="id"></b-input>
    </b-field>
    <Table
      v-if="loaded"
      type="order"
      :products="products"
      :columns="columns"
      :data="data"
      :detailKey="table.detailKey"
    />
    <b-button @click="lookup" type="is-primary">조회</b-button>
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
        }
      });
  },
  methods: {
    lookup() {
      this.$axios
        .get(`${process.env.VUE_APP_API_URL}/event/`)
        .then((eventRes) => {
          console.log(eventRes);
          if (eventRes.data.result != null) {
            this.data = eventRes.data.result;
            this.loaded = true;
          }
        });
    },
  },
  data() {
    return {
      loaded: false,
      data: [],
      id,
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

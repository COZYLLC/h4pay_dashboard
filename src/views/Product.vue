<template>
  <div class="home">
    <p class="title is-8">제품 조회</p>
    <p class="subtitle is-8">
      이벤트 내역을 날짜 범위, ID를 조건으로 이용해 조회할 수 있습니다.
    </p>
    <Table
      type="product"
      :products="products"
      :columns="columns"
      :data="products"
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
              if (eventRes.data.event != null) {
                this.data = eventRes.data.event;
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
        detailKey: "id",
      },
      columns: [
        {
          field: "id",
          label: "제품 번호",
        },
        {
          field: "productName",
          label: "제품명",
        },
        {
          field: "price",
          label: "가격",
        },
        {
          field: "desc",
          label: "설명",
        },
        {
          field: "soldout",
          label: "품절 여부",
        },
      ],
    };
  },
};
</script>

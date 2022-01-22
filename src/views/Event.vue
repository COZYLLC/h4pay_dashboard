<template>
  <div class="home">
    <p class="title is-8">이벤트 내역 조회</p>
    <p class="subtitle is-8">이벤트 내역을 조회할 수 있습니다.</p>
    <Table
      v-if="loaded"
      type="event"
      :products="products"
      :columns="columns"
      :data="data"
      :detail-key="table.detailKey"
      :checkable="false"
      :page="table.page"
    >
      <template v-slot:detail="props">
        <EventDetail :users="props.row.uid" />
      </template>
      <template v-slot:control="props">
        <EventControl :checked-rows="props.checkedRows" />
      </template>
    </Table>
  </div>
</template>

<script>
// @ is an alias to /src
import Table from "@/components/Table";
import EventDetail from "@/components/Event/Detail.vue";
import EventControl from "@/components/Event/Control.vue";
import { getProducts } from "../networking/product";
import { getEvents } from "../networking/event";
export default {
  name: "Home",
  components: {
    Table,
    EventDetail,
    EventControl,
  },
  data() {
    return {
      loaded: false,
      data: [],
      products: [],
      table: {
        detailKey: "id",
        page: 1,
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
          field: "amount",
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
  created() {
    getProducts().then((productRes) => {
      if (productRes.status) {
        this.products = productRes.result;
        this.lookup();
      }
    });
    if (this.$route.query.page == undefined) {
      if (this.$route.query.orderId != undefined) {
        let idx = this.data.findIndex(
          (element) => element.orderId == this.$route.query.orderId
        );
        this.checkedRows[0] = this.data[idx];
        this.page = Math.ceil(idx / 10);
      }
    } else {
      this.page = parseInt(this.$route.query.page);
    }
  },
  methods: {
    lookup() {
      getEvents().then((eventRes) => {
        console.log(eventRes);
        if (eventRes.result != null) {
          this.data = eventRes.result;
          this.loaded = true;
        }
      });
    },
  },
};
</script>

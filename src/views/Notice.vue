<template>
  <div class="home">
    <p class="title is-8">공지사항 조회</p>
    <p class="subtitle is-8">
      지금까지 올라간 공지사항을 조회하고, 추가/변경할 수 있습니다.
    </p>
    <Table
      v-if="loaded"
      type="notice"
      :columns="columns"
      :data="data"
      :detail-key="table.detailKey"
      checkable
      :page="table.page"
    >
      <template v-slot:detail="props">
        <NoticeDetail :content="props.row.content" :img="props.row.img" />
      </template>
      <template v-slot:control="props">
        <NoticeControl :checked-rows="props.checkedRows" />
      </template>
    </Table>
  </div>
</template>

<script>
// @ is an alias to /src
import Table from "@/components/Table";
import NoticeDetail from "@/components/Notice/Detail.vue";
import NoticeControl from "@/components/Notice/Control.vue";
import { getNotices } from "../networking/notice";
export default {
  name: "Home",
  components: {
    Table,
    NoticeDetail,
    NoticeControl,
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
          field: "title",
          label: "이벤트명",
        },
        {
          field: "date",
          label: "작성/수정 일시",
        },
      ],
    };
  },
  created() {
    this.lookup();
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
      getNotices().then((res) => {
        console.log(res);
        if (res.result != null) {
          this.data = res.result;
          this.loaded = true;
        }
      });
    },
  },
};
</script>

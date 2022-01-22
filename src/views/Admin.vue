<template>
  <div class="home">
    <p class="title is-8">관리자 관리</p>
    <p class="subtitle is-8">관리자 가입 요청을 승인/거절할 수 있습니다.</p>
    <b-field label="ID로 검색">
      <b-input v-model="id" type="text"></b-input>
    </b-field>
    <Table
      v-if="loaded"
      type="user"
      :columns="columns"
      :data="data"
      :detail-key="table.detailKey"
    />
    <b-button type="is-primary" @click="lookup">
      {{ id == null ? "전체 조회" : "조회" }}
    </b-button>
  </div>
</template>

<script>
// @ is an alias to /src
import Table from "@/components/Table";
import { getUnverifiedUsers } from "../networking/users";
export default {
  name: "Admin",
  components: {
    Table,
  },
  data() {
    return {
      loaded: false,
      data: [],
      id: null,
      table: {
        detailKey: "id",
      },
      columns: [
        {
          field: "id",
          label: "가입 요청 ID",
        },
        {
          field: "name",
          label: "이름",
        },
        {
          field: "uid",
          label: "ID",
        },
        {
          field: "role",
          label: "권한",
        },
      ],
    };
  },
  created() {},
  methods: {
    lookup() {
      getUnverifiedUsers().then((res) => {
        console.log(res);
        if (res.status) {
          this.data = res.result;
          this.loaded = true;
        }
      });
    },
  },
};
</script>

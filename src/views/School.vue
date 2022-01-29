<template>
  <div class="home">
    <p class="title is-8">학교 관리</p>
    <p class="subtitle is-8">
      본 메뉴는 COZY 내부 관리를 위해 존재하며, 학교 관리가 가능합니다.
    </p>
    <b-field label="학교ID로 검색">
      <b-input v-model="id" type="text"></b-input>
    </b-field>
    <b-field label="학교 이름으로 검색">
      <b-input v-model="name" type="text"></b-input>
    </b-field>
    <b-button type="is-primary" @click="lookup">
      {{ id == null ? "전체 조회" : "조회" }}
    </b-button>
    <Table
      v-if="loaded"
      checkable
      type="school"
      :columns="columns"
      :data="data"
      :detail-key="table.detailKey"
    >
      <template v-slot:detail="props">
        <div>
          <p>법인명: {{ props.row.seller.name }}</p>
          <p>법인 대표 이름: {{ props.row.seller.founderName }}</p>
          <p>법인 사업장 주소: {{ props.row.seller.address }}</p>
          <p>법인 전화번호: {{ props.row.seller.tel }}</p>
          <p>법인 사업자번호: {{ props.row.seller.businessId }}</p>
          <p>법인 통신판매업신고번호: {{ props.row.seller.sellerId }}</p>
        </div>
      </template>
      <template v-slot:control="props">
        <SchoolControl :checked-rows="props.checkedRows" />
      </template>
    </Table>
    <table-loading v-else-if="loaded == null" />
  </div>
</template>

<script>
// @ is an alias to /src
import Table from "@/components/Table";
import TableLoading from "@/components/TableLoading.vue";
import { getSchools } from "../networking/school";
import SchoolControl from "@/components/School/Control";
export default {
  name: "School",
  components: {
    Table,
    TableLoading,
    SchoolControl,
  },
  data() {
    return {
      loaded: false,
      data: [],
      id: null,
      name: null,
      table: {
        detailKey: "id",
      },
      columns: [
        {
          field: "id",
          label: "학교 ID",
        },
        {
          field: "name",
          label: "이름",
        },
      ],
    };
  },
  created() {
    this.$store.dispatch("loginCheckA").then(() => {
      const role = this.$store.getters.getRole;
      if (role != "SA") {
        this.$buefy.notification.open({
          message: "권한이 없습니다.",
          type: "is-danger",
        });
        this.$router.push("/");
      }
    });
  },
  methods: {
    lookup() {
      this.loaded = null;
      getSchools({
        name: this.name ?? undefined,
        id: this.id ?? undefined,
      }).then((res) => {
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

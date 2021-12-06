<template>
  <section>
    <b-table
      ref="table"
      class="table"
      :data="data"
      paginated
      per-page="10"
      detailed
      :detail-key="detailKey"
      detail-transition="fade"
      show-detail-icon
      :checkable="checkable"
      checkbox-position="left"
      :checked-rows.sync="checkedRows"
      :header-checkable="false"
      :current-page.sync="page"
      default-sort="date"
      default-sort-direction="desc"
      :is-row-checkable="
        (row) =>
          checkedRows.length == 0 ||
          (type == 'order' || type == 'gift'
            ? row.orderId == checkedRows[0].orderId
            : row.id == checkedRows[0].id)
      "
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      scrollable
      @page-change="onPageChange"
    >
      <b-table-column
        v-for="(column, idx) in columns"
        :key="idx"
        v-slot="props"
        :field="column.field"
        :label="column.label"
        :width="column.width"
        centered
        sortable
      >
        <template v-if="isDateField(column.field)">
          <!-- 날짜필드 -->
          {{ new Date(props.row[column.field]).toLocaleDateString() }}
        </template>
        <template v-else-if="column.field == 'product'">
          <!-- 대량선물에서 제품 필드 -->
          {{
            products.filter(
              (product) => product.id == props.row[column.field]
            )[0].productName
          }}
        </template>
        <template v-else-if="column.field == 'issuer'">
          {{ props.row.issuer.uid }}
        </template>
        <template v-else-if="column.field == 'receiver'">
          {{ props.row.receiver.name }} / {{ props.row.receiver.tel }}
        </template>
        <template v-else-if="typeof props.row[column.field] == 'boolean'">
          <!-- 교환여부 등 불린 필드 -->
          <span v-if="props.row[column.field] == true" class="tag is-danger">
            O
          </span>
          <span v-else class="tag is-primary"> X </span>
        </template>
        <template v-else>
          <!-- 그 외 모든 필드 -->
          {{ props.row[column.field] }}
        </template>
      </b-table-column>

      <template #detail="props">
        <article class="media">
          <div class="columns">
            <slot name="detail" :row="props.row"></slot>
          </div>
        </article>
      </template>
      <template #footer>
        <slot name="control" :checkedRows="checkedRows"></slot>
      </template>
    </b-table>
  </section>
</template>

<script>
export default {
  props: ["type", "detailKey", "products", "columns", "data", "checkable"],

  data() {
    return {
      showDetailIcon: true,
      checkedRows: [],
      page: 1,
    };
  },
  created() {
    if (this.$route.query.page == undefined) {
      if (this.$route.query.orderId == undefined) {
        this.$router.replace({ query: { page: 1 } });
      } else {
        let idx = this.data.findIndex(
          (element) => element.orderId == this.$route.query.orderId
        );
        this.checkedRows[0] = this.data[idx];
        this.page = Math.ceil(idx / 10);
        if (this.page == 0) {
          this.page++;
        }
        console.log(this.page);
      }
    } else {
      this.page = parseInt(this.$route.query.page);
    }
  },
  methods: {
    onPageChange(page) {
      this.$router.replace({ query: { page: page } });
    },
    isDateField(field) {
      return (
        field == "date" ||
        field == "expire" ||
        field == "start" ||
        field == "end"
      );
    },
  },
};
</script>

<style>
.media {
  border: none !important;
}
@media screen and (min-width: 768px) {
  .table {
    width: calc(100vw - 310px);
  }
}
</style>

<template>
  <section>
    <b-table
      :data="data"
      ref="table"
      paginated
      per-page="10"
      :opened-detailed="defaultOpenedDetails"
      detailed
      :detail-key="detailKey"
      detail-transition="fade"
      show-detail-icon
      checkable
      checkbox-position="left"
      :checked-rows.sync="checkedRows"
      :is-row-checkable="
        (row) =>
          checkedRows.length == 0 || row.soldout == checkedRows[0].soldout
      "
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
    >
      <b-table-column
        v-for="(column, idx) in columns"
        :key="idx"
        :field="column.field"
        :label="column.label"
        centered
        v-slot="props"
      >
        <template
          v-if="
            column.field == 'date' ||
            column.field == 'expire' ||
            column.field == 'start' ||
            column.field == 'end'
          "
        >
          {{ new Date(props.row[column.field]).toLocaleDateString() }}
        </template>
        <template
          v-else-if="column.field == 'exchanged' || column.field == 'soldout'"
        >
          <span v-if="props.row[column.field] == true" class="tag is-danger">
            O
          </span>
          <span v-else class="tag is-success"> X </span>
        </template>
        <template v-else>{{ props.row[column.field] }}</template>
      </b-table-column>

      <template #detail="props">
        <article class="media">
          <div class="columns">
            <OrderDetail
              v-if="type == 'order' || type == 'gift'"
              :items="props.row.item"
              :products="products"
            />
            <EventDetail v-if="type == 'event'" :users="props.row.uid" />
            <ProductDetail v-if="type == 'product'" :product="props.row" />
          </div>
        </article>
      </template>
      <template #footer>
        <div class="has-text-right" v-if="type == 'order' || type == 'gift'">
          <b-button class="is-danger" style="margin-right: 7px"
            >주문 취소</b-button
          >
          <b-button class="is-success" style="margin-right: 7px">교환</b-button>
          <b-button class="is-info">정산</b-button>
        </div>
        <div class="has-text-right" v-else-if="type == 'product'">
          <b-button class="is-info" style="margin-right: 7px"
            >제품 정보 변경</b-button
          >
          <b-button
            v-if="checkedRows.length != 0 && checkedRows[0].soldout"
            class="is-danger"
            style="margin-right: 7px"
            >품절 처리</b-button
          >
          <b-button
            v-else-if="checkedRows.length != 0"
            class="is-success"
            style="margin-right: 7px"
            >재고보유 처리</b-button
          >

          <b-button class="is-danger" style="margin-right: 7px">제거</b-button>
          <b-button class="is-success">추가</b-button>
        </div>
      </template>
    </b-table>
  </section>
</template>

<script>
import OrderDetail from "@/components/OrderDetail";
import EventDetail from "@/components/EventDetail";
import ProductDetail from "@/components/ProductDetail";
export default {
  components: {
    OrderDetail,
    EventDetail,
    ProductDetail,
  },
  props: ["type", "detailKey", "products", "columns", "data"],
  data() {
    return {
      checkedRows: [],
      defaultOpenedDetails: [1],
      showDetailIcon: true,
    };
  },
};
</script>

<style>
.media {
  border: none !important;
}
</style>
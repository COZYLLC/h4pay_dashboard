<template>
  <section>
    <b-table
      :data="data"
      ref="table"
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
      @page-change="onPageChange"
      :current-page.sync="page"
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
    >
      <b-table-column
        v-for="(column, idx) in columns"
        :key="idx"
        :field="column.field"
        :label="column.label"
        :width="column.field == 'orderId' ? 10 : null"
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
        <template v-else-if="column.field == 'product'">
          {{
            products.filter(
              (product) => product.id == props.row[column.field]
            )[0].productName
          }}
        </template>
        <template
          v-else-if="
            column.field == 'exchanged' ||
            column.field == 'soldout' ||
            column.field == 'approved'
          "
        >
          <span v-if="props.row[column.field] == true" class="tag is-danger">
            O
          </span>
          <span v-else class="tag is-primary"> X </span>
        </template>
        <template v-else>{{ props.row[column.field] }}</template>
      </b-table-column>

      <template #detail="props">
        <article class="media">
          <div class="columns">
            <PurchaseDetail
              v-if="type == 'order' || type == 'gift'"
              :item="props.row.item"
              :products="products"
            />
            <EventDetail v-if="type == 'event'" :users="props.row.uid" />
            <ProductDetail v-if="type == 'product'" :product="props.row" />
            <BulkReqDetail
              v-if="type == 'bulkreq'"
              :names="props.row.names"
              :targets="props.row.targets"
            />
          </div>
        </article>
      </template>
      <template #footer>
        <EventControl v-if="type == 'event'" :checkedRows="checkedRows" />
        <PurchaseControl
          v-else-if="type == 'order' || type == 'gift'"
          :type="type"
          :checkedRows="checkedRows"
        />
        <ProductControl
          v-else-if="type == 'product'"
          :checkedRows="checkedRows"
        />
        <BulkReqControl
          v-else-if="type == 'bulkreq'"
          :checkedRows="checkedRows"
        />
      </template>
    </b-table>
  </section>
</template>

<script>
import PurchaseDetail from "@/components/Purchase/Detail";
import PurchaseControl from "@/components/Purchase/Control";
import EventDetail from "@/components/Event/Detail";
import EventControl from "@/components/Event/Control";
import ProductDetail from "@/components/Product/Detail";
import ProductControl from "@/components/Product/Control";
import BulkReqDetail from "@/components/BulkReq/Detail";
import BulkReqControl from "@/components/BulkReq/Control";

export default {
  components: {
    PurchaseDetail,
    PurchaseControl,
    EventDetail,
    EventControl,
    ProductDetail,
    ProductControl,
    BulkReqDetail,
    BulkReqControl,
  },
  methods: {
    onPageChange(page) {
      this.$router.replace({ query: { page: page } });
    },
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
  props: ["type", "detailKey", "products", "columns", "data", "checkable"],

  data() {
    return {
      showDetailIcon: true,
      checkedRows: [],
      page: 1,
    };
  },
};
</script>

<style>
.media {
  border: none !important;
}
</style>
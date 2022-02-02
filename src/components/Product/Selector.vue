<template>
  <div>
    <div v-if="selectable" class="columns">
      <div class="column is-6">
        <p class="title is-4">선택된 제품과 수량</p>
      </div>
      <div class="column is-6">
        <b-select
          v-model="product"
          expanded
          style="margin-bottom: 20px"
          size="lg"
          placeholder="제품을 선택해주세요."
          @input="onSelectProduct"
        >
          <option
            v-for="(productOption, idx) in productsToSelect"
            :key="idx"
            :value="productOption"
          >
            {{ productOption.text }}
          </option>
        </b-select>
      </div>
    </div>

    <div class="items">
      <div v-for="(qty, id) in item" :key="id" class="mr-2">
        <ProductCard
          :componentkey="compKey"
          :product="products.filter((product) => product.id == id)[0]"
          :qty="qty"
          :controlable="selectable"
          @decrease="decreaseAmount(id)"
          @increase="increaseAmount(id)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ProductCard from "@/components/Product/Card.vue";
export default {
  components: {
    ProductCard,
  },
  props: {
    productsToSelect: { type: Array, default: () => [] },
    products: { type: Array, default: () => [] },
    targetIndex: { type: Number, default: 0 },
    item: { type: Object, default: () => {} },
    selectable: { type: Boolean, defalut: false },
  },
  data() {
    return {
      itemData: this.item,
      product: null,
      compKey: 0,
    };
  },
  methods: {
    onSelectProduct(product) {
      if (this.item[product.value] == undefined) {
        this.item[product.value] = 1;
      } else {
        this.item[product.value]++;
      }
      this.update();
    },
    increaseAmount(id) {
      this.item[id]++;
      this.update();
    },
    decreaseAmount(id) {
      if (this.item[id] == 1) {
        delete this.item[id];
      } else {
        this.item[id]--;
      }
      this.update();
    },
    removeProduct(params) {
      const id = params.id;
      delete this.item[id];
      this.update();
    },
    update() {
      this.compKey++;
      this.$emit("itemUpdate", {
        index: this.targetIndex,
        item: this.itemData,
      });
    },
  },
};
</script>
<style scoped>
.items {
  display: flex;
  width: calc(100vw - 230px);
  height: 150px;
  white-space: nowrap;
  overflow-x: scroll;
}
@media screen and (min-width: 768px) {
  .items {
    width: calc(100vw - 410px);
  }
}
</style>

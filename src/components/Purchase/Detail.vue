<template>
  <div id="orderDetail">
    <h1 class="subtitle is-8">주문 품목</h1>
    <div v-for="(qty, id) in item" :key="id">
      <div v-if="qty != 0" class="column is-narrow">
        <ProductCard
          :product="products.filter((product) => product.id == id)[0]"
          :qty="qty"
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
  props: ["item", "products"],
};
</script>

<template>
  <div id="bulkreqdetail">
    <h1 class="subtitle is-8">수신자 명단</h1>
    <ul v-if="targets.length != 0">
      <li v-for="(target, i) in targets" :key="i">
        {{ target.tel }} | {{ target.name }}
        <product-showcase
          :item="target.item"
          :products="products"
        ></product-showcase>
        <hr class="seperator" />
      </li>
    </ul>
    <div v-else>수신자 데이터가 없는 것 같아요. 관리자에게 문의해주세요.</div>
  </div>
</template>
<script>
import ProductShowcase from "@/components/Product/Selector";
export default {
  components: {
    ProductShowcase,
  },
  props: ["targets", "products"],
};
</script>
<style>
.seperator {
  height: 1px;
  margin: 10px 0;
  background: gray;
}
</style>
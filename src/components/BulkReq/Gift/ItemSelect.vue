<template>
  <div class="has-text-centered">
    <section
      v-for="(target, i) in targets"
      :key="i"
      class="target-area has-text-left mb-5"
    >
      <div class="columns">
        <div v-if="i != 0" class="column is-1">
          <b-button
            type="is-danger"
            icon-right="times"
            rounded
            @click="removeTarget(i)"
          />
        </div>
        <div class="column">
          <div class="columns">
            <div class="column">
              <b-field label="전화번호">
                <b-input v-model="target.tel" type="tel" />
              </b-field>
            </div>
            <div class="column">
              <b-field label="이름">
                <b-input v-model="target.name" type="text" />
              </b-field>
            </div>
          </div>
          <ProductSelector
            :selectable="true"
            :target-index="i"
            :products="products"
            :products-to-select="productsToSelect"
            :item="target.item"
            @itemUpdate="itemUpdate"
          />
        </div>
      </div>
    </section>
    <b-button
      rounded
      class="is-success"
      style="margin-bottom: 70px"
      icon-right="plus"
      @click="addTarget"
    />
    <div class="bulk-bottom">
      <b-button class="is-primary" expanded @click="submit"> 제출 </b-button>
    </div>
  </div>
</template>

<script>
import ProductSelector from "@/components/Product/Selector.vue";
import { getVisibleProducts } from "../../../networking/product";
export default {
  components: {
    ProductSelector,
  },
  data() {
    return {
      targets: [
        {
          tel: "",
          name: "",
          item: {},
        },
      ],
      product: null,
      products: [],
      productsToSelect: [],
    };
  },
  created() {
    this.fetchProduct();
  },
  methods: {
    removeTarget(id) {
      this.targets.splice(id, 1);
    },
    addTarget() {
      this.targets.push({ id: "", name: "", item: {} });
    },
    fetchProduct() {
      getVisibleProducts()
        .then((res) => {
          if (res != undefined) {
            res.result.forEach((item) => {
              this.productsToSelect.push({
                value: item.id,
                text: item.productName,
              });
            });
            this.products = res.result;
          }
        })
        .catch((error) => {
          alert(
            "제품 목록을 불러오지 못했습니다. 개발자에게 문의해주세요. (1)"
          );
        });
    },
    itemUpdate(params) {
      const index = params.index;
      const item = params.item;
      this.targets[index].item = item;
    },
    submit() {
      var amount = 0;
      this.targets.forEach((target, idx) => {
        this.targets[idx].tel = this.targets[idx].tel.replace(/-/g, "");
        for (var key in target.item) {
          const qty = target.item[key];
          const matchProduct = this.products.filter(
            (product) => product.id == key
          )[0];
          amount += matchProduct.price * qty;
        }
      });
      this.$emit("submit", { targets: this.targets, amount });
    },
  },
};
</script>
<style>
.target-area {
  background: rgb(243, 243, 243);
  padding: 2em;
  border-radius: 38px;
}
.bulk-bottom {
  position: fixed;
  bottom: 20px;
  width: calc(100vw - 160px);
}

@media screen and (min-width: 768px) {
  .bulk-bottom {
    width: calc(100vw - 320px);
  }
}
</style>

<style scoped>
button.button.is-rounded {
  padding: 0 1em !important;
}
</style>

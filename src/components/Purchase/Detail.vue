<template>
  <div id="orderDetail">
    <h1 class="subtitle is-8">주문 품목</h1>
    <div v-for="(qty, id) in item" :key="id">
      <div class="column is-narrow" v-if="item.qty != 0">
        <div class="box">
          <article class="media">
            <div class="media-left">
              <figure class="image is-64x64">
                 <img
                  :src="
                    products.filter((product) => product.id == id)[0].img
                  "
                /> 
              </figure>
            </div>
            <div class="media-content">
              {{
                products.filter((product) => product.id == id)[0]
               .productName
              }}<br />{{ qty }}개
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item", "products"],
};
</script>
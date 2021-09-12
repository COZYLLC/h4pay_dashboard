<template>
  <div id="orderDetail">
    <h1 class="subtitle is-8">주문 품목</h1>
    <div v-for="(item, idx) in items" :key="idx">
      <div class="column is-narrow" v-if="item.qty != 0">
        <div class="box">
          <article class="media">
            <div class="media-left">
              <figure class="image is-64x64">
                <img :src="products[item.id].img" />
              </figure>
            </div>
            <div class="media-content">
              {{ products[item.id].productName }}<br />{{ item.qty }}개
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['items', 'products']
}
</script>
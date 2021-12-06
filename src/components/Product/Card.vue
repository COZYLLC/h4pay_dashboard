<template>
  <div class="box">
    <article class="media">
      <div class="media-left">
        <figure class="image is-64x64">
          <img :src="product.img" />
        </figure>
      </div>
      <div class="media-content">
        {{ product.productName }}<br />{{ qty }}개
      </div>
    </article>
  </div>
</template>

<script>
export default {
  props: ["product", "qty"],
};
</script>

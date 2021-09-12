<template>
  <article class="media">
    <figure class="media-left">
      <p class="image is-64x64">
        <img :src="product.img" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{ product.productName }} </strong>
          <br />{{ product.desc }}
        </p>
      </div>
    </div>
  </article>
</template>
<script>
export default {
  props: ["product"],
};
</script>
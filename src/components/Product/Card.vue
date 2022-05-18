<template>
  <div class="box">
    <article class="media">
      <div class="media-left">
        <figure class="image is-64x64">
          <img :src="product.img" />
        </figure>
      </div>
      <div class="media-content">
        <p class="title is-4">
          {{ product.productName }}
        </p>
        <b-button
          v-if="controlable"
          class="is-danger"
          rounded
          icon-right="minus"
          @click="$emit('decrease', product.id)"
        />
        <p class="qty">{{ qty }}개</p>
        <b-button
          v-if="controlable"
          class="is-success"
          rounded
          icon-right="plus"
          @click="$emit('increase', product.id)"
        />
      </div>
    </article>
  </div>
</template>

<script>
export default {
  props: {
    product: { type: Object, default: () => {} },
    qty: { type: Number, default: 0 },
    controlable: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
button.button.is-rounded {
  padding: 0 1em !important;
}
</style>
<style>
.qty {
  display: inline;
  margin: 0 0.5em;
  font-size: 1.5em;
}
</style>

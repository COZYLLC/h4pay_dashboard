<template>
  <a @click="onClick">
    <div class="card">
      <div class="card-image">
        <figure class="image is-4by3">
          <img :src="img" alt="Placeholder image" />
        </figure>
      </div>
      <div class="card-content">
        <div class="content">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </a>
</template>
<script>
export default {
  props: ["img"],
  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

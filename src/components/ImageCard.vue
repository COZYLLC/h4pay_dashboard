<template>
  <a @click="onClick">
    <div class="card">
      <div class="card-image">
        <figure class="image is-4by3">
          <slot name="image"></slot>
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
  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

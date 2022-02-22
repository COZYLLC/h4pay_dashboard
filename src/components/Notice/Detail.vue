<template>
  <div id="noticeDㄴetail">
    <img :src="img" />
    {{ content.replace(/\\n/g, "\n") }}
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    content: {
      type: String,
      default: "",
    },
    img: {
      type: String,
      default: "",
    },
  },
});
</script>

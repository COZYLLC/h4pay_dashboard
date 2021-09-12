<template>
  <div id="eventDetail">
    <h1 class="subtitle is-8">혜택을 받은 사용자들</h1>
    <ul v-if="users.length != 0">
      <li v-for="uid in users" :key="uid">{{ uid }}</li>
    </ul>
    <div v-else>아직 아무도 혜택을 받지 않은 것 같네요.</div>
  </div>
</template>
<script>
export default {
  props: ["users"],
};
</script>
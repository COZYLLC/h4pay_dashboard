<template>
  <div id="bulkreqdetail">
    <h1 class="subtitle is-8">수신자 명단</h1>
    <ul v-if="targets.length != 0">
      <li v-for="(studentId, i) in targets" :key="i">
        {{ studentId }} {{ names[i] }}
      </li>
    </ul>
    <div v-else>아직 아무도 혜택을 받지 않은 것 같네요.</div>
  </div>
</template>
<script>
export default {
  props: ["targets", "names"],
};
</script>
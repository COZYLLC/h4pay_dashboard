<template>
  <div id="bulkreqdetail">
    <h1 class="subtitle is-8">수신자 명단</h1>
    <ul v-if="targets.length != 0">
      <li v-for="(studentId, i) in targets" :key="i">
        {{ studentId }} {{ names[i] }}
      </li>
    </ul>
    <div v-else>수신자 데이터가 없는 것 같아요. 관리자에게 문의해주세요.</div>
  </div>
</template>
<script>
export default {
  props: ["targets", "names"],
};
</script>

<template>
  <div class="app">
    <section class="sidebar-layout">
      <Navbar />

      <div class="p-1" id="routerView">
        <router-view />
      </div>
    </section>
  </div>
</template>


<style>
.app .sidebar-layout {
  display: flex;
  flex-direction: row;
  min-height: 100%;
  height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#routerView {
  width: 100%;
  padding: 20px !important;
}
</style>

<script>
import Navbar from "@/components/Navbar";
export default {
  components: {
    Navbar,
  },
};
</script>
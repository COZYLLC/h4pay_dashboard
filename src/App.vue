<template>
  <div class="app">
    <section class="sidebar-layout">
      <Navbar v-if="!$route.meta.hideNavigation" />

      <div class="p-1" id="routerView">
        <transition name="fade"> <router-view /> </transition>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("loginCheckA").then(() => {
      if (
        this.$store.getters.getName == null ||
        this.$store.getters.getRole == null
      ) {
        this.$router.push("/login");
      } else {
        this.user.name = this.$store.getters.getName;
        this.user.role = this.$store.getters.getRole;
      }
    });
  },
};
</script>

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
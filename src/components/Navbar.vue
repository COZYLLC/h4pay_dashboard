<template>
  <b-sidebar position="static" mobile="reduce" fullheight type="is-light" open>
    <div class="p-4">
      <div class="block">
        <img
          style="padding: 10%"
          :src="require('@/assets/logo.png')"
          alt="Lightweight UI components for Vue.js based on Bulma"
        />
        {{ schoolName }}
      </div>
      <b-menu class="is-custom-mobile">
        <b-menu-list label="메인">
          <!-- 자식이 없을 경우 -->
          <b-menu-item
            class="menu-item"
            icon="home"
            label="홈"
            @click="$router.push('/')"
          />
        </b-menu-list>
        <b-menu-list label="관리">
          <span v-for="(item, i) in menu" :key="i">
            <!-- 자식이 있을 경우 -->
            <b-menu-item
              v-if="item.children != null && validUsableMenu(item.children)"
              class="menu-item"
              :active="item.active"
              :expanded="item.expanded"
              :icon="item.icon"
              :label="item.title"
            >
              <span v-for="(child, j) in item.children" :key="j">
                <b-menu-item
                  v-if="validUsableMenuChild(child.role)"
                  class="menu-item"
                  :icon="child.icon"
                  :label="child.title"
                  @click="pushTo(item.route, child.route)"
                />
              </span>
            </b-menu-item>

            <!-- 자식이 없을 경우 -->
            <b-menu-item
              v-if="item.children == null && validUsableMenuChild(item.role)"
              class="menu-item"
              :active="item.active"
              :expanded="item.expanded"
              :icon="item.icon"
              :label="item.title"
              @click="pushTo(item.route, '')"
            />
          </span>
        </b-menu-list>
      </b-menu>
    </div>
  </b-sidebar>
</template>

<script>
import menu from "../menu.json";
import { getSchools } from "../networking/school";
export default {
  data() {
    return {
      expandOnHover: false,
      expandWithDelay: false,
      mobile: "reduce",
      reduce: false,
      user: {
        role: null,
        uid: null,
        name: null,
      },
      schoolName: "",
      menu,
    };
  },
  created() {
    this.$store.dispatch("loginCheckA").then(() => {
      if (
        this.$store.getters.getName == null ||
        this.$store.getters.getRole == null ||
        this.$store.getters.getSchoolId == null ||
        this.$store.getters.getUid == null ||
        this.$store.getters.getToken == null ||
        this.$store.getters.getName == "" ||
        this.$store.getters.getRole == "" ||
        this.$store.getters.getSchoolId == "" ||
        this.$store.getters.getUid == "" ||
        this.$store.getters.getToken == ""
      ) {
        this.$router.push("/login");
      } else {
        this.user.name = this.$store.getters.getName;
        this.user.role = this.$store.getters.getRole;
        getSchools({
          schoolId: this.$store.getters.getSchoolId,
        }).then((res) => {
          if (res.status && res.result.length > 0) {
            this.schoolName = res.result[0].name;
          }
        });
      }
    });
  },
  methods: {
    pushTo(parentRoute, childRoute) {
      this.$router.push(`${parentRoute}/${childRoute}`);
    },
    validUsableMenuChild(role) {
      return role.filter((role) => role == this.user.role).length > 0;
    },
    validUsableMenu(children) {
      let usable = false;
      children.forEach((child) => {
        if (this.validUsableMenuChild(child.role)) {
          console.log("있음");
          usable = true;
          return true;
        }
      });
      return usable;
    },
  },
};
</script>
<style>
.menu-item {
  white-space: nowrap !important;
}
</style>

<template>
  <b-sidebar
    position="static"
    mobile="reduce"
    expand-on-hover="false"
    delay="500"
    fullheight
    type="is-light"
    open
  >
    <div class="p-4">
      <div class="block">
        <img
          style="padding: 10%"
          :src="require('@/assets/logo.png')"
          alt="Lightweight UI components for Vue.js based on Bulma"
        />
      </div>
      <b-menu class="is-custom-mobile">
        <b-menu-list label="메인">
          <!-- 자식이 없을 경우 -->
          <b-menu-item
            class="menu-item"
            icon="home"
            label="홈"
            @click="$router.push('/')"
          >
          </b-menu-item>
        </b-menu-list>
        <b-menu-list label="관리">
          <span v-for="(item, i) in menu" :key="i">
            <!-- 자식이 있을 경우 -->
            <b-menu-item
              class="menu-item"
              v-if="item.children != null && validUsableMenu(item.children)"
              :active="item.active"
              :expanded="item.expanded"
              :icon="item.icon"
              :label="item.title"
            >
              <span v-for="(child, j) in item.children" :key="j">
                <b-menu-item
                  class="menu-item"
                  v-if="validUsableMenuChild(child.role)"
                  :icon="child.icon"
                  :label="child.title"
                  @click="pushTo(item.route, child.route)"
                ></b-menu-item>
              </span>
            </b-menu-item>

            <!-- 자식이 없을 경우 -->
            <b-menu-item
              class="menu-item"
              v-if="item.children == null && validUsableMenuChild(item.role)"
              :active="item.active"
              :expanded="item.expanded"
              :icon="item.icon"
              :label="item.title"
              @click="pushTo(item.route, '')"
            >
            </b-menu-item>
          </span>
        </b-menu-list>
      </b-menu>
    </div>
  </b-sidebar>
</template>

<script>
export default {
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
      menu: [
        {
          title: "이벤트",
          icon: "rocket",
          route: "/event",
          active: false,
          expanded: false,
          role: ["SA", "AT"],
        },
        {
          title: "주문",
          icon: "clipboard-list",
          route: "/order",
          active: false,
          expanded: false,
          role: ["SA", "AT"],
        },
        {
          title: "선물",
          icon: "gift",
          route: "/gift",
          active: false,
          expanded: false,
          children: [
            { title: "조회", icon: "search", route: "", role: ["SA", "AT"] },
            {
              title: "대량선물",
              icon: "paper-plane",
              route: "bulk",
              role: ["SA", "A", "T", "AT"],
            },
            {
              title: "대량선물 조회 및 승인",
              icon: "scroll",
              route: "bulk/lookup",
              role: ["SA", "A", "T", "AT"],
            },
          ],
        },
        {
          title: "제품",
          icon: "boxes",
          route: "/product?page=1",
          active: false,
          expanded: false,
          role: ["SA", "S", "AT"],
        },
        /*         {
          title: "사용자 관리",
          icon: "users",
          route: "/users",
          active: false,
          expanded: false,
          role: ["SA"],
        }, */
        /*        {
          title: "내 계정",
          icon: "user",
          route: "/account",
          active: false,
          expanded: false,
          role: ["SA", "S", "T"],
        }, */
        {
          title: "로그아웃",
          icon: "sign-out-alt",
          route: "/login",
          active: false,
          expanded: false,
          role: ["SA", "S", "T", "AT", ],
        },
      ],
    };
  },
};
</script>
<style>
.menu-item {
  white-space: nowrap !important;
}
</style>
<template>
  <b-sidebar
    position="static"
    mobile="hide"
    :expand-on-hover="expandOnHover"
    :reduce="reduce"
    :delay="expandWithDelay ? 500 : null"
    type="is-light"
    open
  >
    <div class="p-1">
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
            icon="home"
            label="홈"
            @click="$router.push('/')"
          >
          </b-menu-item>
        </b-menu-list>
        <b-menu-list label="관리">
          <div v-for="(item, i) in menu" :key="i">
            <!-- 자식이 있을 경우 -->
            <b-menu-item
              v-if="item.children != null"
              :active="item.active"
              :expanded="item.expanded"
              :icon="item.icon"
              :label="item.title"
            >
              <b-menu-item
                v-for="(child, j) in item.children"
                :key="j"
                :icon="child.icon"
                :label="child.title"
                @click="pushTo(item.route, child.route)"
              ></b-menu-item>
            </b-menu-item>

            <!-- 자식이 없을 경우 -->
            <b-menu-item
              v-if="item.children == null"
              :active="item.active"
              :expanded="item.expanded"
              :icon="item.icon"
              :label="item.title"
              @click="pushTo(item.route, '')"
            >
            </b-menu-item>
          </div>
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
  },
  data() {
    return {
      expandOnHover: false,
      expandWithDelay: false,
      mobile: "reduce",
      reduce: false,
      menu: [
        {
          title: "이벤트",
          icon: "rocket",
          route: "/event",
          active: false,
          expanded: false,
        },
        {
          title: "주문",
          icon: "clipboard-list",
          route: "/order",
          active: false,
          expanded: false,
        },
        {
          title: "선물",
          icon: "gift",
          route: "/gift",
          active: false,
          expanded: false,
          children: [
            { title: "대량발주", icon: "paper-plane", route: "bulk" },
            { title: "조회", icon: "search", route: "" },
          ],
        },
        {
          title: "제품",
          icon: "boxes",
          route: "/product",
          active: false,
          expanded: false,
        },
        {
          title: "사용자 관리",
          icon: "users",
          route: "/users",
          active: false,
          expanded: false,
        },
        {
          title: "내 계정",
          icon: "user",
          route: "/account",
          active: false,
          expanded: false,
        },
        {
          title: "로그아웃",
          icon: "sign-out-alt",
          route: "/signout",
          active: false,
          expanded: false,
        },
      ],
    };
  },
};
</script>

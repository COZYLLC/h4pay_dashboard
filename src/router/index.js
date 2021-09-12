import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Order from '@/views/Order'
import Gift from '@/views/Gift'
import Bulk from '@/views/Bulk'
import Event from '@/views/Event'
import Product from '@/views/Product'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/order",
    name: "Order",
    component: Order,
  },
  {
    path: "/gift",
    name: "Gift",
    component: Gift,
  },
  {
    path: "/gift/bulk",
    name: "Bulk",
    component: Bulk,
  },
  {
    path: "/event",
    name: "Event",
    component: Event,
  },
  {
    path: "/product",
    name: "Product",
    component: Product,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

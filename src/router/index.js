import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Order from '@/views/Order'
import Gift from '@/views/Gift'
import Bulk from '@/views/Bulk/Bulk'
import BulkReq from '@/views/Bulk/BulkReq'
import BulkWithoutApprove from '@/views/Bulk/BulkWithoutApprove'
import Event from '@/views/Event'
import Product from '@/views/Product'
import Login from "@/views/Login"
import Register from "@/views/Register"
import Success from '@/views/Success'

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
    path: "/gift/bulk/lookup",
    name: "BulkReq",
    component: BulkReq,
  },
  {
    path: "/gift/bulk/noapprove",
    name: "BulkWithoutApprove",
    component: BulkWithoutApprove,
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
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      hideNavigation: true
    }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      hideNavigation: true
    }
  },
  {
    path: "/success",
    name: "Success",
    component: Success,
    meta: {
      hideNavigation: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

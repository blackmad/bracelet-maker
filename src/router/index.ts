import Vue from "vue";
import VueRouter from "vue-router";
import SetOuterDesign from "../views/SetOuterDesign.vue";
import SetInnerDesign from "../views/SetInnerDesign.vue";
import NewPlaygroundView from "../views/NewPlayground.vue";

import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Dashboard from "../components/Dashboard.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "SetOuterDesign",
    component: SetOuterDesign,
    props: true
  },
  {
    path: "/setInnerDesign/:outerDesign",
    name: "SetInnerDesign",
    component: SetInnerDesign,
    props: true
    // props: (route) => ({ outerDesign: route.query.outerDesign })
  },
  {
    path: "/newPlayground/:outerDesign/:innerDesign",
    name: "NewPlayground",
    component: NewPlaygroundView,
    props: true
    // props: (route) => ({ outerDesign: route.query.outerDesign })
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard
  }
];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;

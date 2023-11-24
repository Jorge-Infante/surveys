import { createRouter, createWebHashHistory } from "vue-router";
import authRouter from "@/modules/auth/router";
import surveyRouter from "@/modules/surveys/router"
import isAuthenticatedGuard from "./auth-guard";

const routes = [
  {
    path: "/",
    redirect: "/auth",
  },
  {
    path: "/auth",
    ...authRouter,
  },
  {
    path: "/survey",
    beforeEnter:[ isAuthenticatedGuard ] ,
    ...surveyRouter,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

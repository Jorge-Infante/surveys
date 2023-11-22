import { createRouter, createWebHashHistory } from "vue-router";
import authRouter from "@/modules/auth/router";
import surveyRouter from "@/modules/surveys/router"

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
    ...surveyRouter,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

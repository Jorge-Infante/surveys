import { createRouter, createWebHashHistory } from "vue-router";
import authRouter from "@/modules/auth/router";
import surveyRouter from "@/modules/surveys/router"
import {isAuthenticatedGuard,isAuthenticatedSurvey} from "./auth-guard";
import store from "../store";

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
router.beforeEach(async (to, from, next) => {
  await store.restored;
  next();
});

export default router;

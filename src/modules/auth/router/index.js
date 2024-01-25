import { isAuthenticatedSurvey } from "@/router/auth-guard";
export default {
  name: "auth",
  component: () =>
    import(
      /* webpackChunkName: "authLayout" */ "@/modules/auth/layouts/MainAuthLayout.vue"
    ),
  redirect: "/auth/login",
  children: [
    {
      path: "login",
      name: "auth-login",
      beforeEnter: [isAuthenticatedSurvey],
      component: () =>
        import(
          /* webpackChunkName: "login" */ "@/modules/auth/pages/Login.vue"
        ),
    },
    {
      path: "admin",
      name: "auth-admin",
      component: () =>
        import(
          /* webpackChunkName: "admin" */ "@/modules/auth/pages/Administracion/Admin.vue"
        ),
      redirect: "/auth/admin/usuarios",
      children: [
        {
          path: "usuarios",
          name: "admin-usuarios",
          component: () =>
            import(
              /* webpackChunkName: "usuarios" */ "@/modules/auth/pages/Administracion/Usuarios.vue"
            ),
        },
        {
          path: "grupos",
          name: "admin-grupos",
          component: () =>
            import(
              /* webpackChunkName: "grupos" */ "@/modules/auth/pages/Administracion/Grupos.vue"
            ),
        },
        {
          path: "proyectos",
          name: "admin-proyectos",
          component: () =>
            import(
              /* webpackChunkName: "proyectos" */ "@/modules/auth/pages/Administracion/Proyectos.vue"
            ),
        },
      ],
    },
  ],
};

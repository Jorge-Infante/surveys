export default {
  name: "survey",
  component: () =>
    import(
      /* webpackChunkName: "surveyLayout" */ "@/modules/surveys/layouts/SurveyLayout.vue"
    ),
  redirect: "/survey/listSurveys",
  children: [
    {
      path: "surveyFill",
      name: "survey-fill-out",
      component: () =>
        import(
          /* webpackChunkName: "survey-form" */ "@/modules/surveys/pages/Survey.vue"
        ),
    },
    {
      path: "surveyFillEdit/:id",
      name: "survey-fill-out-edit",
      component: () =>
        import(
          /* webpackChunkName: "survey-form" */ "@/modules/surveys/pages/Survey.vue"
        ),
      props: (route) => {
        return {
          id: route.params.id,
        };
      },
    },
    {
      path: "surveyForm",
      name: "survey-form",
      component: () =>
        import(
          /* webpackChunkName: "survey-form" */ "@/modules/surveys/pages/SchemeForm.vue"
        ),
    },
    {
      path: "listForms",
      name: "list-forms",
      component: () =>
        import(
          /* webpackChunkName: "list-forms" */ "@/modules/surveys/pages/FormsList.vue"
        ),
    },
    {
      path: "listSurveys",
      name: "list-surveys",
      component: () =>
        import(
          /* webpackChunkName: "list-surveys" */ "@/modules/surveys/pages/SurveysList.vue"
        ),
    },
    {
      path: "dashBoard",
      name: "dashBoard-surveys",
      component: () =>
        import(
          /* webpackChunkName: "dashBoard-surveys" */ "@/modules/surveys/pages/DashBoard.vue"
        ),
    },
  ],
};

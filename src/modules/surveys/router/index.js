export default {
  name: "survey",
  component: () =>
    import(
      /* webpackChunkName: "surveyLayout" */ "@/modules/surveys/layouts/SurveyLayout.vue"
    ),
  redirect: "/survey/surveyFill",
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
      path: "surveyForm",
      name: "survey-form",
      component: () =>
        import(
          /* webpackChunkName: "survey-form" */ "@/modules/surveys/pages/SchemeForm.vue"
        ),
    },
  ],
};

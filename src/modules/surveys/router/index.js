export default {
  name: "survey",
  component: () =>
    import(
      /* webpackChunkName: "surveyLayout" */ "@/modules/surveys/layouts/SurveyLayout.vue"
    )
};

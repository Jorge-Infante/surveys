export const setEntity = (state, surveys) => {
  state.surveys = surveys;
};
export const setForms = (state, forms) => {
  state.forms = forms;
};
export const setSurveys = (state, surveys) => {
  state.surveysList = surveys;
};
export const setFormToFill = (state, surveyToFill) => {
  state.surveyToFill = surveyToFill;
};
export const addForms = (state, form) => {
  state.forms = [form, ...state.forms];
};

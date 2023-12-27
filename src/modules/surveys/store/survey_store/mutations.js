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
export const addSurvey = (state, survey) => {
  state.surveysList = [survey, ...state.surveysList];
};
export const setUser = (state, user) => {
  state.user = user;
};
export const deleteForm = (state, id) => {
  state.forms = state.forms.filter((form) => form.id !== id);
};
export const updateSurvey = (state, surveyUpdate) => {
  let index = state.surveysList.findIndex(
    (survey) => survey.id === surveyUpdate.id
  );
  state.surveysList[index] = surveyUpdate;
};
export const setImages = (state,images) => {
  state.images = [images, ...state.images];
  console.log('IMAGES INTO STATE: ',state.images)
};

export const setEntity = (state, surveys) => {
  state.surveys = surveys;
};
export const setForms = (state, forms) => {
  state.forms = forms;
};
export const setSurveys = (state, surveys) => {
  state.surveysList = surveys;
};
export const setTotalSurveys = (state, total) => {
  state.totalSurveys = total;
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
export const updateFormSurvey = (state, surveyUpdate) => {
  let index = state.forms.findIndex(
    (survey) => survey.id === surveyUpdate.id
  );
  state.forms[index] = surveyUpdate;
  console.log('*** MUTANDO FORMS : ',surveyUpdate,'state.forms',state.forms)
};
export const setImages = (state, images) => {
  state.images = [images, ...state.images];
  console.log("IMAGES INTO STATE: ", state.images);
};

export const setDashBoard = (state, dashData) => {
  state.dashBoardData = dashData;
};

export const setDashBoardFilters = (state, filters) => {
  state.filters = filters;
};

export const deleteSurvey = (state, id) => {
  state.surveysList = state.surveysList.filter((item) => item.id != id);
};

export const setFiltersRunning = (
  state, { selectProject, selectSurvey, selectDep, selectMun, selectExt, search }
) => {
  console.log("setFiltersRunning", selectProject, selectSurvey, selectDep, selectMun, selectExt, search)
  state.selectProjectStore = selectProject;
  state.selectSurveyStore = selectSurvey;
  state.selectDepStore = selectDep;
  state.selectMunStore = selectMun;
  state.selectExtStore = selectExt;
  state.searchStore = search;
};
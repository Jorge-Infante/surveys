import { apiClient, imgClient } from "@/api/base_api";
export const saveSurvey = async ({ commit }, data) => {
  const url = "v1/survey/";
  const res = await apiClient.post(url, data);
  console.log("  --- SAVE SURVEY DATA: ", data);
  commit("addSurvey", res.data);
  return res;
};
export const saveFormSurvey = async ({ commit }, data) => {
  const url = "v1/survey-form/";
  const res = await apiClient.post(url, data);
  console.log("  --- SAVE FORM SURVEY DATA: ", data);
  console.log("  --- LA DATAAAAAA: ", res.data);
  commit("addForms", res.data);
  return res;
};
export const getForms = async ({ commit }) => {
  try {
    const url = "v1/survey-form/";
    const res = await apiClient.get(url);
    console.log("  --- RES FORM SURVEYS: ", res);
    commit("setForms", res.data);
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const getSurveys = async ({ commit }) => {
  try {
    const url = "v1/survey/";
    const res = await apiClient.get(url);
    console.log("  --- RES SURVEYS: ", res);
    commit("setSurveys", res.data);
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const formToFill = ({ commit }, formToFill) => {
  commit("setFormToFill", formToFill);
};
export const logOut = async ({ commit }, data) => {
  const url = "v1/logout/";
  const res = await apiClient.post(url, data);
  return res;
};
export const me = async ({ commit }) => {
  const url = "v1/me/";
  const res = await apiClient.get(url);
  console.log('RESPONSE USER ME: ',res.data)
  commit("setUser",res.data);
};
export const reSetForms = ({ commit }, forms) => {
  commit("setForms", forms);
};
export const reSetSurveys = ({ commit }, surveys) => {
  commit("setSurveys", surveys);
};
export const uploadFile = async ({ commit }, params) => {
  const data = new FormData();
  console.log("MIS PARAMS: ", params.file);
  data.append("file", params.file);

  const url = `v1/upload-files/`;
  const res = await imgClient.post(url, data);
  console.log("RESPONSE URL:", res.data.urls[0]);
  return res.data.urls[0];
};

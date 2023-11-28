import { apiClient } from "@/api/base_api";
export const saveSurvey = async ({ commit }, data) => {
  const url = "v1/survey/";
  const res = await apiClient.post(url, data);
  console.log("  --- SAVE SURVEY DATA: ", data);
  return res;
};
export const saveFormSurvey = async ({ commit }, data) => {
  const url = "v1/survey-form/";
  const res = await apiClient.post(url, data);
  console.log("  --- SAVE FORM SURVEY DATA: ", data);
  return res;
};
export const getForms = async ({ commit }) => {
  const url = "v1/survey-form/";
  const res = await apiClient.get(url);
  console.log("  --- RES SURVEYS: ", res);
  commit("setForms", res.data);
  return res;
};
export const formToFill = ({ commit }, formToFill) => {
  commit("setFormToFill", formToFill);
};

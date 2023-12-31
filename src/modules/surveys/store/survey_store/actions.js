import { apiClient, imgClient, downloadCsvApi } from "@/api/base_api";
export const saveSurvey = async ({ commit }, data) => {
  const url = "v1/survey/";
  const res = await apiClient.post(url, data);
  console.log("  --- SAVE SURVEY DATA: ", data);
  commit("addSurvey", res.data);
  return res;
};
export const updateSurvey = async ({ commit }, params) => {
  console.log("  --- UPDATE SURVEY DATA: ", params.data);
  const url = `v1/survey/${params.id}/`;
  const res = await apiClient.put(url, params.data);
  commit("updateSurvey", res.data);
  return res;
};
export const deleteFormSurvey = async ({ commit }, id) => {
  const url = `v1/survey-form/${id}/`;
  const res = await apiClient.delete(url);
  commit("deleteForm", id);
  console.log("  --- DELETE SURVEY : ", res, "el id: ", id);
  // commit("addSurvey", res.data);
  return res;
};
export const downloadCsv = async ({ commit }, slugName) => {
  const url = `v1/csv-download/?slug_name=${slugName}`;
  const res = await downloadCsvApi.get(url);
  // commit("addSurvey", res.data);
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
    return false;
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
export const getDashboard = async ({ commit }) => {
  try {
    const url = "v1/get-dashboard/";
    const res = await apiClient.get(url);
    console.log("  --- RES SURVEYS: ", res);
    commit("setDashBoard", res.data);
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
  console.log("RESPONSE USER ME: ", res.data);
  if (res.data.groups[0] === "administradores") {
    res.data.group = "administradores";
  } else if (res.data.groups[0] === "extensionistas") {
    res.data.group = "extensionistas";
  }

  commit("setUser", res.data);
};
export const reSetForms = ({ commit }, forms) => {
  commit("setForms", forms);
};
export const reSetSurveys = ({ commit }, surveys) => {
  commit("setSurveys", surveys);
};
export const reSetUser = ({ commit }, user) => {
  console.log("el user que llega: ", user);
  commit("setUser", user);
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
export const setImagesList = ({ commit }, images) => {
  console.log(images);
  commit("setImages", images);
};

import { authClient, apiClient } from "@/api/base_api";
export const login = async ({ commit }, data) => {
  const url = "/v1/token/";
  const res = await authClient.post(url, data);
  console.log(`RESPONSE API ${url}`, res);
  return res;
};
export const getEnty = async ({ commit }, params) => {
  const url = `/v1/${params.url}`;
  const res = await apiClient.get(url);
  console.log(`RESPONSE GET ENTY TO ${url}`, res);
  commit(params.mutation1, { key: params.enty, value: res.data });
};
export const saveEnty = async ({ commit }, params) => {
  console.log("DATA POST: ", params.data);
  const url = `/v1/${params.url}`;
  const res = await apiClient.post(url, params.data);
  console.log(`RESPONSE POST ENTY TO ${url}`, res);
  commit(params.mutation1, { key: params.enty, value: res.data });
};
export const updateEnty = async ({ commit }, params) => {
  console.log("DATA PUT: ", params.data);
  const url = `/v1/${params.url}`;
  const res = await apiClient.put(url, params.data);
  console.log(`RESPONSE PUT ENTY TO ${url}`, res);
  commit(params.mutation1, {
    key: params.enty,
    keySearch: params.keySearch,
    value: res.data,
  });
};
export const deleteEnty = async ({ commit }, params) => {
  console.log("DATA DELETE: ", params);
  const url = `/v1/${params.url}`;
  const res = await apiClient.delete(url);
  console.log(`RESPONSE POST ENTY TO ${url}`, res);
  commit(params.mutation1, {
    key: params.enty,
    keySearch: params.keySearch,
  });
};
export const saveInstructive = async ({ commit }, params) => {
  console.log("DATA POST: ", params.data);
  const url = `/v1/${params.url}`;
  const res = await apiClient.post(url, params.data);
  console.log(`RESPONSE POST ENTY TO ${url}`, res);
  commit("addInstructive", res.data);
};

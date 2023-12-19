import { apiClient } from "./base_api";
const refreshAccessToken = async (refreshToken) => {
  const refreshTkn = localStorage.getItem("refresh");
  console.log('REFRESCANDO CON: ',refreshTkn)
  // try {
    return apiClient.post("/v1/token/refresh/", {
      refresh: refreshTkn,
    })
    .then((resp) => {
      localStorage.setItem('access', resp.data.access);
      return resp.data.access;
    })
    .catch((error) => {
      console.error("Error refreshing access token:", error);
      return false
    })
  // } catch (error) {
  //   console.error("Error refreshing access token:", error);
  //   throw error;
  // }
};

export { refreshAccessToken };

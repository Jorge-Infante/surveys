import { apiClient } from "./base_api";
const refreshAccessToken = async (refreshToken) => {
  const refreshTkn = localStorage.getItem("refresh");
 console.log('REFRESCANDO CON: ',refreshTkn)
  try {
    const response = await apiClient.post("/v1/token/refresh/", {
      refresh: refreshTkn,
    });
    localStorage.setItem('access', response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

export { refreshAccessToken };

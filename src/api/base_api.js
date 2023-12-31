import axios from "axios";
import { refreshAccessToken } from "./auth_api";
import router from '@/router';
export const authClient = axios.create({
  baseURL: "https://test-apiothras.djsoftwaremakers.com/api/",
  withCredentials: false,

  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClient = axios.create({
  baseURL: "https://test-apiothras.djsoftwaremakers.com/api/",
  withCredentials: false,

  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Get the access token from where you stored it
    const accessToken = localStorage.getItem("access");

    // Add the access token to the Authorization header
    config.headers.Authorization = `Bearer ${accessToken}`;
    // console.log("CON ESTE ACCESS: ", accessToken);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Check if the error is due to an expired token
    console.log("___________EL ERRRRORRRRRR : ", error);
    console.log(
      "_________________dato _________________ >",
      error.response.data.detail
    );
    if (error.response.data.detail === "El token está en lista negra") {
      localStorage.removeItem("refresh");
      localStorage.removeItem("access");
      // console.log("EL RESULTADO DEL LOGUT: ", res);
      router.push({ name: "auth-login" });
    }
    if (error.response) {
      if (error.response.status === 401) {
        try {
          // Attempt to refresh the access token
          console.log("interceptando API CLIENT");
          refreshAccessToken().then((resp) => {
            console.log("MI NUEVO ACCESS: ", resp);
            if (resp !== false) {
              // Retry the original request with the new access token
              const originalRequest = error.config;
              originalRequest.headers.Authorization = `Bearer ${resp}`;
              apiClient(originalRequest);
              return 'success'
            } else {
              localStorage.removeItem("refresh");
              localStorage.removeItem("access");
              // console.log("EL RESULTADO DEL LOGUT: ", res);
              router.push({ name: "auth-login" });
            }
          })
          .catch((error) => {
            console.error("Error refreshing access token:", error);
            return Promise.reject(error);
          });
        } catch (refreshError) {
          console.error("Error refreshing access token:", refreshError);
          return Promise.reject(refreshError);
        }
      }
    }
    // Handle other errors
    return Promise.reject(error);
  }
);

export const imgClient = axios.create({
  baseURL: "https://test-apiothras.djsoftwaremakers.com/api/",
  withCredentials: false,
});

imgClient.interceptors.request.use(
  async (config) => {
    // Get the access token from where you stored it
    const accessToken = localStorage.getItem("access");

    // Add the access token to the Authorization header
    config.headers.Authorization = `Bearer ${accessToken}`;
    console.log("CON ESTE ACCESS: ", accessToken);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
imgClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Check if the error is due to an expired token
    console.log("___________EL ERRRRORRRRRR : ", error);
    if (error.response) {
      if (error.response.status === 401) {
        try {
          // Attempt to refresh the access token
          console.log("interceptando API CLIENT");
          const newAccessToken = await refreshAccessToken();
          console.log("MI NUEVO ACESS: ", newAccessToken);
          // Retry the original request with the new access token
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return imgClient(originalRequest);
        } catch (refreshError) {
          console.error("Error refreshing access token:", refreshError);

          return Promise.reject(refreshError);
        }
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export const downloadCsvApi = axios.create({
  baseURL: "https://test-apiothras.djsoftwaremakers.com/api/",
  withCredentials: false,
});

downloadCsvApi.interceptors.request.use(
  async (config) => {
    // Get the access token from where you stored it
    const accessToken = localStorage.getItem("access");

    // Add the access token to the Authorization header
    config.headers.Authorization = `Bearer ${accessToken}`;
    // console.log("CON ESTE ACCESS: ", accessToken);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

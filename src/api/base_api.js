import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://test-apiothras.djsoftwaremakers.com/api/",
  withCredentials: false,

  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAwNTQzODQ3LCJpYXQiOjE3MDA1NDM1NDcsImp0aSI6ImViNzdjNjI3ZmQ5YTQ0MjVhOTg1NDRhNDczNmMwNWFhIiwidXNlcl9pZCI6Mn0.7smX7krShRxiyMnT4Y-y1QuznT_6Tfy6ScTbFuxm-hA`,
  },
});

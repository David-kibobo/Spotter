import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;
if (!baseURL) {
  console.warn("REACT_APP_BASE_URL is not set. Falling back to localhost.");
}

const API = axios.create({
  baseURL: baseURL || "http://localhost:8000",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("session_cookie");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
    req.headers.Accept = "application/json";
    req.headers["X-CSRFToken"] = getCookie("csrftoken");
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Logging out...");
      localStorage.removeItem("session_cookie");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(";").shift() : null;
}

export default API;

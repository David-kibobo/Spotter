import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;
if (!baseURL) {
  console.warn("REACT_APP_BASE_URL is not set. Falling back to localhost.");
}

const API = axios.create({
  baseURL: baseURL || "http://localhost:8000",
  withCredentials: true, // ✅ Ensures cookies are sent if using session authentication
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access_token"); 
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
    req.headers.Accept = "application/json";
  }
 

  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Logging out...");
      
      // ✅ Only log out if the user is actually logged in
      const token = localStorage.getItem("access_token");
      if (token) {
        localStorage.removeItem("access_token");
        window.location.reload(); // 🔄 Safer than redirecting to `/`
      }
    }
    return Promise.reject(error);
  }
);

export default API;

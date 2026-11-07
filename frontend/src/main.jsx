import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { getErrorMessage } from './utils/errorHandler.js'

// Automatically include credentials and Bearer token for seamless cross-domain auth
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
    }
    const friendly = getErrorMessage(error);
    if (error?.response?.data && typeof error.response.data === "object") {
      error.response.data.message = friendly;
    }
    error.friendlyMessage = friendly;
    return Promise.reject(error);
  }
);

// Mouse movement listener for radial spotlight lighting
document.addEventListener('mousemove', (e) => {
  document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
  document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
});

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={store}>
    <App />
  </Provider>
  </BrowserRouter>
)


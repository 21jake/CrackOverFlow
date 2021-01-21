import axios from "axios";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

const instance = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/api`
});
// api/auth/dummy


instance.interceptors.request.use(config => {
    const token = localStorage.getItem('crackToken');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
}, err => {
    return Promise.reject(err);
})


export default instance;
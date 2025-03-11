import axios, { AxiosError, AxiosResponse } from 'axios';
// import { getAccessToken } from '../Storage/TokenStorage';
import { URL } from './defaultURL';

export const api = axios.create();
api.defaults.baseURL = URL.server;

function onError(response) {
    return response.response?.data;
}

function onSuccess(response) {
    return response.data;
}

export const services = {
    signIn: (data) => api.post("/user/signup", data).then(onSuccess, onError),
    logIn:(data) => api.post('/user/login', data).then(onSuccess, onError), 
    fetchTasks:(data) => api.post('/tasks/getalltasks', data).then(onSuccess, onError),
    createTasks:(data) => api.post('/tasks/create', data).then(onSuccess, onError),
    updateTask:(data) => api.post('/tasks/update', data).then(onSuccess, onError),
    deleteTask:(data) => api.post('/tasks/delete', data).then(onSuccess, onError),
};

//Logs
api.interceptors.request.use(
    request => {
        console.log(request.url, "----- request ----->", request.data)
        return request
    },
)
api.interceptors.response.use(
    response => {
        console.log(response.config.url, "+++++ response +++++>", response.data);
        return response
    },
)
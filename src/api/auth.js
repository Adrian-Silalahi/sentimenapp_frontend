import axios from "axios";

export const requestLoginAPI = (formValues) => {
  // return axios.post("http://localhost:5000/api/auth/login", {
  return axios.post("http://localhost:5000/api/auth/login", {
    email: formValues.email,
    password: formValues.password,
  });
};

export const requestRegisterAPI = (formValues) => {
  // return axios.post("http://localhost:5000/api/auth/register", {
  return axios.post("http://localhost:5000/api/auth/register", {
    username: formValues.username,
    email: formValues.email,
    password: formValues.password,
  });
};

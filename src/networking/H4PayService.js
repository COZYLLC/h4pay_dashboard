const { store } = require("../store");
const axios = require("axios")

function getService() {
  console.log(process.env.VUE_APP_API_URL)
  const axiosInstance = axios.create({
    baseUrl: process.env.VUE_APP_API_URL,
  })
  axiosInstance.interceptors.request.use(
    (config) => {
      console.log(config)
      config.headers["Content-Type"] = "application/json; charset=utf-8";
      config.headers["x-access-token"] = store.state.token;
      return config;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  )
  axiosInstance.interceptors.response.use(
    (response) => {
      return {
        status: response.data.status,
        result: response.data.result,
        message: response.data.message ?? response.statusText
      };
    },
    (error) => {
      return {
        status:false,
        message: error.toString()
      }
    }
  );
  return axiosInstance;  
}

module.exports.getService = getService;
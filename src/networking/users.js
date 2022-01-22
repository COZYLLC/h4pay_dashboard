import {getService} from "./H4PayService"
const baseUrl = process.env.VUE_APP_API_URL

function register(data) {
  return getService().post(`${baseUrl}/users/create`, data)
}

function getUnverifiedUsers() {
  return getService().get(`${baseUrl}/users/reqlist`)
}

export {register, getUnverifiedUsers}
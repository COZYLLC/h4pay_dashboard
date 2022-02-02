import { getService } from "./H4PayService";
const baseUrl = process.env.VUE_APP_API_URL + "/users";

function register(data) {
  return getService().post(`${baseUrl}/register`, data);
}

// Admin
function getUnverifiedUsers() {
  return getService().get(`${baseUrl}/reqlist`);
}

function approveUser(users) {
  const ids = [];
  for (var user of users) {
    ids.push(user.id);
  }
  return getService().post(`${baseUrl}/approve`, { id: ids, approve: true });
}

function rejectUser(users) {
  const ids = [];
  for (var user of users) {
    ids.push(user.id);
  }
  return getService().post(`${baseUrl}/approve`, { id: ids, approve: false });
}

export { register, getUnverifiedUsers, approveUser, rejectUser };

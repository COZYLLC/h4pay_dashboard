import { getService } from "./H4PayService";
import { createHash } from "crypto";
const baseUrl = process.env.VUE_APP_API_URL + "/schools";

function getSchools(filters) {
  return getService().get(`${baseUrl}/filter`, { filters });
}

function addSchool(data) {
  return getService().post(`${baseUrl}`, data);
}

function deleteSchool(schoolId) {
  return getService().post(`${baseUrl}/${schoolId}/delete`);
}

function changeSchoolPassword(data) {
  return getService().post(`${baseUrl}/changepass`, data);
}

function validatePassToken(token) {
  return getService().post(`${baseUrl}/validate`, {
    token: token,
  });
}

export {
  getSchools,
  addSchool,
  deleteSchool,
  changeSchoolPassword,
  validatePassToken,
};

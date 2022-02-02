import { getService } from "./H4PayService";
const baseUrl = process.env.VUE_APP_API_URL + "/notices";

function getNotices(params) {
  return getService().get(`${baseUrl}/filter`, { params });
}

function modifyNotice(id, data) {
  return getService().post(`${baseUrl}/${id}/modify`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function addNotice(data) {
  return getService().post(`${baseUrl}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export { getNotices, modifyNotice, addNotice };

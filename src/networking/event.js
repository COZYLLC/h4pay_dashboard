import { getService } from "./H4PayService";
const baseUrl = process.env.VUE_APP_API_URL + "/events";

function getEvents() {
  return getService().get(`${baseUrl}`);
}

function addEvent(data) {
  return getService().post(`${baseUrl}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function modifyEvent(id, data) {
  return getService().post(`${baseUrl}/${id}/modify`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export { getEvents, addEvent, modifyEvent };

import {getService} from "./H4PayService"
const baseUrl = process.env.VUE_APP_API_URL

function getEvents() {
  return getService().get(`${baseUrl}/event`)
}

function addEvent(data) {
  return getService().post(`${baseUrl}/event`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

function modifyEvent(id, data) {
  return getService().post(`${baseUrl}/event/${id}/modify`, data)
}

export {getEvents, addEvent, modifyEvent}
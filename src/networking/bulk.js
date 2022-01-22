import {getService} from "./H4PayService"
const baseUrl = process.env.VUE_APP_API_URL

function bulkRequestWithExcel() {
  return getService().post(`${baseUrl}/bulk/request/excel`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
}

function bulkRequest() {
  return getService().post(`${baseUrl}/bulk/request`, data)
}

function approveRequest(requestId, data) {
  return getService().post(`${baseUrl}/bulk/${requestId}/approve`, data)
}

function getBulkRequests(filters) {
  return getServiceq().get(`${baseUrl}/bulk/request/filter`, {params:filters})
}

export {bulkRequestWithExcel, bulkRequest, approveRequest, getBulkRequests}
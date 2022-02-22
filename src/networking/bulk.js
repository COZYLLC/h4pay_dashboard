import { getService } from "./H4PayService";
const baseUrl = process.env.VUE_APP_API_URL + "/bulks";

function bulkRequestWithExcel(data) {
  return getService().post(`${baseUrl}/request/excel`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function bulkRequest(data) {
  return getService().post(`${baseUrl}/request`, data);
}

function approveRequest(requestId) {
  return getService().post(`${baseUrl}/${requestId}/approve`);
}

function getBulkRequests(filters) {
  return getService().get(`${baseUrl}/request/filter`, { params: filters });
}

export { bulkRequestWithExcel, bulkRequest, approveRequest, getBulkRequests };

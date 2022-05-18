import { getService } from "./H4PayService";
const baseUrl = process.env.VUE_APP_API_URL + "/vouchers";

function issueVoucherRequest(data) {
  return getService().post(`${baseUrl}/request`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function getVoucherRequests(filters) {
  return getService().get(`${baseUrl}/request/filter`, { params: filters });
}

function getVouchers(filters) {
  return getService().get(`${baseUrl}/filter`, { params: filters });
}

function approveVoucherRequest(id, data) {
  return getService().post(`${baseUrl}/request/${id}/approve`, data);
}

export {
  issueVoucherRequest,
  getVoucherRequests,
  getVouchers,
  approveVoucherRequest,
};

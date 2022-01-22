import {getService} from "./H4PayService"
const baseUrl = process.env.VUE_APP_API_URL

function issueVoucherRequest(data) {
  return getService().post(`${baseUrl}/voucher/request`, data, {
    headers: {
      'Content-Type': "multipart/form-data"
    }
  })
}

function approveVoucherRequest(id, data) {
  return getService().post(`${baseUrl}/bulk/request/${id}/approve`, data)
}

function getVoucherRequests() {
  return getService().get(`${baseUrl}/voucher/request`)
}

function getVoucherRequestsWithFilter(filters) {
  return getService().get(`${baseUrl}/voucher/request/filter`, {params:filters})
}

function getVouchers(filters) {
  return getService().get(`${baseUrl}/voucher/filter`, {params:filters})
}

export {issueVoucherRequest, approveVoucherRequest, getVoucherRequests, getVoucherRequestsWithFilter, getVouchers}
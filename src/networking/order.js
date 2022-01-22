import {getService} from "./H4PayService"
const baseUrl = process.env.VUE_APP_API_URL

function getOrders() {
  return getService().get(`${baseUrl}/orders/retrieveall`)
}

function getOrdersWithFilter(data) {
  return getService().post(`${baseUrl}/orders/filter`, data)
}

function getOrdersFromUid(uid) {
  return getService().get(`${baseUrl}/orders/fromuid/${uid}`)
}

function exchangePurchase(type, data) {
  return getService().post(`${baseUrl}/${type}/exchange`, data)
}

function cancelOrder(orderId) {
  return getService().get(`${baseUrl}/orders/cancel/${orderId}`)
}

export {getOrders, getOrdersWithFilter, getOrdersFromUid, exchangePurchase, cancelOrder}
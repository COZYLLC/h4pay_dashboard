import {getService} from "./H4PayService"
const baseUrl = process.env.VUE_APP_API_URL + "/orders"

function getOrders(filter) {
  return getService().get(`${baseUrl}/filter`, {params:filter})
}

function exchangeOrder( data) {
  return getService().post(`${baseUrl}/exchange`, data)
}

function cancelOrder(orderId) {
  return getService().get(`${baseUrl}/cancel/${orderId}`)
}

export {getOrders, exchangeOrder, cancelOrder}
import {getService} from "./H4PayService"
const baseUrl = process.env.VUE_APP_API_URL

function getGifts(data) {
  return getService().post(`${baseUrl}/gift/filter`, data)
}

function exchangeGift() {
  return getService().post(`${baseUrl}/gift/exchange`)
}

function extendGift(orderId) {
  return getService().post(`${baseUrl}/gift/${orderId}/extend`)
}

export {getGifts, exchangeGift, extendGift}
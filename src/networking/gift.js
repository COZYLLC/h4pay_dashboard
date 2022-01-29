import {getService} from "./H4PayService"
const baseUrl = process.env.VUE_APP_API_URL + "/gifts"

function getGifts(data) {
  return getService().get(`${baseUrl}/filter`, data)
}

function exchangeGift(data) {
  return getService().post(`${baseUrl}/exchange`, data)
}

function extendGift(orderId) {
  return getService().post(`${baseUrl}/${orderId}/extend`)
}

export {getGifts, exchangeGift, extendGift}
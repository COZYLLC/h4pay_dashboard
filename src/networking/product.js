import {getService} from "./H4PayService"
const baseUrl = process.env.VUE_APP_API_URL

function getProducts() {
  return getService().get(`${baseUrl}/product`)
}

function getVisibleProducts() {
  return getService().get(`${baseUrl}/product/filter`, {
    "withStored": 0
  })
}

function addProduct(data) {
  return getService().post(`${baseUrl}/product/add`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

function removeProduct(data) {
  return getService().post(`${baseUrl}/product/delete`, data)
}

function modifyProduct(data) {
  return getService().post(`${baseUrl}/product/modify`, data)
}

export {getProducts, getVisibleProducts, addProduct, removeProduct, modifyProduct}
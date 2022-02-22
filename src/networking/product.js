import { getService } from "./H4PayService";
const baseUrl = process.env.VUE_APP_API_URL + "/products";

function getProducts() {
  return getService().get(`${baseUrl}`);
}

function getVisibleProducts() {
  return getService().get(`${baseUrl}/filter`, {
    withStored: 0,
  });
}

function addProduct(data) {
  return getService().post(`${baseUrl}/add`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function removeProduct(data) {
  return getService().post(`${baseUrl}/delete`, data);
}

function modifyProduct(data) {
  return getService().post(`${baseUrl}/modify`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export {
  getProducts,
  getVisibleProducts,
  addProduct,
  removeProduct,
  modifyProduct,
};

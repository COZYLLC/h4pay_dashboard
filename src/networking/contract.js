import { getService } from "./H4PayService";
const baseUrl = process.env.VUE_APP_API_URL + "/studentsinfos";

function uploadStudentInfos(data) {
  return getService().post(`${baseUrl}/upload`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export { uploadStudentInfos };

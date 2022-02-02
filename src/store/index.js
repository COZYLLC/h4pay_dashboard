/**
 프론트엔드 : 최경민 (https://github.com/KimWash)
 */

import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import axios from "axios";

Vue.use(Vuex);
export const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    stayLogin: false,
    token: "",
    role: "",
    uid: "",
    name: "",
    email: "",
    schoolId: "",
  },
  actions: {
    loginTokenA(context) {
      context.commit("loginTokenM");
    },
    logoutA(context) {
      context.commit("logoutM");
    },
    loginCheckA({ commit, state }) {
      const token = state.token;
      if (token == null) {
        return null;
      }
      return axios
        .post(
          process.env.VUE_APP_API_URL + `/users/tokencheck`,
          {},
          {
            //POST 요청을 보내서 토큰에 해당하는 유저데이터 불러와 가공. (created에서 호출 해 유저데이터 갱신)
            headers: {
              "x-access-token": token,
            },
          }
        )
        .then((res) => {
          console.log(res);
          commit("loginCheckM", {
            uid: res.data.result.uid,
            name: res.data.result.name,
            email: res.data.result.email,
            role: res.data.result.role,
            schoolId: res.data.result.schoolId,
          });
          return res;
        })
        .catch((e) => {
          console.error(e);
          commit("loginCheckM", {
            uid: null,
            name: null,
            email: null,
            role: null,
            schoolId: null,
          });
          return null;
        });
    },
  },
  mutations: {
    loginTokenM: function (state, payload) {
      state.token = payload;
    },
    logoutM: function (state) {
      if (state.token) {
        state.token = "";
        state.name = "";
        state.email = "";
        state.role = "";
        state.schoolId = "";
      }
    },
    loginCheckM: function (state, fetchedData) {
      state.uid = fetchedData.uid;
      state.name = fetchedData.name;
      state.email = fetchedData.email;
      state.role = fetchedData.role;
      state.schoolId = fetchedData.schoolId;
    },
  },
  getters: {
    getToken: (state) => state.token,
    getUid: (state) => state.uid,
    getName: (state) => state.name,
    getEmail: (state) => state.email,
    getRole: (state) => state.role,
    getSchoolId: (state) => state.schoolId,
  },
});

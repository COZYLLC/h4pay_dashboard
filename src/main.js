import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import buefy from 'buefy'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import 'buefy/dist/buefy.css'
import { faAngleLeft, faAngleRight, faArrowUp, faBoxes, faCalendar, faClipboardList, faGift, faPaperPlane, faPlus, faRocket, faSearch, faSignOutAlt, faTrash, faUser, faUsers, faUpload, faFileDownload, faKeyboard, faHome, faEye, faEyeSlash, faCheck, faExclamationCircle, faScroll, faCreditCard, faPenNib, faExchangeAlt, faHandPointer, faTimes, faMinus, faThumbsUp, faTable, faMousePointer,  } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

library.add(faSignOutAlt, faUser, faUsers, faRocket, faClipboardList, faGift, faBoxes, faSearch, faPlus, faTrash, faPaperPlane, faArrowUp, faAngleRight, faAngleLeft, faCalendar, faUpload, faFileDownload, faKeyboard, faHome, faEye, faEyeSlash, faCheck, faExclamationCircle, faScroll, faCreditCard, faPenNib, faExchangeAlt, faHandPointer, faTimes, faMinus, faThumbsUp, faTable, faMousePointer )
Vue.component('vue-fontawesome', FontAwesomeIcon)

Vue.use(buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas'
});

Vue.config.productionTip = false;
Vue.prototype.$axios = axios

Vue.component(VueCropper);


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import clickOutside from "./directives/clickOutside";
import clipboard from "vue-clipboard2";
import { applyDefaultTheme } from "./utils/customCssVars";
import { messagingSupported, messaging } from "./utils/firebaseInstance";
import { reportError } from "./services/userService";

Vue.use(clipboard);

if (messagingSupported) {
  messaging().onMessage(payload => {
    console.log("FCM Data: ", payload);
  });
}
Vue.prototype.$isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(
  navigator.userAgent.toLowerCase()
);

applyDefaultTheme(false);

Vue.config.errorHandler = function(err, vm, info) {
  console.error(err)
  const val = prompt(`An error has occored.\n${err}\nWould you like to report it?\n\nType in the box the action you were trying to do:`);
  if (val === null) return;
  reportError(err, val).then(() => {
    alert("Report sent. Thank you!")
  })
}


Vue.config.productionTip = false;
Vue.directive("click-outside", clickOutside);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

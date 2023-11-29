import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import store from "./store";
import router from "./router";
if(navigator.serviceWorker){
    navigator.serviceWorker.register('/sw.js')
}

loadFonts();

createApp(App).use(router).use(store).use(vuetify).mount("#app");
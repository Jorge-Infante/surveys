import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import store from "./store";
import router from "./router";
import './assets/scss/styles.scss'
if(navigator.serviceWorker){
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        // Envía un mensaje al Service Worker para forzar la recarga
                        newWorker.postMessage({ action: 'skipWaiting' });
                    }
                }
            });
        });
    })
    .catch((error) => {
        console.error('Error during service worker registration:', error);
    });
}

window.addEventListener('load', () => {
  let refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
});

loadFonts();

createApp(App).use(router).use(store).use(vuetify).mount("#app");
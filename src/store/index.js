import { createStore } from "vuex";
import survey_store from "@/modules/surveys/store/survey_store"
import auth_store from "@/modules/auth/store/auth_store";
import createPersistedState from 'vuex-persistedstate';
import localforage from 'localforage';

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    survey_store,
    auth_store
  },
  plugins: [
    createPersistedState({
      key: 'your-vuex-key',
      storage: {
        getItem: key => localforage.getItem(key),
        setItem: (key, value) => localforage.setItem(key, value),
        removeItem: key => localforage.removeItem(key),
      },
    }),
  ],
});

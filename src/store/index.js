import { createStore } from "vuex";
import survey_store from "@/modules/surveys/store/survey_store"
import auth_store from "@/modules/auth/store/auth_store";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    survey_store,
    auth_store
  },
});

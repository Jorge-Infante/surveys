<template>
  <v-app>
    <v-app-bar app class="main-header">
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-img
          class="mx-auto text-center"
          :width="60"
          cover
          src="@/assets/images/logo-o.jpg"
        ></v-img>
      </v-toolbar-title>
      Version 2.5

      <v-spacer></v-spacer>

      <!-- Show/hide based on screen size -->
      <v-btn
        v-show="administrador"
        text
        class="hidden-sm-and-down"
        :to="{ name: 'survey-form' }"
        >Crear encuesta</v-btn
      >
      <v-btn
        v-show="administrador"
        text
        class="hidden-sm-and-down"
        :to="{ name: 'list-forms' }"
        >Formularios</v-btn
      >
      <v-btn
        v-show="extensionista || administrador"
        text
        class="hidden-sm-and-down"
        :to="{ name: 'survey-fill-out' }"
      >
        Diligenciar encuesta
        <v-menu
          v-model="menuTop"
          :close-on-content-click="false"
          location="bottom"
          activator="parent"
        >
          <v-list>
            <v-list-item
              v-for="item in formularios"
              :key="item.id"
              @click="selectForm(item)"
            >
              {{ item.name }}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <v-btn
        v-show="extensionista || administrador"
        text
        class="hidden-sm-and-down"
        :to="{ name: 'list-surveys' }"
        >Encuestas</v-btn
      >
    </v-app-bar>
    <v-navigation-drawer v-model="drawer">
      <v-list density="compact" nav>
        <v-list-item
          v-show="administrador"
          @click="handleCloseDrawer"
          prepend-icon="mdi-file-document-plus"
          title="Crear encuesta"
          class="text-left"
          value="create-survey"
          :to="{ name: 'survey-form' }"
        ></v-list-item>
        <v-list-item
          v-show="administrador"
          @click="handleCloseDrawer"
          prepend-icon="mdi-script-text-outline"
          title="Formularios"
          value="forms"
          class="text-left"
          :to="{ name: 'list-forms' }"
        ></v-list-item>
        <v-list-item
          v-show="extensionista || administrador"
          class="text-left"
          prepend-icon="mdi-text-box-edit-outline"
          append-icon="mdi-menu-down-outline"
          title="Diligenciar encuesta"
          value="home"
          :to="{ name: 'survey-fill-out' }"
        >
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            location="bottom"
            activator="parent"
          >
            <v-list>
              <v-list-item
                v-for="item in formularios"
                :key="item.id"
                @click="selectForm(item)"
              >
                {{ item.name }}
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
        <v-list-item
          v-show="extensionista || administrador"
          @click="handleCloseDrawer"
          prepend-icon="mdi-text-box-check-outline"
          title="Encuestas"
          class="text-left"
          value="encuestas"
          :to="{ name: 'list-surveys' }"
        ></v-list-item>
        <v-list-item
          v-show="coordinador || administrador"
          @click="handleCloseDrawer"
          prepend-icon="mdi-file-document-plus"
          title="DashBoard"
          class="text-left"
          value="dashBoard-surveys"
          :to="{ name: 'dashBoard-surveys' }"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            :loading="loading"
            block
            @click="handleLogOut"
            class="btn-outline-primary"
          >
            Cerrar sesión
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main
      ><v-container> <router-view></router-view> </v-container
    ></v-main>
  </v-app>
</template>

<script>
import { mapActions, mapState } from "vuex";
import isOnline from "is-online";
import { refreshAccessToken } from "@/api/auth_api";
import Survey from "../pages/Survey.vue";
import localforage from "localforage";
export default {
  data: () => ({
    drawer: false,
    rail: true,
    fav: true,
    menu: false,
    menuTop: false,
    loading: false,
    isConnected: true,
    extensionista: null,
    administrador: null,
    coordinador: null,
    formularios: null,
  }),
  components: {
    Survey,
  },
  created() {},
  methods: {
    ...mapActions("survey_store", [
      "getForms",
      "formToFill",
      "getSurveys",
      "logOut",
      "reSetForms",
      "reSetSurveys",
      "reSetUser",
    ]),
    // async getUser() {
    //   await this.me();
    // },
    handleCloseDrawer() {
      this.drawer = false;
    },
    handleCloseMenuTop() {
      this.menuTop = false;
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    selectForm(item) {
      if (Object.entries(this.formToFill).length === 0) {
        this.formularios = JSON.parse(JSON.stringify(this.forms));
        console.log("EL ITEM: ", item);
        this.formToFill(item);
      }
      this.menu = false;
      this.handleCloseDrawer();
      this.handleCloseMenuTop();
    },
    async handleLogOut() {
      this.loading = true;
      const refresh = localStorage.getItem("refresh");
      let data = { refresh_token: refresh };

      try {
        const res = await this.logOut(data);

        if (res.status == 200) {
          localStorage.removeItem("refresh");
          localStorage.removeItem("access");
          // console.log("EL RESULTADO DEL LOGUT: ", res);
          this.$router.push({ name: "auth-login" });
        }
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    async getData() {
      const key = "your-vuex-key";
      await this.checkInternetConnection();
      console.log("ASI EL INTERNET: ", this.isConnected);
      try {
        const value = await localforage.getItem(key);
        let nuevo = JSON.parse(value);
        console.log("LOS FORMULARIOS EN INDEXED: ", nuevo.survey_store.forms);
        console.log(
          "LOS ENCUESTAS EN INDEXED: ",
          nuevo.survey_store.surveysList
        );
        console.log("EL USER EN INDEXED: ", nuevo.survey_store.user);
        this.reSetForms(nuevo.survey_store.forms);
        this.reSetSurveys(nuevo.survey_store.surveysList);
        this.reSetUser(nuevo.survey_store.user);
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
      this.getNetwork();
    },
    async checkInternetConnection() {
      try {
        // Check if the user is online
        this.isConnected = await isOnline();
      } catch (error) {
        console.error("Error checking internet connection:", error);
      }
    },
    async refillUser() {
      const key = "your-vuex-key";
      const value = await localforage.getItem(key);
      let nuevo = JSON.parse(value);
      console.log("REFILLuSER", nuevo);
      this.reSetUser(nuevo.survey_store.user);
    },
    async refreshToken() {
      await refreshAccessToken();
    },
    getNetwork() {
      try {
        this.refreshToken().then((resp) => {
          try {
            this.getForms();
            this.getSurveys();
            this.refillUser();
          } catch (error) {
            console.log("error en network");
          }
        });
      } catch (error) {
        if (error.code == "ERR_NETWORK") {
          console.log("SIN INTERNET");
        }
      }
    },
  },
  mounted() {
    this.getData();
  },
  unmounted() {
    this.loading = false;
  },
  computed: {
    ...mapState("survey_store", ["forms", "surveyToFill", "user"]),
  },
  watch: {
    user(nuevo) {
      console.log("SI CAMBIA CUANDO RECARGO");
      if (this.user.group === "administradores") {
        this.administrador = true;
      } else if (this.user.group === "extensionistas") {
        this.extensionista = true;
      } else if (this.user.group === "coordinador") {
        this.coordinador = true;
      }
    },
    forms() {
      this.formularios = JSON.parse(JSON.stringify(this.forms));
      console.log("LOS FORMULARIOOO: ", this.formularios);
    },
  },
};
</script>

<style></style>

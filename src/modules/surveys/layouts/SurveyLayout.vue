<template>
  <v-layout>
    <v-navigation-drawer permanent>
      <v-list density="compact" nav>
        <!-- <v-list-item
          prepend-icon="mdi-text-box-edit-outline"
          title="Diligenciar encuesta"
          value="home"
          :to="{ name: 'survey-fill-out' }"
        ></v-list-item> -->
        <v-list-item
          prepend-icon="mdi-script-text-outline"
          title="Formularios"
          value="forms"
          :to="{ name: 'list-forms' }"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-file-document-plus"
          title="Crear encuesta"
          value="create-survey"
          :to="{ name: 'survey-form' }"
        ></v-list-item>

        <v-list-item
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
                v-for="item in forms"
                :key="item.id"
                @click="selectForm(item)"
              >
                {{ item.name }}
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main style="height: 400px"><router-view></router-view></v-main>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Survey from "../pages/Survey.vue";
export default {
  data: () => ({
    drawer: true,
    rail: true,
    fav: true,
    menu: false,
  }),
  components: {
    Survey,
  },
  methods: {
    ...mapActions("survey_store", ["getForms", "formToFill"]),
    selectForm(item) {
      if (Object.entries(this.formToFill).length === 0) {
        this.formToFill(item);
      }
    },
  },
  mounted() {
    this.getForms();
  },
  computed: {
    ...mapState("survey_store", ["forms", "surveyToFill"]),
  },
};
</script>

<style></style>

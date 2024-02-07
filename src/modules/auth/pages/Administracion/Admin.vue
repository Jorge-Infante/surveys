<template>
  <v-layout>
    <v-navigation-drawer permanent>
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-account-supervisor-circle"
          title="Grupos"
          value="groups"
          :to="{ name: 'admin-grupos' }"
          ><template v-slot:append>
            <v-btn
              size="x-small"
              variant="text"
              icon="mdi-plus"
              @click="handleShowFormGroup"
            ></v-btn> </template
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Usuarios"
          value="users"
          :to="{ name: 'admin-usuarios' }"
          ><template v-slot:append>
            <v-btn
              size="x-small"
              variant="text"
              icon="mdi-plus"
              @click="handleShowFormUser"
            ></v-btn> </template
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-chart-multiple"
          title="Proyectos"
          value="projects"
          :to="{ name: 'admin-proyectos' }"
          ><template v-slot:append>
            <v-btn
              size="x-small"
              variant="text"
              icon="mdi-plus"
              @click="handleShowFormProject"
            ></v-btn> </template
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-list-box-outline"
          title="Instructivo"
          value="instructives"
          :to="{ name: 'admin-instructivos' }"
          ><template v-slot:append>
            <v-btn
              size="x-small"
              variant="text"
              icon="mdi-plus"
              @click="handleShowFormInstructive"
            ></v-btn> </template
        ></v-list-item>
        <!-- <v-list-item
          prepend-icon="mdi-file-sign"
          title="Encuestas"
          value="surveys"
          :to="{ name: 'survey-fill-out' }"
        >
          <template v-slot:append>
            <v-btn
              size="x-small"
              variant="text"
              icon="mdi-swap-horizontal"
            ></v-btn> </template
        ></v-list-item> -->
        <v-list-item
          prepend-icon="mdi-file-document-plus"
          title="Crear encuesta"
          class="text-left"
          value="create-survey"
          :to="{ name: 'survey-form' }"
        ></v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            block
            class="btn-outline-primary"
            :to="{ name: 'survey-fill-out' }"
          >
            Encuestas
            <v-icon icon="mdi-logout" end></v-icon>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main><router-view></router-view></v-main>
  </v-layout>
  <FormUserVue
    :dialogFormUser="dialogFormUser"
    @on:cancelFormUser="handleCancelFormUser"
  />
  <FormGroup
    :dialogFormGroup="dialogFormGroup"
    @on:cancelFormGroup="handleCancelFormGroup"
  />
  <FormInstructive
    :dialogFormInstructive="dialogFormInstructive"
    @on:cancelFormInstructive="handleCancelFormInstructive"
  />
  <FormProject
    :dialogFormProject="dialogFormProject"
    @on:cancelFormProject="handleCancelFormProject"
  />
</template>

<script>
import FormGroup from "../../components/FormGroup.vue";
import FormUserVue from "../../components/FormUser.vue";
import FormProject from "../../components/FormProject.vue";
import FormInstructive from "../../components/FormInstructive.vue";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      dialogFormUser: false,
      dialogFormGroup: false,
      dialogFormProject: false,
      dialogFormInstructive: false,
    };
  },
  created() {
    this.getUsers();
    this.getGroups();
    this.getProjects();
    this.getForms();
    this.getInstructives();
  },
  methods: {
    ...mapActions("auth_store", ["getEnty"]),
    async getUsers() {
      const params = { url: "users/", mutation1: "setState", enty: "users" };
      await this.getEnty(params);
    },
    async getGroups() {
      const params = { url: "groups/", mutation1: "setState", enty: "groups" };
      await this.getEnty(params);
    },
    async getProjects() {
      const params = {
        url: "projects/",
        mutation1: "setState",
        enty: "projects",
      };
      await this.getEnty(params);
    },
    async getInstructives() {
      const params = {
        url: "instruccions/",
        mutation1: "setState",
        enty: "instructives",
      };
      await this.getEnty(params);
    },
    async getForms() {
      const params = {
        url: "survey-form/",
        mutation1: "setState",
        enty: "forms",
      };
      await this.getEnty(params);
    },
    handleShowFormGroup() {
      this.dialogFormGroup = true;
    },
    handleShowFormUser() {
      this.dialogFormUser = true;
    },
    handleShowFormProject() {
      this.dialogFormProject = true;
    },
    handleShowFormInstructive() {
      this.dialogFormInstructive = true;
    },
    handleCancelFormGroup() {
      this.dialogFormGroup = false;
    },
    handleCancelFormUser() {
      this.dialogFormUser = false;
    },
    handleCancelFormProject() {
      this.dialogFormProject = false;
    },
    handleCancelFormInstructive() {
      this.dialogFormInstructive = false;
    },
  },
  components: {
    FormGroup,
    FormUserVue,
    FormProject,
    FormInstructive,
  },
};
</script>

<style></style>

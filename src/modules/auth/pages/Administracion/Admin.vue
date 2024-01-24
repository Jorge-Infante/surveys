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
          value="clockin"
          :to="{ name: 'admin-usuarios' }"
          ><template v-slot:append>
            <v-btn
              size="x-small"
              variant="text"
              icon="mdi-plus"
              @click="handleShowFormUser"
            ></v-btn> </template
        ></v-list-item>

        <v-list-item prepend-icon="mdi-file-sign" title="Proyectos" value=""
          ><template v-slot:append>
            <v-btn
              size="x-small"
              variant="text"
              icon="mdi-plus"
            ></v-btn> </template
        ></v-list-item>
      </v-list>
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
</template>

<script>
import FormGroup from "../../components/FormGroup.vue";
import FormUserVue from "../../components/FormUser.vue";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      dialogFormUser: false,
      dialogFormGroup: false,
    };
  },
  created() {
    // this.getUsers();
    this.getGroups();
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
    handleShowFormGroup() {
      this.dialogFormGroup = true;
    },
    handleShowFormUser() {
      this.dialogFormUser = true;
    },
    handleCancelFormGroup() {
      this.dialogFormGroup = false;
    },
    handleCancelFormUser() {
      this.dialogFormUser = false;
    },
  },
  components: {
    FormGroup,
    FormUserVue,
  },
};
</script>

<style></style>

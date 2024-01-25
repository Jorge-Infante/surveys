<template>
  <v-toolbar title="Usuarios"
    ><template v-slot:append>
      <v-btn
        size="small"
        variant="text"
        icon="mdi-plus"
        @click="handleShowFormUser"
      ></v-btn> </template
  ></v-toolbar>
  <v-data-table :headers="headers" :items="users"> </v-data-table>
  <FormUserVue
    :dialogFormUser="dialogFormUser"
    @on:cancelFormUser="handleCancelFormUser"
  />
</template>

<script>
import { mapState } from "vuex";
import FormUserVue from "../../components/FormUser.vue";
export default {
  data() {
    return {
      dialogFormUser: false,
    };
  },
  computed: {
    ...mapState("auth_store", ["users"]),
    headers() {
      return [
        { align: "center", key: "id", title: "Id" },
        { align: "center", key: "user.username", title: "Nombre de usuario" },
        { align: "center", key: "user.first_name", title: "Nombre" },
        { align: "center", key: "ext_profile", title: "Perfil" },
        
        // { align: "center", key: "last_name", title: "Apellido" },
      ];
    },
  },
  components: {
    FormUserVue,
  },
  methods: {
    handleShowFormUser() {
      this.dialogFormUser = true;
    },
    handleCancelFormUser() {
      this.dialogFormUser = false;
    },
  },
};
</script>

<style></style>

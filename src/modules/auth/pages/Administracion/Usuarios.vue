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
  <v-data-table :headers="headers" :items="users">
    <template v-slot:item.actions="{ item }">
      <v-row>
        <v-btn icon size="x-small" @click="handleUpdateUser(item)"
          ><v-tooltip activator="parent" location="start"
            >Actualizar grupo</v-tooltip
          ><v-icon>mdi-file-document-refresh-outline</v-icon></v-btn
        >
        <v-btn icon size="x-small" class="ml-1"
          ><v-tooltip activator="parent" location="start"
            >Eliiminar grupo</v-tooltip
          ><v-icon>mdi-trash-can-outline</v-icon></v-btn
        >
      </v-row>
    </template>
  </v-data-table>
  <FormUserVue
    :dialogFormUser="dialogFormUser"
    :userToUpdate="userToUpdate"
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
      userToUpdate: null,
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
        { title: "Actions", key: "actions", sortable: false },

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
    handleUpdateUser(item) {
      this.userToUpdate = item;
    },
  },
};
</script>

<style></style>

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
  <FormUserVue :dialogFormUser="dialogFormUser" @on:cancelFormUser="handleCancelFormUser" />
</template>

<script>
import FormUserVue from "../../components/FormUser.vue";
export default {
  data() {
    return {
      dialogFormUser: false,
      users: [
        {
          username: "louis",
          email: "louis@gmail.com",
          first_name: "loius",
          last_name: "mango",
        },
        {
          username: "louis",
          email: "louis@gmail.com",
          first_name: "loius",
          last_name: "mango",
        },
        {
          username: "louis",
          email: "louis@gmail.com",
          first_name: "loius",
          last_name: "mango",
        },
        {
          username: "louis",
          email: "louis@gmail.com",
          first_name: "loius",
          last_name: "mango",
        },
        {
          username: "louis",
          email: "louis@gmail.com",
          first_name: "loius",
          last_name: "mango",
        },
      ],
    };
  },
  computed: {
    headers() {
      return [
        { align: "center", key: "username", title: "Usuario" },
        { align: "center", key: "email", title: "Correo" },
        { align: "center", key: "first_name", title: "Nombre" },
        { align: "center", key: "last_name", title: "Apellido" },
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
    handleCancelFormUser(){
      this.dialogFormUser = false;
    }
  },
};
</script>

<style></style>

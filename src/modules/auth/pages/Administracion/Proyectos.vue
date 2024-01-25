<template>
  <v-toolbar title="Proyectos"
    ><template v-slot:append>
      <v-btn
        size="small"
        variant="text"
        icon="mdi-plus"
        @click="handleShowFormProject"
      ></v-btn> </template
  ></v-toolbar>
  <v-data-table :headers="headers" :items="projects"> </v-data-table>
  <FormProject
    :dialogFormProject="dialogFormProject"
    @on:cancelFormProject="handleCancelFormProject"
  />
</template>

<script>
import FormProject from "../../components/FormProject.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {
      dialogFormProject: false,
    };
  },
  computed: {
    ...mapState("auth_store", ["projects"]),
    headers() {
      return [
        { align: "center", key: "id", title: "Id proyecto" },
        { align: "center", key: "name", title: "Nombre del proyecto" },
      ];
    },
  },
  components: {
    FormProject,
  },
  methods: {
    handleShowFormProject() {
      this.dialogFormProject = true;
    },
    handleCancelFormProject() {
      this.dialogFormProject = false;
    },
  },
};
</script>

<style></style>

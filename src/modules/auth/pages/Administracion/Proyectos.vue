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
  <v-data-table :headers="headers" :items="projects">
    <template v-slot:item.actions="{ item }">
      <v-row>
        <v-btn icon size="x-small" @click="handleUpdateProject(item)"
          ><v-tooltip activator="parent" location="start"
            >Actualizar grupo</v-tooltip
          ><v-icon>mdi-file-document-refresh-outline</v-icon></v-btn
        >
        <v-btn
          icon
          size="x-small"
          class="ml-1"
          @click="handleDeleteProject(item.id)"
          ><v-tooltip activator="parent" location="start"
            >Eliiminar grupo</v-tooltip
          ><v-icon>mdi-trash-can-outline</v-icon></v-btn
        >
      </v-row>
    </template>
  </v-data-table>
  <FormProject
    :dialogFormProject="dialogFormProject"
    :projectToUpdate="projectToUpdate"
    @on:cancelFormProject="handleCancelFormProject"
  />
</template>

<script>
import FormProject from "../../components/FormProject.vue";
import { mapActions, mapState } from "vuex";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      dialogFormProject: false,
      projectToUpdate: null,
    };
  },
  computed: {
    ...mapState("auth_store", ["projects"]),
    headers() {
      return [
        { align: "center", key: "id", title: "Id proyecto" },
        { align: "center", key: "name", title: "Nombre del proyecto" },
        { title: "Actions", key: "actions", sortable: false },
      ];
    },
  },
  components: {
    FormProject,
  },
  methods: {
    ...mapActions("auth_store", ["deleteEnty"]),
    handleShowFormProject() {
      this.dialogFormProject = true;
    },
    handleCancelFormProject() {
      this.dialogFormProject = false;
      this.projectToUpdate = null;
    },
    handleUpdateProject(item) {
      this.dialogFormProject = true;
      this.projectToUpdate = item;
    },
    async handleDeleteProject(id) {
      const params = {
        url: `projects/${id}/`,
        mutation1: "removeState",
        enty: "projects",
        keySearch: id,
      };
      Swal.fire({
        text: "¡No podrá revertir los cambios!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          try {
            this.deleteEnty(params);
            Swal.fire({
              title: "¡Proyecto eliminado exitosamente!",
              icon: "success",
            });
          } catch (error) {
            Swal.fire({
              title: "¡Error al eliminar proyecto!",
              icon: "error",
            });
            console.log(error);
          }
        }
      });
    },
  },
};
</script>

<style></style>

<template>
  <v-toolbar title="Formularios" density="compact"></v-toolbar>
  <v-table class="mt-5" fixed-header height="300px" density="compact">
    <thead>
      <tr>
        <th class="text-center">Id</th>
        <th class="text-center">Nombre</th>
        <th class="text-center">Slug</th>
        <th class="text-center">Autor</th>
        <th class="text-center">Configuración</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in forms" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.slug_name }}</td>
        <td>{{ item.author_username }}</td>
        <td>
          <v-btn icon size="x-small" @click="handleDeleteForm(item.id)"
            ><v-icon>mdi-delete-empty-outline</v-icon></v-btn
          >
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
<script>
import { mapActions, mapState } from "vuex";
import Swal from "sweetalert2";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("survey_store", ["forms"]),
  },
  methods: {
    ...mapActions("survey_store", ["deleteFormSurvey"]),
    handleDeleteForm(itemId) {
      Swal.fire({
        text: "¡No podrá revertir este cambio!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Estoy seguro",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          try {
            this.deleteFormSurvey(itemId);
            Swal.fire({
              title: "¡Eliminado!",
              icon: "success",
            });
          } catch (error) {
            Swal.fire({
              title: "¡Upps... error al eliminar!",
              icon: "error",
            });
          }
        }
      });
      //
    },
  },
  mounted() {},
};
</script>

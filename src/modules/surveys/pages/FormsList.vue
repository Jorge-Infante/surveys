<template>
  <div>
    <v-toolbar
      title="Formularios"
      density="compact"
      class="card-title"
    ></v-toolbar>

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
            <v-btn
              class="mr-2"
              icon
              size="x-small"
              :loading="loading"
              @click="handleDownloadCsv(item.slug_name, item.name)"
            >
              <v-icon>mdi-download-outline</v-icon>
            </v-btn>
            <v-btn
              class="mr-2"
              icon
              size="x-small"
              @click="handleDeleteForm(item.id)"
            >
              <v-icon>mdi-delete-empty-outline</v-icon>
            </v-btn>
            <v-btn icon size="x-small" @click="hadleEditForm(item)">
              <v-icon>mdi-file-document-refresh-outline</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState("survey_store", ["forms"]),
  },
  methods: {
    ...mapActions("survey_store", ["deleteFormSurvey", "downloadCsv"]),
    hadleEditForm(item) {
      console.log("--- Param edit form : ", item,"---");
      item.update = true;
      const form_id = item.id;

      this.$router.push({
        name: "survey-form-edit",
        params: { id: form_id, showForm: true },
      });

    },
    handleDeleteForm(itemId) {
      Swal.fire({
        text: "¡No podrá revertir este cambio!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00a2d3",
        cancelButtonColor: "#ea7a45",
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
    handleDownloadCsv(slugName, name) {
      this.loading = true;
      this.downloadCsv(slugName)
        .then((response) => {
          // Crear un objeto URL para el blob
          const url = window.URL.createObjectURL(new Blob([response.data]));

          // Crear un enlace temporal y hacer clic para descargar
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${name}.csv`);
          document.body.appendChild(link);
          link.click();

          // Limpiar el enlace y el objeto URL después de la descarga
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.error("Error al descargar el archivo:", error);
        });
    },
  },
  mounted() {
    console.log("LOA FOORMS: ", this.forms);
  },
};
</script>

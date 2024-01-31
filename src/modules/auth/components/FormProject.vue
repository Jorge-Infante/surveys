<template>
  <v-dialog v-model="dialog" width="800">
    <v-card class="px-6 py-8">
      <v-toolbar title="Creación de proyecto"></v-toolbar>

      <v-form class="mt-4">
        <v-row>
          <v-col cols="6">
            <v-text-field clearable label="Nombre" v-model="name"></v-text-field
          ></v-col>
          <v-col cols="6">
            <v-autocomplete
              v-model="surveys_select"
              :items="forms"
              label="Encuesta"
              item-value="id"
              item-title="name"
              multiple
              :returnObject="false"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <br />
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          size="small"
          variant="elevated"
          @click="handleSaveProject"
        >
          Guardar
        </v-btn>
        <v-btn
          color="success"
          size="small"
          type="submit"
          variant="elevated"
          @click="dialog = false"
        >
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      dialog: false,
      name: null,
      surveys_select: null,
      surveys_select_arr: [],
      updateProject: false,
      updateItem: null,
    };
  },
  props: {
    dialogFormProject: { type: Boolean },
    projectToUpdate: { type: Object },
  },
  methods: {
    ...mapActions("auth_store", ["saveEnty", "updateEnty"]),
    async handleSaveProject() {
      if (this.updateProject) {
        let newSurveysSelect = this.surveys_select.map((element) => element.id);
        this.surveys_select = newSurveysSelect;
        const params = {
          url: `projects/${this.updateItem.id}/`,
          mutation1: "updateState",
          enty: "projects",
          keySearch: this.updateItem.id,
          data: this.formData,
        };
        try {
          await this.updateEnty(params);
          this.dialog = false;
          Swal.fire({
            title: "!Proyecto actualizado exitosamente!",
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            title: "¡Error al actulizar proyecto!",
            icon: "error",
          });
          console.log(error);
        }
      } else {
        const params = {
          url: "projects/",
          mutation1: "addEnty",
          enty: "projects",
          data: this.formData,
        };
        try {
          await this.saveEnty(params);
          this.dialog = false;
          Swal.fire({
            title: "¡Proyecto registrado exitosamente!",
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            title: "¡Error al registrar proyecto!",
            icon: "error",
          });
          console.log(error);
        }
      }
      this.clearData();
    },
    clearData() {
      this.name = null;
      this.surveys_select = null;
      this.surveys_select_arr = [];
      this.updateProject = false;
      this.updateItem = null;
    },
  },
  computed: {
    ...mapState("auth_store", ["forms"]),
    formData() {
      let data = {
        name: this.name,
        surveys: this.surveys_select_arr,
      };
      return data;
    },
  },
  watch: {
    dialogFormProject(newValue) {
      this.dialog = newValue;
    },
    dialog(newValue) {
      if (newValue === false) {
        this.$emit("on:cancelFormProject");
        this.clearData();
      }
    },
    projectToUpdate(newValue) {
      this.dialog = true;
      this.updateProject = true;
      this.updateItem = newValue;
      this.name = newValue.name;
      this.surveys_select = newValue.surveys;
      console.log(newValue);
    },
    surveys_select(newValue) {
      this.surveys_select_arr = newValue;
    },
  },
};
</script>

<style></style>

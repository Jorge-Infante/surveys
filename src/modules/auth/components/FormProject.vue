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
export default {
  data() {
    return {
      dialog: false,
      name: null,
      surveys_select: null,
    };
  },
  props: {
    dialogFormProject: { type: Boolean },
  },
  methods: {
    ...mapActions("auth_store", ["saveEnty"]),
    async handleSaveProject() {
      const params = {
        url: "projects/",
        mutation1: "addEnty",
        enty: "projects",
        data: this.formData,
      };
      try {
        await this.saveEnty(params);
        this.dialog = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    ...mapState("auth_store", ["forms"]),
    formData() {
      let data = {
        name: this.name,
        surveys: this.surveys_select,
      };
      return data;
    },
  },
  watch: {
    dialogFormProject(newValue) {
      this.dialog = newValue;
    },
    dialog(newValue) {
      if (newValue === false) this.$emit("on:cancelFormProject");
    },
  },
};
</script>

<style></style>

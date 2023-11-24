<template>
  <v-container>
    <v-row class="d-flex justify-center" v-if="loading">
      <v-col cols="2">
        <v-progress-circular
          :size="50"
          :width="5"
          color="green"
          indeterminate
        ></v-progress-circular>
      </v-col>
    </v-row>

    <v-card v-if="!loading">
      <v-toolbar density="compact" v-if="titulo" :color="'grey darken-4'">
        <v-toolbar-title>
          {{ titulo }}
        </v-toolbar-title></v-toolbar
      >
      <v-row v-if="!titulo">
        <v-col cols="10" class="ma-1">
          <v-text-field
            v-model="inputTitle"
            label="Nombre de la encuenta"
          ></v-text-field>
        </v-col>
        <v-col cols="1" class="mt-3">
          <v-btn icon @click="handleSetTitle" size="small"
            ><v-icon>mdi-check-all</v-icon></v-btn
          >
        </v-col>
      </v-row>
      <v-row class="ma-1">
        <v-col cols="4" v-for="(item, index) in formScheme" :key="index">
          <v-text-field
            v-model="formScheme[index].value"
            v-if="item.type == 'Texto'"
            :label="item.label"
          ></v-text-field>
          <v-text-field
            v-model="formScheme[index].value"
            v-if="item.type == 'Numerico'"
            :label="item.label"
          ></v-text-field>
          <v-select
            v-model="formScheme[index].value"
            v-if="item.type == 'Seleccion simple'"
            :label="item.label"
            :items="item.options"
            item-title="valor"
            item-value="clave"
          ></v-select>
          <v-combobox
            v-model="formScheme[index].value"
            v-if="item.type == 'Selecccion multiple'"
            :label="item.label"
            :items="item.options"
            item-title="valor"
            item-value="clave"
            multiple
          ></v-combobox>
        </v-col>
      </v-row>
    </v-card>

    <v-card-actions class="d-flex justify-end">
      <v-btn @click="handleShowConfig">Agregar pregunta</v-btn>
      <v-btn @click="printForm">Guardar</v-btn>
    </v-card-actions>
    <v-row class="d-flex justify-center" v-if="success">
      <v-col cols="2">
        <v-alert density="compact" type="success" title="Guardado"></v-alert>
      </v-col>
    </v-row>
    <ConfigSurvey
      @on:handleAddForm="addAttrForm"
      :dialogConfig="dialogConfig"
    />
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import ConfigSurvey from "../components/ConfigSurvey.vue";
export default {
  data: () => ({
    dialogConfig: false,
    formScheme: [],
    countFields: 0,
    titulo: null,
    inputTitle: null,
    loading: false,
    success: false,
  }),
  computed: {
    formData() {
      let data = {
        name: this.titulo,
        data: this.formScheme,
      };
      return data;
    },
  },
  components: {
    ConfigSurvey,
  },
  methods: {
    ...mapActions("survey_store", ["saveSurvey"]),
    handleShowConfig() {
      this.dialogConfig = true;
    },
    addAttrForm(nuevo) {
      nuevo.value = null;
      console.log("NUEVO DATO PARA EL FORM: ", nuevo);
      this.formScheme.push(nuevo);
      this.dialogConfig = false;
    },
    async printForm() {
      console.log("el esquema: ", this.formScheme);
      this.loading = true;
      try {
        const res = await this.saveSurvey(this.formData);
        console.log(" ---- EL RESPONSE: ", res);
        if (res.status == 201) {
          console.log(" ---- EL RESPONSE 2: ", res.status);
          this.success = true;
          this.loading = false;
          setTimeout(() => {
            this.success = false;
          }, 1000);
        }
      } catch (error) {
        this.loading = false;
      } finally {
        this.clearData();
      }
    },
    handleSetTitle() {
      this.titulo = this.inputTitle;
    },
    clearData() {
      this.titulo = null;
      this.formScheme = [];
      this.inputTitle = null;
    },
  },
};
</script>

<style>
.container-border {
  border-radius: 50px;
}
</style>

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

    <v-card v-if="!loading" flat color="transparent">
      <v-toolbar
        density="compact"
        v-if="titulo"
        :color="'grey darken-4'"
        class="mb-4"
      >
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
        <v-card
          class="mb-4 text-left"
          width="100%"
          min-height="300"
          :title="seccion.nombre"
          :subtitle="seccion.descripcion"
          variant="elevated"
          v-for="seccion in seccions"
          :key="seccion.id"
          elevation="4"
        >
          <v-divider></v-divider>
          <v-row class="ma-2">
            <v-col
              cols="12"
              sm="6"
              md="4"
              v-for="(item, index) in seccion.questions"
              :key="index"
            >
              <v-text-field
                v-model="seccion.questions[index].value"
                v-if="item.type == 'Texto'"
                :label="item.label"
              ></v-text-field>
              <v-text-field
                v-model="seccion.questions[index].value"
                v-if="item.type == 'Numerico'"
                :label="item.label"
              ></v-text-field>
              <v-select
                v-model="seccion.questions[index].value"
                v-if="item.type == 'Seleccion simple'"
                :label="item.label"
                :items="item.options"
                item-title="valor"
                item-value="clave"
              ></v-select>
              <v-combobox
                v-model="seccion.questions[index].value"
                v-if="item.type == 'Selecccion multiple'"
                :label="item.label"
                :items="item.options"
                item-title="valor"
                item-value="clave"
                multiple
              ></v-combobox>
              <v-text-field
                v-model="seccion.questions[index].value"
                v-if="item.type == 'Fecha'"
                type="datetime-local"
                :format="dateFormat"
                :label="item.label"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </v-row>
    </v-card>

    <v-card-actions class="d-flex justify-end">
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
      :currentSeccion="currentSeccion"
    />
    <SeccionConfig
      :dialogSeccion="dialogSeccion"
      @on:handleAddSeccion="addSeccion"
    />
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import SeccionConfig from "../components/SeccionConfig.vue";
import ConfigSurvey from "../components/ConfigSurvey.vue";
import PouchDB from "pouchdb";
export default {
  data: () => ({
    dialogConfig: false,
    formScheme: [],
    countFields: 0,
    titulo: null,
    inputTitle: null,
    loading: false,
    success: false,
    dialogSeccion: false,
    currentSeccion: null,
    seccions: [],
    latitude: null,
    longitude: null,
    dateFormat: "YYYY-MM-DD HH:mm",
    db: new PouchDB("test_pouch"),
  }),
  mounted() {
    this.titulo = this.surveyToFill.name;
    this.seccions = this.surveyToFill.data;
  },
  created() {
    this.getLocation();
  },
  computed: {
    ...mapState("survey_store", ["surveyToFill"]),
    formData() {
      let data = {
        name: this.titulo,
        data: {
          localizacion: { latitud: this.latitude, longitud: this.longitude },
          survey: this.seccions,
        },
      };
      return data;
    },
  },
  components: {
    ConfigSurvey,
    SeccionConfig,
  },
  methods: {
    ...mapActions("survey_store", ["saveSurvey"]),
    handleShowConfig(seccion) {
      this.currentSeccion = seccion;
      this.dialogConfig = true;
    },
    addAttrForm(nuevo) {
      nuevo.value = null;
      let idxSeccion = this.findIndexById(nuevo.idSeccion);
      console.log(
        "NUEVO DATO PARA EL FORM: ",
        nuevo,
        "PARA LA SECCION : ",
        idxSeccion
      );
      // this.formScheme.push(nuevo);
      this.seccions[idxSeccion].questions.push(nuevo);
      this.dialogConfig = false;
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          this.handleSuccess,
          this.handleError
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    },
    async handleSuccess(position) {
      console.log("------------position: ", position);
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    },
    handleError(error) {
      console.error(`Error getting location: ${error.message}`);
    },
    async printForm() {
      console.log(" === > EL ESQUEMA : ", this.formData);
      console.log("la localizacion: ", this.latitude, this.latitude);
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
      this.seccions = [];
    },
    handleAddSeccion() {
      this.dialogSeccion = true;
    },
    addSeccion(seccion) {
      console.log("SECCION CAPTURADA: ", seccion);
      seccion.questions = [];
      this.dialogSeccion = false;
      this.seccions.push(seccion);
    },
    findObjectById(idToFind) {
      return this.seccions.find((item) => item.id === idToFind);
    },
    findIndexById(idToFind) {
      return this.seccions.findIndex((item) => item.id === idToFind);
    },
  },
  watch: {
    surveyToFill(nuevo) {
      console.log("nuevo valor: ", nuevo);
      this.titulo = nuevo.name;
      this.seccions = nuevo.data;
    },
    latitude(nuevo) {
      console.log("aqui va: ", nuevo);
    },
  },
};
</script>

<style>
.container-border {
  border-radius: 50px;
}
</style>

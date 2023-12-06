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
        class="mb-4 d-flex align-center justify-space-between"
      >
        <v-toolbar-title>
          {{ titulo }}
        </v-toolbar-title></v-toolbar
      >
      <v-row v-if="!titulo">
        <v-alert
          type="info"
          title="Seleccione encuesta a diligenciar."
        ></v-alert>
      </v-row>
      <v-row class="ma-1">
        <v-card
          class="mb-4 text-left"
          width="100%"
          min-height="300"
          variant="elevated"
          v-for="seccion in seccions"
          :key="seccion.id"
          elevation="4"
        >
          <v-row>
            <v-col cols="12">
              <div
                class="text-h6 text-medium-emphasis d-flex align-center justify-space-between ml-2"
              >
                {{ seccion.nombre }}
              </div>
              <div
                class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between ml-2"
              >
                {{ seccion.descripcion }}
              </div>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="ma-2">
            <v-col
              cols="12"
              sm="6"
              md="4"
              v-for="(item, index) in seccion.questions"
              :key="index"
            >
              <div
                v-if="item.label"
                class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
              >
                {{ item.label }}
              </div>
              <div
                v-if="item.descripcion"
                class="text-subtitle-2 text-medium-emphasis d-flex align-center justify-space-between"
              >
                {{ item.descripcion }}
              </div>
              <v-text-field
                v-model="seccion.questions[index].value"
                v-if="item.type == 'Texto'"
              ></v-text-field>
              <v-text-field
                v-model="seccion.questions[index].value"
                v-if="item.type == 'Numerico'"
                type="number"
                :rules="[rules.numbers]"
              ></v-text-field>
              <v-select
                v-model="seccion.questions[index].value"
                v-if="item.type == 'Seleccion simple'"
                :items="item.options"
                item-title="valor"
                item-value="clave"
              ></v-select>
              <v-combobox
                v-model="seccion.questions[index].value"
                v-if="item.type == 'Selecccion multiple'"
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
              ></v-text-field>
              <v-file-input
                v-model="seccion.questions[index].value"
                v-if="item.type == 'Imagen'"
                accept="image/*"
                variant="filled"
                prepend-icon="mdi-camera"
                @click:prepend="imgFocus(seccion.questions[index], index)"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card>
      </v-row>
    </v-card>

    <v-card-actions class="d-flex justify-end" v-if="titulo">
      <v-btn @click="printForm">Guardar</v-btn>
    </v-card-actions>
    <!-- <v-row class="d-flex justify-center" v-if="success">
      <v-col cols="2">
        <v-alert density="compact" type="success" title="Guardado"></v-alert>
      </v-col>
    </v-row> -->
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
import Swal from "sweetalert2";
import isOnline from "is-online";
import SeccionConfig from "../components/SeccionConfig.vue";
import ConfigSurvey from "../components/ConfigSurvey.vue";
import db from "@/services/pouchdb";
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
    online: navigator.onLine,
    db: null,
    items: [],
    isConnected: true,
    sectionToFind: null,
    currentUrl: null,
    rules: {
      numbers: (value) =>
        !value || /[0-9]+$/.test(value) || "Solo permite numeros",
    },
  }),
  mounted() {
    this.$watch(
      "seccions",
      (newValue, oldValue) => {
        if (this.sectionToFind) {
          let seccion = this.findObjectById(this.sectionToFind.idSeccion);
          this.sectionToFind.seccionIdx = this.findIndexById(
            this.sectionToFind.idSeccion
          );
          this.sectionToFind.seccion = seccion;
          if (seccion) {
            let question = seccion.questions[this.sectionToFind.questionIdx];
            this.sectionToFind.question = question;
            if (question.type === "Imagen") {
              console.log("ES UNA IMAGEN EN ARRAY: ", question);
              if (!question.url) {
                this.uploadImage(question.value[0], seccion, question);
              }
            }
          }
        }
        // console.log("List changed:", oldValue, "=>", newValue);
      },
      { deep: true }
    );
    this.titulo = this.surveyToFill.name;
    this.seccions = this.surveyToFill.data;
  },
  created() {
    this.getLocation();
    this.db = db;
    // this.fetchItems();
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
    ...mapActions("survey_store", ["saveSurvey", "uploadFile","formToFill"]),
    imgFocus(input, indexArg) {
      this.sectionToFind = {
        idSeccion: input.idSeccion,
        questionIdx: indexArg,
      };
      this.index = indexArg;
      console.log("EL INPUT: ", input, "index: ", this.index);
    },
    async checkInternetConnection() {
      try {
        // Check if the user is online
        this.isConnected = await isOnline();
      } catch (error) {
        console.error("Error checking internet connection:", error);
      }
    },
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

      await this.checkInternetConnection();
      if (!this.isConnected) {
        await this.addItem();
        this.loading = false;
        Swal.fire({
          title: "¡Registrado exitosamente!",
          icon: "success",
        });
        this.clearData();
      } else {
        try {
          const res = await this.saveSurvey(this.formData);
          if (res.status == 201) {
            console.log(" ---- EL RESPONSE 2: ", res.status);
            this.loading = false;
            Swal.fire({
              title: "¡Registrado exitosamente!",
              icon: "success",
            });
          }
        } catch (error) {
          this.loading = false;
          Swal.fire({
            title: "¡Error al registrarlo!",
            icon: "error",
          });
        } finally {
          this.clearData();
        }
      }
    },
    handleSetTitle() {
      this.titulo = this.inputTitle;
    },
    clearData() {
      console.log('*** CLEAR DATA ***')
      this.titulo = null;
      this.formScheme = [];
      this.inputTitle = null;
      this.seccions = [];
      const toFill={}
      this.formToFill(toFill);
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
    async fetchItems() {
      try {
        const result = await this.db.allDocs({ include_docs: true });
        this.items = result.rows.map((row) => row.doc);
        console.log("los items: ", this.items);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    },
    async addItem() {
      const newItem = {
        _id: new Date().toISOString(),
        name: this.formData,
      };

      try {
        await this.db.put(newItem);
        this.fetchItems();
      } catch (error) {
        console.error("Error adding item:", error);
      }
    },
    updateOnlineStatus() {
      // Update the 'online' data property based on the current network status
      this.online = navigator.onLine;
    },
    async uploadImage(file, seccion, question) {
      let params = { file };
      let res = await this.uploadFile(params);
      console.log("LA QUESTION: ", res);
      this.currentUrl = res.url;
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
    currentUrl(nuevo) {
      //remplazar value en la  pregunta
      let question = this.sectionToFind.question;
      let seccion = this.sectionToFind.seccion;

      question.url = `https://test-apiothras.djsoftwaremakers.com${nuevo}`;
      //reemplazar pregunta en la seccion
      seccion.questions[this.sectionToFind.questionIdx] = question;
      //reeemplazar seccion en las secciones
      this.seccions[this.sectionToFind.seccionIdx] = seccion;
      console.log("LAS SECCIONES: ", this.seccions);
    },
  },
};
</script>

<style>
.container-border {
  border-radius: 50px;
}
</style>

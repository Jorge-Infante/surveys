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

    <v-card v-if="!loading" flat color="transparent" elevation="0">
      <v-toolbar
        density="compact"
        v-if="titulo"
        class="d-flex align-center justify-space-between card-title"
      >
        <v-toolbar-title>
          {{ titulo }}
        </v-toolbar-title></v-toolbar
      >
      <div v-if="!titulo && instructives" v-html="instructives.text"></div>
      <v-row v-if="!titulo && !instructives">
        <v-alert
          type="info"
          title="Seleccione encuesta a diligenciar, no hay registro de intructivos"
        ></v-alert>
      </v-row>
      <v-row class="ma-1">
        <v-card
          class="mb-4 text-left"
          width="100%"
          min-height="300"
          elevation="0"
        >
          <v-expansion-panels variant="accordion" v-model="panel">
            <v-expansion-panel
              v-for="(seccion, index) in seccions"
              :key="index"
            >
              <v-expansion-panel-title>
                <v-row>
                  <v-col cols="12">
                    <div
                      class="text-h6 d-flex align-center justify-space-between ml-2"
                    >
                      {{ seccion.nombre }}
                    </div>
                  </v-col>
                </v-row>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row class="ma-2">
                  <v-col
                    cols="12"
                    class="d-flex align-center justify-space-between ml-2"
                  >
                    {{ seccion.descripcion }}
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                    v-for="(item, index) in seccion.questions"
                    :key="index"
                  >
                    <div
                      v-if="item.label"
                      class="d-flex align-center justify-space-between label-form"
                    >
                      {{ item.label }}
                    </div>
                    <div
                      v-if="item.descripcion"
                      class="d-flex align-center justify-space-between label-form semi-bold"
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
                    <v-autocomplete
                      v-model="seccion.questions[index].value"
                      v-if="item.type == 'Selecccion multiple'"
                      :items="item.options"
                      item-title="valor"
                      return-object
                      item-value="clave"
                      multiple
                    ></v-autocomplete>
                    <v-text-field
                      v-model="seccion.questions[index].value"
                      v-if="item.type == 'Fecha'"
                      type="date"
                      :format="dateFormat"
                    ></v-text-field>
                    <v-file-input
                      v-model="seccion.questions[index].value"
                      :loading="loadingImage"
                      :disabled="loadingImage"
                      v-if="item.type == 'Imagen'"
                      :hint="urlImage(item.url)"
                      persistent-hint
                      accept="image/*"
                      variant="filled"
                      prepend-icon="mdi-camera"
                      @mousedown:control="
                        imgFocus(seccion.questions[index], index)
                      "
                      @click:prepend="imgFocus(seccion.questions[index], index)"
                    ></v-file-input>
                    <v-select
                      v-model="seccion.questions[index].value"
                      v-if="item.order == 'questionMain'"
                      :items="item.options"
                      item-title="valor"
                      item-value="clave"
                      return-object
                      @update:modelValue="selectQuestionMain(index, item)"
                    ></v-select>
                    <v-select
                      v-model="seccion.questions[index].value"
                      v-if="item.order == 'questionDep'"
                      :items="item.showOptions"
                      item-title="valor"
                      item-value="clave"
                      return-object
                      @update:modelValue="selectQuestionDep(index, item)"
                    ></v-select>
                    <v-select
                      v-model="seccion.questions[index].value"
                      v-if="item.order == 'questionDep2'"
                      :items="item.showOptions"
                      item-title="valor"
                      item-value="clave"
                      return-object
                      @update:modelValue="selectQuestionDep2(index, item)"
                    ></v-select>
                    <v-select
                      v-model="seccion.questions[index].value"
                      v-if="item.order == 'questionDep3'"
                      :items="item.showOptions"
                      item-title="valor"
                      item-value="clave"
                      return-object
                    ></v-select>
                    <v-select
                      v-model="seccion.questions[index].value"
                      v-if="item.type == 'Seleccion con texto'"
                      :items="item.optionsInput"
                      item-title="valor"
                      item-value="clave"
                      return-object
                      @update:modelValue="
                        selectQuestionMainInput(index, item, seccion)
                      "
                    ></v-select>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-row>
    </v-card>

    <v-card-actions class="d-flex justify-end" v-if="titulo">
      <v-btn
        v-show="showSurvey == 'true' || fillSurvey"
        @click="printForm"
        class="btn-primary"
        >Guardar</v-btn
      >
      <v-btn
        v-show="showSurvey == 'false'"
        @click="$router.go(-1)"
        class="btn-primary"
        >Ir atrás</v-btn
      >
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
import { toastInfo } from "@/helpers/sweetalert2";
import Swal from "sweetalert2";
import isOnline from "is-online";
import SeccionConfig from "../components/SeccionConfig.vue";
import ConfigSurvey from "../components/ConfigSurvey.vue";
import db from "@/services/pouchdb";
export default {
  data: () => ({
    dialogConfig: false,
    surveyToUpdate: null,
    formScheme: [],
    countFields: 0,
    titulo: null,
    slug_name: null,
    inputTitle: null,
    loading: false,
    success: false,
    dialogSeccion: false,
    currentSeccion: null,
    seccions: [],
    latitude: null,
    longitude: null,
    dateFormat: "YYYY-MM-DD",
    online: navigator.onLine,
    db: null,
    items: [],
    isConnected: true,
    sectionToFind: null,
    currentUrl: null,
    loadingImage: false,
    panel: [0],
    arrImages: [],
    imgFlag: false,
    fillSurvey: false,
    rules: {
      numbers: (value) =>
        !value || /[0-9]+$/.test(value) || "Solo permite numeros",
    },
  }),
  mounted() {
    this.$watch(
      "seccions",
      (newValue, oldValue) => {
        if (this.sectionToFind && this.seccions) {
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
              if (!question.url || this.imgFlag) {
                let img = {
                  idSeccion: this.sectionToFind.idSeccion,
                  idxQuestion: this.sectionToFind.questionIdx,
                  img: question.value[0],
                };
                this.setImagesList(img);
                // this.arrImages.push(img);
                console.log("ARRAY DE IMAGENES: ", this.arrImages);
                this.uploadImage(question.value[0], seccion, question);
              }
            }
          }
        }
        // console.log("List changed:", oldValue, "=>", newValue);
      },
      { deep: true }
    );
    // this.titulo = this.surveyToFill.name;
    // this.seccions = this.surveyToFill.data;
    if (this.id) {
      this.selectSurvey(this.id);
    }
    console.log(" ### ---- showSurvey ---- ### :", this.showSurvey);
  },
  created() {
    this.getInstructives();
    this.getLocation();
    this.db = db;
    // this.fetchItems();
  },
  computed: {
    ...mapState("survey_store", ["surveyToFill", "surveysList", "appVersion"]),
    ...mapState("auth_store", ["instructives"]),
    formData() {
      let data = {
        name: this.titulo,
        slug_name: this.slug_name,
        data: {
          appVersion: this.appVersion,
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
  props: {
    item: {
      type: String,
      required: false,
    },
    id: {
      required: false,
    },
    showSurvey: {
      required: false,
    },
  },
  methods: {
    ...mapActions("survey_store", [
      "saveSurvey",
      "uploadFile",
      "formToFill",
      "updateSurvey",
      "setImagesList",
    ]),
    ...mapActions("auth_store", ["getEnty"]),
    async getInstructives() {
      const params = {
        url: "instruccions/",
        mutation1: "setState",
        enty: "instructives",
      };
      await this.getEnty(params);
    },
    selectQuestionMain(index, question) {
      let seccion = this.findObjectById(question.idSeccion);
      console.log(
        "SECCION: ",
        seccion,
        "index: ",
        index,
        "question: ",
        question.idShared
      );
      for (let [index, item] of seccion.questions.entries()) {
        if (item.idShared == question.idShared && item.order == "questionDep") {
          console.log("LA PREGUNTA: ", item);
          const questionDep = item.options.filter(
            (dep) => dep.idPrincipal == question.value.id
          );
          console.log(questionDep, index);
          console.log(seccion.questions[index]);
          seccion.questions[index].value = null;
          seccion.questions[index].showOptions = questionDep;
          // seccion.questions
        }
      }
      // let preguntas = seccion.questions.filter((item) =>
      //   item.idShared == question.idShared
      // );
      // console.log("PREGUNTAS: ", preguntas);
    },
    selectQuestionDep(index, question) {
      let seccion = this.findObjectById(question.idSeccion);
      console.log(
        "SECCION: ",
        seccion,
        "index: ",
        index,
        "question: ",
        question.idShared
      );
      for (let [index, item] of seccion.questions.entries()) {
        if (
          item.idShared == question.idShared &&
          item.order == "questionDep2"
        ) {
          console.log("LA PREGUNTA: ", item);
          const questionDep2 = item.options.filter(
            (dep) => dep.idPrincipal == question.value.id
          );
          seccion.questions[index].value = null;
          seccion.questions[index].showOptions = questionDep2;
        }
      }
    },
    selectQuestionDep2(index, question) {
      let seccion = this.findObjectById(question.idSeccion);
      console.log(
        "SECCION: ",
        seccion,
        "index: ",
        index,
        "question: ",
        question.idShared
      );
      for (let [index, item] of seccion.questions.entries()) {
        if (
          item.idShared == question.idShared &&
          item.order == "questionDep3"
        ) {
          console.log("LA PREGUNTA: ", item);
          const questionDep3 = item.options.filter(
            (dep) => dep.idPrincipal == question.value.id
          );
          seccion.questions[index].value = null;
          seccion.questions[index].showOptions = questionDep3;
        }
      }
    },
    selectQuestionMainInput(index, item, seccion) {
      if (item.value.input) {
        console.log(index, item, seccion);
        let newQuestion = {
          idSeccion: seccion.id,
          label: item.value.label,
          descripcion: item.value.descripcion,
          type: "Texto",
          input: item.value.input,
          valor: item.value.valor,
        };
        if (!seccion.questions[index + 1]) {
          seccion.questions.splice(index + 1, 0, newQuestion);
        } else {
          if (newQuestion != item.value.valor) {
            seccion.questions.splice(index + 1, 1);
            seccion.questions.splice(index + 1, 0, newQuestion);
          }
        }
      } else {
        seccion.questions.splice(index + 1, 1);
      }
      // myArray.splice(insertIndex, 0, newElement);
    },
    urlImage(url) {
      if (url) {
        let test = url.startsWith("https")
          ? url
          : `https://apiothras.djsoftwaremakers.com${url}`;

        return test;
      }
    },
    imgFocus(input, indexArg) {
      this.imgFlag = true;
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
        if (this.surveyToUpdate) {
          const params = { id: this.surveyToUpdate.id, data: this.formData };
          try {
            const upRes = await this.updateSurvey(params);
            console.log("RESPOSE UPDATE:  ", upRes);
            if (upRes.status == 200) {
              this.loading = false;
              Swal.fire({
                title: "Actualizado exitosamente!",
                icon: "success",
              });
            }
          } catch (error) {
            this.loading = false;
            Swal.fire({
              title: "¡Error al actualizar!",
              icon: "error",
            });
          } finally {
            this.$router.go(-1);
            this.clearData();
          }
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
      }
    },
    handleSetTitle() {
      this.titulo = this.inputTitle;
    },
    clearData() {
      console.log("*** CLEAR DATA ***");
      this.titulo = null;
      this.formScheme = [];
      this.inputTitle = null;
      this.seccions = [];
      const toFill = {};
      this.formToFill(toFill);
      this.surveyToUpdate = null;
      this.fillSurvey = false;
    },
    selectSurvey(id) {
      let survey = this.surveysList.find((item) => item.id == id);
      if (!survey) {
        this.$router.go(-1);
      } else {
        console.log("la encuesta seleccionda: ", survey, id);
        this.surveyToUpdate = survey;
        this.titulo = survey.name;
        this.seccions = survey.data.survey;
        this.slug_name = survey.slug_name;
      }
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
      this.loadingImage = true;
      let params = { file };
      try {
        let res = await this.uploadFile(params);
        console.log("LA QUESTION: ", res);
        this.currentUrl = res.url;
        this.loadingImage = false;
        toastInfo.fire({
          icon: "success",
          title: "¡Imagen guardada!",
        });
      } catch (error) {
        await this.checkInternetConnection();
        if (!this.isConnected) {
          toastInfo.fire({
            icon: "success",
            title: "¡Imagen preparada para sincronizar!",
          });
        } else {
          toastInfo.fire({
            icon: "error",
            title: "¡Error guardando imagen!",
          });
          this.loadingImage = false;
          console.log("ERROR CARGANDO IMAGEN: ", error);
        }
        this.loadingImage = false;
      }
    },
  },
  watch: {
    "$route.query": {
      immediate: true, // Trigger the watcher immediately on component mount
      handler(newQuery, oldQuery) {
        if (newQuery.item) {
          const survey = JSON.parse(newQuery.item);
          this.surveyToUpdate = survey;
          this.titulo = survey.name;
          this.seccions = survey.data.survey;
          this.slug_name = survey.slug_name;
          console.log(
            "TITULO NUEVO: ",
            this.titulo,
            "SECCIONES: ",
            this.seccions,
            "SLUG: ",
            survey.slug_name
          );
          console.log("cambiando query params:", survey);
        }
      },
    },
    surveyToFill(nuevo) {
      this.surveyToUpdate = null;
      this.fillSurvey = true;
      console.log("nuevo valor: ", nuevo);
      this.titulo = nuevo.name;
      this.seccions = nuevo.data;
      this.slug_name = nuevo.slug_name;
    },
    latitude(nuevo) {
      console.log("aqui va: ", nuevo);
    },
    currentUrl(nuevo) {
      //remplazar value en la  pregunta
      let question = this.sectionToFind.question;
      let seccion = this.sectionToFind.seccion;

      question.url = `https://apiothras.djsoftwaremakers.com${nuevo}`;
      //reemplazar pregunta en la seccion
      seccion.questions[this.sectionToFind.questionIdx] = question;
      //reeemplazar seccion en las secciones
      this.seccions[this.sectionToFind.seccionIdx] = seccion;
      console.log("LAS SECCIONES: ", this.seccions);
      this.imgFlag = false;
    },
    titulo(titulo) {
      console.log("CHANGE TITULOOOOOOO", titulo);
    },
  },
  unmounted() {
    this.clearData();
  },
};
</script>

<style>
.container-border {
  border-radius: 50px;
}
</style>

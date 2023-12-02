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
        <v-card
          class="mb-4 text-left"
          width="100%"
          min-height="300"
          variant="outlined"
          v-for="seccion in seccions"
          :key="seccion.id"
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
              <v-text-field readonly v-if="item.type == 'Texto'"></v-text-field>
              <v-text-field
                readonly
                v-if="item.type == 'Numerico'"
              ></v-text-field>
              <v-select
                readonly
                v-if="item.type == 'Seleccion simple'"
                :items="item.options"
                item-title="valor"
                item-value="clave"
              ></v-select>
              <v-combobox
                readonly
                v-if="item.type == 'Selecccion multiple'"
                :items="item.options"
                item-title="valor"
                item-value="clave"
                multiple
              ></v-combobox>
              <v-text-field
                readonly
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
                @click="capturarImagen(seccion.questions[index].value)"
              ></v-file-input>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-btn @click="handleShowConfig(seccion)" icon>
              <v-tooltip activator="parent" location="end"
                >Agregar pregunta</v-tooltip
              >
              <v-icon> mdi-file-document-plus-outline </v-icon></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-row>
      <v-row>
        <v-col cols="1" class="justify-start">
          <v-btn class="mb-2" icon size="small" @click="handleAddSeccion">
            <v-tooltip activator="parent" location="end"
              >Agregar sección</v-tooltip
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-col>
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
      @on:handleCancel="cancelConfigSurvey"
      :dialogConfig="dialogConfig"
      :currentSeccion="currentSeccion"
    />
    <SeccionConfig
      @on:handleCancel="cancelSeccionConfig"
      :dialogSeccion="dialogSeccion"
      @on:handleAddSeccion="addSeccion"
    />
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import SeccionConfig from "../components/SeccionConfig.vue";
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
    dialogSeccion: false,
    currentSeccion: null,
    seccions: [],
    dateFormat: "YYYY-MM-DD HH:mm",
  }),
  computed: {
    formData() {
      let data = {
        name: this.titulo,
        data: this.seccions,
      };
      return data;
    },
  },
  mounted() {
    this.$watch(
      "seccions",
      (newValue, oldValue) => {
        console.log("List changed:", oldValue, "=>", newValue);
      },
      { deep: true }
    );
  },
  components: {
    ConfigSurvey,
    SeccionConfig,
  },
  methods: {
    ...mapActions("survey_store", ["saveFormSurvey"]),
    handleShowConfig(seccion) {
      this.currentSeccion = seccion;
      this.dialogConfig = true;
    },
    capturarImagen(nuevo) {
      console.log("pitando el file: ", nuevo);
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
    async printForm() {
      console.log(" === > EL ESQUEMA : ", this.formData);
      this.loading = true;
      try {
        const res = await this.saveFormSurvey(this.formData);
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
    cancelConfigSurvey() {
      this.dialogConfig = false;
    },
    cancelSeccionConfig() {
      this.dialogSeccion = false;
    },
  },
};
</script>

<style>
.container-border {
  border-radius: 50px;
}
</style>

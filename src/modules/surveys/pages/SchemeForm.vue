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
          v-for="(seccion, indexSeccion) in seccions"
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
              <v-text-field
                readonly
                v-if="item.type == 'Texto'"
                prepend-icon="mdi-pencil-outline"
                append-icon="mdi-delete-circle-outline"
                @click:append="onClear(item, index)"
                @click:prepend="onEdit(item, index, seccion, indexSeccion)"
              ></v-text-field>
              <v-text-field
                readonly
                v-if="item.type == 'Numerico'"
                prepend-icon="mdi-pencil-outline"
                append-icon="mdi-delete-circle-outline"
                @click:append="onClear(item, index)"
                @click:prepend="onEdit(item, index, seccion, indexSeccion)"
              ></v-text-field>
              <v-select
                readonly
                v-if="item.type == 'Seleccion simple'"
                :items="item.options"
                item-title="valor"
                item-value="clave"
                prepend-icon="mdi-pencil-outline"
                append-icon="mdi-delete-circle-outline"
                @click:append="onClear(item, index)"
                @click:prepend="onEdit(item, index, seccion, indexSeccion)"
              ></v-select>
              <v-combobox
                readonly
                v-if="item.type == 'Selecccion multiple'"
                :items="item.options"
                item-title="valor"
                item-value="clave"
                multiple
                prepend-icon="mdi-pencil-outline"
                append-icon="mdi-delete-circle-outline"
                @click:append="onClear(item, index)"
                @click:prepend="onEdit(item, index, seccion, indexSeccion)"
              ></v-combobox>
              <v-text-field
                readonly
                v-model="seccion.questions[index].value"
                v-if="item.type == 'Fecha'"
                type="date"
                :format="dateFormat"
                prepend-icon="mdi-pencil-outline"
                append-icon="mdi-delete-circle-outline"
                @click:append="onClear(item, index)"
                @click:prepend="onEdit(item, index, seccion, indexSeccion)"
              ></v-text-field>
              <v-file-input
                v-model="seccion.questions[index].value"
                v-if="item.type == 'Imagen'"
                accept="image/*"
                variant="filled"
                prepend-icon="mdi-pencil-outline"
                append-icon="mdi-delete-circle-outline"
                @click:append="onClear(item, index)"
                @click:prepend="onEdit(item, index, seccion, indexSeccion)"
              ></v-file-input>
              <v-select
                readonly
                v-if="item.order == 'questionMain'"
                :items="item.options"
                item-title="valor"
                item-value="clave"
                prepend-icon="mdi-pencil-outline"
                append-icon="mdi-delete-circle-outline"
                @click:append="onClear(item, index)"
                @click:prepend="onEdit(item, index, seccion, indexSeccion)"
              ></v-select>
              <v-select
                readonly
                v-if="item.order == 'questionDep'"
                :items="item.options"
                item-title="valor"
                item-value="clave"
                prepend-icon="mdi-pencil-outline"
                append-icon="mdi-delete-circle-outline"
                @click:append="onClear(item, index)"
                @click:prepend="onEdit(item, index, seccion, indexSeccion)"
              ></v-select>
              <v-select
                readonly
                v-if="item.type == 'Seleccion con texto'"
                :items="item.optionsInput"
                item-title="valor"
                item-value="clave"
                prepend-icon="mdi-pencil-outline"
                append-icon="mdi-delete-circle-outline"
                @click:append="onClear(item, index)"
                @click:prepend="onEdit(item, index, seccion, indexSeccion)"
              ></v-select>
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
      <v-btn @click="printForm" class="btn-primary">Guardar</v-btn>
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
      :editQuestion="editQuestion"
      :indexSeccion="indexSeccion"
    />
    <SeccionConfig
      @on:handleCancel="cancelSeccionConfig"
      :dialogSeccion="dialogSeccion"
      @on:handleAddSeccion="addSeccion"
    />
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import SeccionConfig from "../components/SeccionConfig.vue";
import ConfigSurvey from "../components/ConfigSurvey.vue";
import Swal from "sweetalert2";
import { generarUUID } from "@/modules/surveys/utils/utils";
export default {
  data: () => ({
    formToUpdate: null,
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
    dateFormat: "YYYY-MM-DD",
    editQuestion: null,
    indexSeccion: null,
  }),
  props: {
    id: {
      required: false,
    },
    showForm: {
      required: false,
    },
  },
  computed: {
    ...mapState("survey_store", ["forms"]),
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
    ...mapActions("survey_store", ["saveFormSurvey", "updateForm"]),
    handleShowConfig(seccion) {
      this.currentSeccion = seccion;
      this.dialogConfig = true;
    },
    onEdit(item, index, seccion, indexSeccion) {
      console.log(item, index);
      this.editQuestion = index;
      this.indexSeccion = indexSeccion;
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
      if (nuevo.type == "Seleccion dependiente") {
        let idShared = generarUUID();
        let questionMain = {
          label: nuevo.label,
          descripcion: nuevo.descripcion,
          idSeccion: nuevo.idSeccion,
          options: nuevo.optionsDep,
          type: nuevo.type,
          value: nuevo.value,
          order: "questionMain",
          idShared,
        };
        let questionDep = {
          label: nuevo.childLabel,
          idSeccion: nuevo.idSeccion,
          descripcion: nuevo.childDescrip,
          options: nuevo.optionsDepChild,
          type: nuevo.type,
          value: nuevo.value,
          order: "questionDep",
          idShared,
          showOptions: [],
        };
        console.log("LA MAIN: ", questionMain);
        console.log("LA DEPENDIENTE: ", questionDep);

        this.seccions[idxSeccion].questions.push(questionMain);
        this.seccions[idxSeccion].questions.push(questionDep);
      } else {
        if (nuevo.editQuestion != null) {
          console.log(
            "------------------- QUESTION ---------",
            nuevo.indexSeccion,
            this.seccions[nuevo.indexSeccion].questions[nuevo.editQuestion]
          );
          this.seccions[nuevo.indexSeccion].questions[nuevo.editQuestion] =
            nuevo;
        } else {
          this.seccions[idxSeccion].questions.push(nuevo);
        }
      }

      this.dialogConfig = false;
      this.editQuestion = null;
    },
    onClear(item, idx) {
      let seccion = this.findObjectById(item.idSeccion);
      let seccionIdx = this.findIndexById(item.idSeccion);
      let questions = seccion.questions;
      questions.splice(idx, 1);
      seccion.questions = questions;
      console.log("LA SECCION SIN la quest: ", seccion);
      // this.seccions[seccionIdx] = seccion;
      // console.log("LA SECCION ENCONTRADA: ", questionsFilter);
    },
    async printForm() {
      console.log(" === > EL ESQUEMA : ", this.formData);
      this.loading = true;
      if (this.formToUpdate) {
        this.formData.author = this.formToUpdate.author;
        this.formData.slug_name = this.formToUpdate.slug_name;
        const params = { id: this.formToUpdate.id, data: this.formData };
        try {
          const upRes = await this.updateForm(params);
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
          const res = await this.saveFormSurvey(this.formData);
          console.log(" ---- EL RESPONSE: ", res);
          if (res.status == 201) {
            console.log(" ---- EL RESPONSE 2: ", res.status);
            this.loading = false;
            Swal.fire({
              title: "¡Encuesta registrada!",
              icon: "success",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "¡Error al registrar encuesta!",
            icon: "error",
          });
          this.loading = false;
        } finally {
          this.clearData();
        }
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
    selectForm(id) {
      let form = this.forms.find((item) => item.id == id);
      if (form) {
        this.formToUpdate = form;
        this.titulo = form.name;
        this.seccions = form.data;
        this.slug_name = form.slug_name;
        console.log(
          "----------------------------------------",
          form,
          id,
          "form data: ",
          this.formData
        );
      }
    },
  },
  created() {
    this.selectForm(this.id);
  },
};
</script>

<style>
.container-border {
  border-radius: 50px;
}
</style>

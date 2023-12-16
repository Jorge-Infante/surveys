<template>
  <v-dialog
    persistent
    width="80%"
    v-model="dialog"
    transition="dialog-bottom-transition"
  >
    <v-card title="Creación de campos">
      <v-row class="ma-1">
        <v-col cols="4"
          ><v-select
            :items="inputs"
            v-model="inputSelect"
            label="Tipo de dato"
          ></v-select
        ></v-col>
        <v-col cols="4"
          ><v-text-field
            v-if="inputSelect"
            label="Nombre del campo"
            v-model="labelValue"
          ></v-text-field
        ></v-col>
        <v-col cols="4"
          ><v-textarea
            v-if="inputSelect"
            label="Descripción"
            v-model="description"
          ></v-textarea
        ></v-col>
        <v-col cols="4"
          ><v-text-field
            v-if="inputSelect == 'Seleccion dependiente'"
            label="Nombre del campo dependiente"
            v-model="labelValueDep"
          ></v-text-field
        ></v-col>
        <v-col cols="4"
          ><v-textarea
            v-if="inputSelect == 'Seleccion dependiente'"
            label="Descripción del campo dependiente"
            v-model="descriptionDep"
          ></v-textarea
        ></v-col>
        <v-col cols="12" v-if="optionsForm">
          <v-row v-for="(item, index) in options" :key="index">
            <v-row>
              <v-col>
                <v-text-field
                  label="Clave"
                  v-model="options[index].clave"
                  @input="updateOptions()"
                >
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field label="Valor" v-model="options[index].valor">
                </v-text-field>
              </v-col>
            </v-row>
          </v-row>
          <v-btn icon size="x-small" @click="HandleAddOption"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-col>
        <v-col cols="12" v-if="optionsFormDep">
          <v-row v-for="(item, index) in optionsDep" :key="index">
            <v-row>
              <v-col>
                <v-text-field
                  label="Clave"
                  v-model="optionsDep[index].clave"
                  @input="updateOptions()"
                >
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field label="Valor" v-model="optionsDep[index].valor">
                </v-text-field>
              </v-col>
            </v-row>
            <v-btn icon size="x-small" @click="HandleAddDependents(item.id)"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </v-row>
          <v-btn icon size="x-small" @click="HandleAddOptionDep"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-col>
      </v-row>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="btn-outline-primary"
          text="Cancelar"
          @click="cancelConfig"
        ></v-btn>
        <v-btn
          class="btn-primary"
          text="Agregar campo"
          @click="hadleSendForm"
        ></v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="dependent" width="60%">
      <v-card title="Opciones dependientes">
        <v-col cols="12" class="ma-2">
          <v-row v-for="(item, index) in dependents" :key="index">
            <v-row>
              <v-col>
                <v-text-field label="Clave" v-model="dependents[index].clave">
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field label="Valor" v-model="dependents[index].valor">
                </v-text-field>
              </v-col>
            </v-row>
          </v-row>
          <v-btn icon size="x-small" @click="addDependents"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-col>
        <v-card-actions class="justify-end">
          <v-btn icon size="x-small" @click="cancelAddDependents"
            ><v-icon>mdi-check</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import { generarUUID } from "@/modules/surveys/utils/utils";
export default {
  data: () => ({
    dialog: false,
    inputs: [
      "Texto",
      "Numerico",
      "Seleccion simple",
      "Selecccion multiple",
      "Fecha",
      "Imagen",
      "Seleccion dependiente",
    ],
    inputSelect: null,
    description: null,
    descriptionDep: null,
    formFields: [],
    labelValue: null,
    labelValueDep: null,
    options: [],
    optionsDep: [],
    dependents: [],
    dependentsList: [],
    idPrincipal: null,
    optionsFormDep: false,
    optionsForm: false,
    dependent: false,
  }),
  props: {
    dialogConfig: { type: Boolean, required: false },
    currentSeccion: { type: Object, required: false },
  },
  watch: {
    dialogConfig(nuevo) {
      this.dialog = nuevo;
    },
    labelValue(nuevo) {
      let input = { label: this.labelValue, input: nuevo };
      console.log("EL VALOR DEL INPUT: ", input, nuevo);
    },
    inputSelect(nuevo) {
      this.optionsForm = false;
      this.optionsFormDep = false;
      this.options = [];
      this.optionsDep = [];
      if (nuevo === "Seleccion simple" || nuevo === "Selecccion multiple") {
        this.optionsForm = true;
        let option = { clave: "", valor: "" };
        this.options.push(option);
      }
      if (nuevo === "Seleccion dependiente") {
        this.optionsFormDep = true;
        let id = generarUUID();
        this.idPrincipal = id;
        let option = { id: id, clave: "", valor: "" };
        this.optionsDep.push(option);
      }
    },
    options(nuevo) {
      console.log("NUEVO VALOR ARR: ", nuevo);
    },
  },
  methods: {
    updateOptions() {
      console.log("OPTIONS: ", this.options);
    },
    HandleAddOption() {
      this.options.push({ clave: "", valor: "" });
    },
    HandleAddOptionDep() {
      this.optionsDep.push({ id: generarUUID(), clave: "", valor: "" });
    },
    HandleAddDependents(id) {
      this.dependents = this.dependentsList.filter(
        (depend) => depend.idPrincipal == id
      );
      console.log("LOS DEPENDS FILTRADOS: ", this.dependents);
      console.log("ID PRINCIPAL: ", this.idPrincipal, "ID PARAM: ", id);
      this.dependent = true;

      console.log(
        "DATOS LISTA PRINCIPAL: ",
        this.optionsDep,
        "LISTA DEPENDIENTE: ",
        this.dependentsList
      );

      this.idPrincipal = id;
    },
    addDependents() {
      this.dependents.push({
        idPrincipal: this.idPrincipal,
        clave: "",
        valor: "",
      });
    },
    cancelAddDependents() {
      this.dependentsList = [...this.dependentsList, ...this.dependents];
      this.dependent = false;
      console.log(
        "DATOS LISTA PRINCIPAL: ",
        this.optionsDep,
        "LISTA DEPENDIENTE: ",
        this.dependentsList
      );
    },
    hadleSendForm() {
      let form;
      if (this.options.length > 0) {
        form = {
          idSeccion: this.currentSeccion.id,
          type: this.inputSelect,
          label: this.labelValue,
          descripcion: this.description,
          options: this.options,
        };
        console.log("FORM with OPTIONS: ", form);
      } else if (this.optionsDep.length > 0) {
        form = {
          idSeccion: this.currentSeccion.id,
          type: this.inputSelect,
          label: this.labelValue,
          descripcion: this.description,
          optionsDep: this.optionsDep,
          childLabel: this.labelValueDep,
          childDescrip: this.descriptionDep,
          optionsDepChild: this.dependentsList
        };
      } else {
        form = {
          idSeccion: this.currentSeccion.id,
          type: this.inputSelect,
          label: this.labelValue,
          descripcion: this.description,
        };
        console.log("FORM out OPTIONS: ", form);
      }
      this.$emit("on:handleAddForm", form);
      this.inputSelect = null;
      this.formFields = [];
      this.labelValue = null;
      this.options = [];
      this.optionsForm = false;
      this.dialog = false;
      this.description = null;
    },
    cancelConfig() {
      console.log("emitiendo");
      this.$emit("on:handleCancel");
    },
  },
};
</script>

<style></style>

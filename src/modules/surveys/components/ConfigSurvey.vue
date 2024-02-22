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
        <v-col cols="12" v-if="optionsFormInput">
          <v-row v-for="(item, index) in optionsInput" :key="index">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  label="Clave"
                  v-model="optionsInput[index].clave"
                  @input="updateOptionsInput()"
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Valor" v-model="optionsInput[index].valor">
                </v-text-field>
              </v-col>
            </v-row>
            <v-btn
              class="ml-2"
              icon
              size="x-small"
              @click="HandleAddInputs(item, index)"
              ><v-icon>mdi-format-text-rotation-none</v-icon></v-btn
            >
            <v-row v-if="optionsInput[index].input">
              <v-col cols="6">
                <v-text-field
                  label="Nombre"
                  v-model="optionsInput[index].label"
                  @input="updateOptionsInput()"
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Descripcion"
                  v-model="optionsInput[index].descripcion"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-row>
          <v-btn icon size="x-small" @click="HandleAddInputOption"
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
          <v-row>
            <v-col cols="6"
              ><v-text-field
                v-if="inputSelect == 'Seleccion dependiente'"
                label="Nombre del campo dependiente"
                v-model="labelValueDep"
              ></v-text-field
            ></v-col>
            <v-col cols="6"
              ><v-textarea
                v-if="inputSelect == 'Seleccion dependiente'"
                label="Descripción del campo dependiente"
                v-model="descriptionDep"
              ></v-textarea
            ></v-col>
          </v-row>
          <v-row v-for="(item, index) in dependents" :key="index" class="ma-4">
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
            <v-btn
              icon
              class="ml-2"
              size="x-small"
              @click="HandleAddDependents2(item.id)"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </v-row>
          <v-btn icon size="x-small" @click="addDependents(idPrincipal)"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </v-col>
        <v-card-actions class="justify-end">
          <v-btn icon size="x-small" @click="cancelAddDependents"
            ><v-icon>mdi-check</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
      <v-dialog v-model="dependent2" width="60%">
        <v-card title="Opciones dependientes">
          <v-col cols="12" class="ma-2">
            <v-row>
              <v-col cols="6"
                ><v-text-field
                  v-if="inputSelect == 'Seleccion dependiente'"
                  label="Nombre del campo dependiente"
                  v-model="labelValueDep2"
                ></v-text-field
              ></v-col>
              <v-col cols="6"
                ><v-textarea
                  v-if="inputSelect == 'Seleccion dependiente'"
                  label="Descripción del campo dependiente"
                  v-model="descriptionDep2"
                ></v-textarea
              ></v-col>
            </v-row>
            <v-row
              v-for="(item, index) in dependents2"
              :key="index"
              class="ma-4"
            >
              <v-row>
                <v-col>
                  <v-text-field
                    label="Clave"
                    v-model="dependents2[index].clave"
                  >
                  </v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    label="Valor"
                    v-model="dependents2[index].valor"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-btn
                icon
                class="ml-2"
                size="x-small"
                @click="HandleAddDependents3(item.id)"
                ><v-icon>mdi-plus</v-icon></v-btn
              >
            </v-row>
            <v-btn icon size="x-small" @click="addDependents2(idPrincipal)"
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </v-col>
          <v-card-actions class="justify-end">
            <v-btn icon size="x-small" @click="cancelAddDependents2"
              ><v-icon>mdi-check</v-icon></v-btn
            >
          </v-card-actions>
        </v-card>
        <v-dialog v-model="dependent3" width="60%">
          <v-card title="Opciones dependientes">
            <v-col cols="12" class="ma-2">
              <v-row>
                <v-col cols="6"
                  ><v-text-field
                    v-if="inputSelect == 'Seleccion dependiente'"
                    label="Nombre del campo dependiente"
                    v-model="labelValueDep3"
                  ></v-text-field
                ></v-col>
                <v-col cols="6"
                  ><v-textarea
                    v-if="inputSelect == 'Seleccion dependiente'"
                    label="Descripción del campo dependiente"
                    v-model="descriptionDep3"
                  ></v-textarea
                ></v-col>
              </v-row>
              <v-row
                v-for="(item, index) in dependents3"
                :key="index"
                class="ma-4"
              >
                <v-row>
                  <v-col>
                    <v-text-field
                      label="Clave"
                      v-model="dependents3[index].clave"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      label="Valor"
                      v-model="dependents3[index].valor"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-row>
              <v-btn icon size="x-small" @click="addDependents3(idPrincipal)"
                ><v-icon>mdi-plus</v-icon></v-btn
              >
            </v-col>
            <v-card-actions class="justify-end">
              <v-btn icon size="x-small" @click="cancelAddDependents3"
                ><v-icon>mdi-check</v-icon></v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-dialog>
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
      "Seleccion con texto",
    ],
    inputSelect: null,
    description: null,
    descriptionDep: null,
    descriptionDep2: null,
    descriptionDep3: null,
    formFields: [],
    labelValue: null,
    labelValueDep: null,
    labelValueDep2: null,
    labelValueDep3: null,
    options: [],
    optionsDep: [],
    optionsInput: [],
    inputDependents: [],
    dependents: [],
    dependents2: [],
    dependents3: [],
    dependentsList: [],
    dependentsList2: [],
    dependentsList3: [],
    idPrincipal: null,
    optionsFormDep: false,
    optionsForm: false,
    optionsFormInput: false,
    dependent: false,
    dependent2: false,
    dependent3: false,
  }),
  props: {
    dialogConfig: { type: Boolean, required: false },
    currentSeccion: { type: Object, required: false },
    editQuestion: { type: Number },
    indexSeccion: { type: Number },
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
      if (nuevo === "Seleccion con texto") {
        this.optionsFormInput = true;
        this.optionsInput.push({
          id: generarUUID(),
          input: false,
          clave: "",
          valor: "",
        });
      }
    },
    options(nuevo) {
      console.log("NUEVO VALOR ARR: ", nuevo);
    },
  },
  methods: {
    handleAddDependents2() {
      this.dependent2 = true;
      console.log("dependientes segunda lista");
    },
    handleAddDependents3() {
      this.dependent3 = true;
      console.log("dependientes segunda lista");
    },
    updateOptions() {
      console.log("OPTIONS: ", this.options);
    },
    updateOptionsInput() {
      console.log("OPTIONS INPUT: ", this.optionsInput);
    },
    HandleAddOption() {
      this.options.push({ clave: "", valor: "" });
    },
    HandleAddOptionDep() {
      this.optionsDep.push({ id: generarUUID(), clave: "", valor: "" });
    },
    HandleAddInputOption() {
      this.optionsInput.push({
        id: generarUUID(),
        input: false,
        clave: "",
        valor: "",
      });
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
    HandleAddDependents2(id) {
      console.log("ID MAIN LISTA DEPENDIENTE 1: ", id);
      console.log(
        "LISTA DEPENDIENTE 1: ",
        this.dependents,
        "LISTA DEPENDIENTE 2: ",
        this.dependentsList2
      );
      this.dependents2 = this.dependentsList2.filter(
        (depend) => depend.idPrincipal == id
      );
      console.log("LOS DEPENDS FILTRADOS LISTA 2: ", this.dependents2);
      console.log("ID PRINCIPAL: ", this.idPrincipal, "ID PARAM: ", id);
      this.dependent2 = true;
      this.idPrincipal = id;
    },
    HandleAddDependents3(id) {
      console.log("ID MAIN LISTA DEPENDIENTE 2: ", id);
      console.log(
        "LISTA DEPENDIENTE 1: ",
        this.dependents2,
        "LISTA DEPENDIENTE 2: ",
        this.dependentsList3
      );
      this.dependents3 = this.dependentsList3.filter(
        (depend) => depend.idPrincipal == id
      );
      console.log("LOS DEPENDS FILTRADOS: ", this.dependents3);
      console.log("ID PRINCIPAL: ", this.idPrincipal, "ID PARAM: ", id);
      this.dependent3 = true;
      this.idPrincipal = id;
    },
    HandleAddInputs(item, index) {
      item.input = true;
      this.optionsInput[index] = item;
      console.log(this.optionsInput);
    },
    addDependents(id) {
      this.dependent = true;
      this.idPrincipal = id;
      this.dependents.push({
        id: generarUUID(),
        idPrincipal: id,
        clave: "",
        valor: "",
      });
    },
    addDependents2(id) {
      this.idPrincipal = id;
      this.dependent2 = true;
      this.dependents2.push({
        idPrincipal: this.idPrincipal,
        id: generarUUID(),
        clave: "",
        valor: "",
      });
    },
    addDependents3(id) {
      this.idPrincipal = id;
      this.dependent3 = true;
      this.dependents3.push({
        idPrincipal: this.idPrincipal,
        id: generarUUID(),
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
    cancelAddDependents2() {
      this.dependentsList2 = [...this.dependentsList2, ...this.dependents2];
      this.dependent2 = false;
      console.log("LISTA DEPENDIENTE 2: ", this.dependentsList2);
    },
    cancelAddDependents3() {
      this.dependentsList3 = [...this.dependentsList3, ...this.dependents3];
      this.dependent3 = false;
      console.log("LISTA DEPENDIENTE 3: ", this.dependentsList3);
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
          optionsDepChild: this.dependentsList,

          childLabel2: this.labelValueDep2,
          childDescrip2: this.descriptionDep2,
          optionsDepChild2: this.dependentsList2,

          childLabel3: this.labelValueDep3,
          childDescrip3: this.descriptionDep3,
          optionsDepChild3: this.dependentsList3,
        };
      } else if (this.optionsInput.length > 0) {
        form = {
          idSeccion: this.currentSeccion.id,
          type: this.inputSelect,
          label: this.labelValue,
          descripcion: this.description,
          optionsInput: this.optionsInput,
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
      form.editQuestion = this.editQuestion;
      form.indexSeccion = this.indexSeccion;
      console.log(
        "------------------- this.editQuestion ---------",
        this.editQuestion,
        form
      );
      this.$emit("on:handleAddForm", form);
      this.clearData();
    },
    cancelConfig() {
      console.log("emitiendo");
      this.$emit("on:handleCancel");
      this.clearData();
    },
    clearData() {
      this.inputSelect = null;
      this.formFields = [];
      this.labelValue = null;
      this.options = [];
      this.optionsForm = false;
      this.dialog = false;
      this.description = null;
      this.optionsInput = [];
      this.optionsFormInput = false;
      this.dependents = [];
      this.inputDependents = [];
    },
  },
};
</script>

<style></style>

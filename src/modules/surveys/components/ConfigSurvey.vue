<template>
  <v-dialog width="700" v-model="dialog" transition="dialog-bottom-transition">
    <v-card title="Creación de campos">
      <v-row class="ma-1">
        <v-col cols="6"
          ><v-select
            :items="inputs"
            v-model="inputSelect"
            label="Tipo de dato"
          ></v-select
        ></v-col>
        <v-col cols="6"
          ><v-text-field
            v-if="inputSelect"
            label="Nombre del campo"
            v-model="labelValue"
          ></v-text-field
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
      </v-row>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Agregar campo" @click="hadleSendForm"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    inputs: ["Texto", "Numerico", "Seleccion simple", "Selecccion multiple", "Fecha"],
    inputSelect: null,
    formFields: [],
    labelValue: null,
    options: [],
    optionsForm: false,
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
      this.options = [];
      if (nuevo === "Seleccion simple" || nuevo === "Selecccion multiple") {
        this.optionsForm = true;
        let option = { clave: "", valor: "" };
        this.options.push(option);
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
    hadleSendForm() {
      let form;
      if (this.options.length > 0) {
        form = {
          idSeccion: this.currentSeccion.id,
          type: this.inputSelect,
          label: this.labelValue,
          options: this.options,
        };
        console.log("FORM with OPTIONS: ", form);
      } else {
        form = {
          idSeccion: this.currentSeccion.id,
          type: this.inputSelect,
          label: this.labelValue,
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
    },
  },
};
</script>

<style></style>

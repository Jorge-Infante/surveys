<template>
  <v-dialog width="700" v-model="dialog" transition="dialog-bottom-transition">
    <v-card title="Creación de sección">
      <v-row class="ma-1">
        <v-col cols="6"
          ><v-text-field
            label="Nombre del campo"
            v-model="seccionName"
          ></v-text-field
        ></v-col>
        <v-col cols="6"
          ><v-textarea label="Descripción" v-model="description"></v-textarea
        ></v-col>
      </v-row>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Agregar sección" @click="hadleSendFormSeccion"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { generarUUID } from "@/modules/surveys/utils/utils";
export default {
  data: () => ({
    dialog: false,
    description: null,
    seccionName: null,
  }),
  methods: {
    hadleSendFormSeccion() {
      let id = generarUUID();
      let seccion = {
        id: id,
        nombre: this.seccionName,
        descripcion: this.description,
      };
      this.$emit("on:handleAddSeccion", seccion);
    },
  },
  props: {
    dialogSeccion: { type: Boolean, required: false },
  },
  watch: {
    dialogSeccion(nuevo) {
      this.dialog = nuevo;
    },
  },
};
</script>

<style></style>

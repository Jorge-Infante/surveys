<template>
  <v-dialog
    persistent
    width="80%"
    v-model="dialog"
    transition="dialog-bottom-transition"
  >
    <v-card title="Creación de sección">
      <v-row class="ma-1">
        <v-col cols="6"
          ><v-text-field
            label="Nombre de la sección"
            v-model="seccionName"
          ></v-text-field
        ></v-col>
        <v-col cols="6"
          ><v-textarea label="Descripción" v-model="description"></v-textarea
        ></v-col>
      </v-row>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="btn-outline-primary" text="Cancelar" @click="this.$emit('on:handleCancel')"></v-btn>
        <v-btn class="btn-primary" text="Agregar sección" @click="hadleSendFormSeccion"></v-btn>
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
      this.description = null;
      this.seccionName = null;
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

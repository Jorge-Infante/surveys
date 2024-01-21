<template>
  <v-dialog v-model="dialog" width="600">
    <v-card class="px-6 py-8">
      <v-toolbar title="Creación de grupo"></v-toolbar>

      <v-form class="mt-4">
        <v-row>
          <v-col cols="6">
            <v-text-field clearable label="Nombre"></v-text-field
          ></v-col>
          <v-col cols="6">
            <v-autocomplete
              :items="surveys"
              multiple
              item-title="nombre"
              item-value="id"
            >
            </v-autocomplete>
          </v-col>
        </v-row>

        <br />
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" size="small" type="submit" variant="elevated">
          Guardar
        </v-btn>
        <v-btn color="success" size="small" type="submit" variant="elevated">
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      surveys: [
        { id: 1, nombre: "Acompañamiento" },
        { id: 2, nombre: "Usuarios" },
      ],
    };
  },
  props: {
    dialogFormGroup: { type: Boolean },
  },
  watch: {
    dialogFormGroup(newValue) {
      this.dialog = newValue;
    },
    dialog(newValue) {
      if (newValue === false) this.$emit("on:cancelFormGroup");
    },
  },
};
</script>

<style></style>

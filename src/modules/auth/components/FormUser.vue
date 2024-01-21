<template>
  <v-dialog v-model="dialog" width="800">
    <v-card class="px-6 py-8">
      <v-toolbar title="Creación de usuario"></v-toolbar>

      <v-form class="mt-4">
        <v-row>
          <v-col cols="6"
            ><v-text-field clearable label="Usuario"></v-text-field
          ></v-col>
          <v-col cols="6"
            ><v-text-field clearable label="Nombre"></v-text-field
          ></v-col>
        </v-row>
        <v-row>
          <v-col cols="6"
            ><v-text-field clearable label="Cedula"></v-text-field
          ></v-col>
          <v-col cols="6"
            ><v-text-field clearable label="Perfil"></v-text-field
          ></v-col>
        </v-row>
        <v-row>
          <v-col cols="6"
            ><v-text-field
              clearable
              label="Contraseña"
              placeholder="Contraseña del usuario"
            ></v-text-field
          ></v-col>
          <v-col cols="6"
            ><v-text-field
              clearable
              label="Contraseña"
              placeholder="Repita su contraseña"
            ></v-text-field
          ></v-col>
        </v-row>
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
    };
  },
  props: {
    dialogFormUser: { type: Boolean },
  },
  watch: {
    dialogFormUser(newValue) {
      this.dialog = newValue;
    },
    dialog(newValue) {
      if (newValue === false) this.$emit("on:cancelFormUser");
    },
  },
};
</script>

<style></style>

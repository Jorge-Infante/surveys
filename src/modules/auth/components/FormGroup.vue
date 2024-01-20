<template>
  <v-dialog v-model="dialog" width="600">
    <v-card class="px-6 py-8">
      <v-toolbar title="Creación de grupo"></v-toolbar>

      <v-form class="mt-4">
        <v-text-field clearable label="Nombre"></v-text-field>
        

        <br />
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" size="large" type="submit" variant="elevated">
          Guardar
        </v-btn>
        <v-btn color="success" size="large" type="submit" variant="elevated">
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
    dialogFormGroup: { type: Boolean },
  },
  watch: {
    dialogFormGroup(newValue) {
      this.dialog = newValue;
    },
    dialog(newValue){
      console.log('DIALOG: ',newValue)
    }
  },
};
</script>

<style></style>

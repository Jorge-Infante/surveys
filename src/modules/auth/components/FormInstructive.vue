<template>
  <v-dialog v-model="dialog" width="500">
    <v-card class="px-6 py-8">
      <v-toolbar title="Creación de instructivo"></v-toolbar>

      <v-form class="mt-4">
        <v-row>
          <v-col cols="12">
            <v-textarea clearable label="Nombre" v-model="text"></v-textarea
          ></v-col>
        </v-row>

        <br />
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          size="small"
          variant="elevated"
          @click="handleSaveInstructive"
        >
          Guardar
        </v-btn>
        <v-btn
          color="success"
          size="small"
          type="submit"
          variant="elevated"
          @click="dialog = false"
        >
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      dialog: false,
      text: null,
    };
  },
  props: {
    dialogFormInstructive: { type: Boolean },
  },
  methods: {
    ...mapActions("auth_store", ["saveInstructive"]),
    async handleSaveInstructive() {
      const params = {
        url: "instruccions/",
        mutation1: "addEnty",
        enty: "instructives",
        data: { text: this.text },
      };
      try {
        await this.saveInstructive(params);
        this.dialog = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    dialogFormInstructive(newValue) {
      this.dialog = newValue;
    },
    dialog(newValue) {
      if (newValue === false) this.$emit("on:cancelFormInstructive");
    },
  },
};
</script>

<style></style>

<template>
  <v-dialog v-model="dialog" width="500">
    <v-card class="px-6 py-8">
      <v-toolbar title="Creación de instructivo"></v-toolbar>

      <v-form class="mt-4">
        <v-row>
          <v-col cols="12">
            <v-textarea
              clearable
              label="Contenido HTML"
              v-model="text"
            ></v-textarea
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
          :loading="loading"
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
      loading: false,
    };
  },
  props: {
    dialogFormInstructive: { type: Boolean },
  },
  methods: {
    ...mapActions("auth_store", ["saveInstructive"]),
    async handleSaveInstructive() {
      this.loading = true;
      const params = {
        url: "instruccions/",
        mutation1: "addEnty",
        enty: "instructives",
        data: { text: this.text },
      };
      try {
        await this.saveInstructive(params);
        this.dialog = false;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.dialog = false;
        console.log(error);
      }
      this.clearData();
    },
    clearData() {
      this.text = null;
    },
  },
  watch: {
    dialogFormInstructive(newValue) {
      this.dialog = newValue;
    },
    dialog(newValue) {
      if (newValue === false) {
        this.$emit("on:cancelFormInstructive");
        this.clearData();
      }
    },
  },
};
</script>

<style></style>

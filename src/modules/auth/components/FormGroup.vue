<template>
  <v-dialog v-model="dialog" width="500">
    <v-card class="px-6 py-8">
      <v-toolbar title="Creación de grupo"></v-toolbar>

      <v-form class="mt-4" @submit.prevent ref="form">
        <v-row>
          <v-col cols="12">
            <v-text-field
              clearable
              label="Nombre"
              v-model="name"
              :rules="[rules.required]"
            ></v-text-field
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
          @click="validate"
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
import Swal from "sweetalert2";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      dialog: false,
      name: null,
      updateItem: null,
      updateGroup: false,
      loading: false,
      rules: {
        required: (value) => !!value || "El campo es obligatorio",
      },
    };
  },
  props: {
    dialogFormGroup: { type: Boolean },
    groupToUpdate: { type: Object },
  },
  methods: {
    ...mapActions("auth_store", ["saveEnty", "updateEnty"]),
    async validate() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        console.log("VALIDACIÓN OK OK OK");
        this.handleSaveGroup();
      }
    },
    clearData() {
      this.dialog = false;
      this.name = null;
      this.updateItem = null;
      this.updateGroup = false;
    },
    async handleSaveGroup() {
      this.loading = true;
      if (this.updateGroup) {
        const params = {
          url: `groups/${this.updateItem.id}/`,
          mutation1: "updateState",
          enty: "groups",
          keySearch: this.updateItem.id,
          data: { name: this.name },
        };
        try {
          await this.updateEnty(params);
          this.dialog = false;
          this.loading = false;
          Swal.fire({
            title: "¡Grupo actualizado exitosamente!",
            icon: "success",
          });
        } catch (error) {
          this.loading = false;
          this.dialog = false;
          Swal.fire({
            title: "¡Error al actulizar grupo!",
            icon: "error",
          });
          console.log(error);
        }
      } else {
        const params = {
          url: "groups/",
          mutation1: "addEnty",
          enty: "groups",
          data: { name: this.name },
        };
        try {
          await this.saveEnty(params);
          this.dialog = false;
          this.loading = false;
          Swal.fire({
            title: "¡Grupo registrado exitosamente!",
            icon: "success",
          });
        } catch (error) {
          this.loading = false;
          this.dialog = false;
          Swal.fire({
            title: "¡Error al registrar grupo!",
            icon: "error",
          });
          console.log(error);
        }
      }
      this.clearData();
    },
  },
  watch: {
    dialogFormGroup(newValue) {
      this.dialog = newValue;
    },
    dialog(newValue) {
      if (newValue === false) {
        this.$emit("on:cancelFormGroup");
        this.clearData();
      }
    },
    groupToUpdate(newValue) {
      if (newValue) {
        this.updateGroup = true;
        this.dialog = true;
        this.name = newValue.name;
        this.updateItem = newValue;
      }
    },
  },
};
</script>

<style></style>

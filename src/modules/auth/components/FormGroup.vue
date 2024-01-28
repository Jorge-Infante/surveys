<template>
  <v-dialog v-model="dialog" width="500">
    <v-card class="px-6 py-8">
      <v-toolbar title="Creación de grupo"></v-toolbar>

      <v-form class="mt-4">
        <v-row>
          <v-col cols="12">
            <v-text-field clearable label="Nombre" v-model="name"></v-text-field
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
          @click="handleSaveGroup"
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
      name: null,
      updateItem: null,
      updateGroup: false,
    };
  },
  props: {
    dialogFormGroup: { type: Boolean },
    groupToUpdate: { type: Object },
  },
  methods: {
    ...mapActions("auth_store", ["saveEnty", "updateEnty"]),
    async handleSaveGroup() {
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
        } catch (error) {
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
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  watch: {
    dialogFormGroup(newValue) {
      this.dialog = newValue;
    },
    dialog(newValue) {
      if (newValue === false) this.$emit("on:cancelFormGroup");
    },
    groupToUpdate(newValue) {
      this.updateGroup = true;
      this.dialog = true;
      this.name = newValue.name;
      this.updateItem = newValue;
    },
  },
};
</script>

<style></style>

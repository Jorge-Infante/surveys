<template>
  <v-toolbar title="Grupos"
    ><template v-slot:append>
      <v-btn
        size="small"
        variant="text"
        icon="mdi-plus"
        @click="handleShowFormGroup"
      ></v-btn> </template
  ></v-toolbar>
  <v-data-table :headers="headers" :items="groups"> </v-data-table>
  <FormGroup
    :dialogFormGroup="dialogFormGroup"
    @on:cancelFormGroup="handleCancelFormGroup"
  />
</template>

<script>
import FormGroup from "../../components/FormGroup.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {
      dialogFormGroup: false,
    };
  },
  computed: {
    ...mapState("auth_store", ["groups"]),
    headers() {
      return [
        { align: "center", key: "id", title: "Id grupo" },
        { align: "center", key: "name", title: "Nombre del grupo" },
      ];
    },
  },
  components: {
    FormGroup,
  },
  methods: {
    handleShowFormGroup() {
      this.dialogFormGroup = true;
    },
    handleCancelFormGroup() {
      this.dialogFormGroup = false;
    },
  },
};
</script>

<style></style>

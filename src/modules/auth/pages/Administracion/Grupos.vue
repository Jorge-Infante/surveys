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
  <FormGroup :dialogFormGroup="dialogFormGroup" />
</template>

<script>
import FormGroup from "../../components/FormGroup.vue";
export default {
  data() {
    return {
      groups: [
        { name: "administradores" },
        { name: "coordinadores" },
        { name: "extensionista" },
        { name: "otra" },
      ],
      dialogFormGroup: false,
    };
  },
  computed: {
    headers() {
      return [{ align: "left", key: "name", title: "Nombre del grupo" }];
    },
  },
  components: {
    FormGroup,
  },
  methods: {
    handleShowFormGroup() {
      this.dialogFormGroup = true;
    },
  },
};
</script>

<style></style>

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
  <v-data-table :headers="headers" :items="groups">
    <template v-slot:item.actions="{ item }">
      <v-row>
        <v-btn icon size="x-small" @click="handleUpdateGroup(item)"
          ><v-tooltip activator="parent" location="start"
            >Actualizar grupo</v-tooltip
          ><v-icon>mdi-file-document-refresh-outline</v-icon></v-btn
        >
        <v-btn icon size="x-small" class="ml-1"
          ><v-tooltip activator="parent" location="start"
            >Eliiminar grupo</v-tooltip
          ><v-icon>mdi-trash-can-outline</v-icon></v-btn
        >
      </v-row>
    </template></v-data-table
  >
  <FormGroup
    :dialogFormGroup="dialogFormGroup"
    :groupToUpdate="groupToUpdate"
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
      groupToUpdate: null,
    };
  },
  computed: {
    ...mapState("auth_store", ["groups"]),
    headers() {
      return [
        { align: "center", key: "id", title: "Id grupo" },
        { align: "center", key: "name", title: "Nombre del grupo" },
        { title: "Actions", key: "actions", sortable: false },
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
    handleUpdateGroup(item) {
      this.groupToUpdate = item;
    },
  },
};
</script>

<style></style>

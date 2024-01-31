<template>
  <v-toolbar title="Instructivos"
    ><template v-slot:append>
      <v-btn
        size="small"
        variant="text"
        icon="mdi-plus"
        @click="handleShowFormInstructive"
      ></v-btn> </template
  ></v-toolbar>
  <div v-if="instructives" v-html="instructives.text"></div>
  <!-- <v-data-table :headers="headers" :items="instructives"> </v-data-table> -->
  <FormInstructive
    :dialogFormInstructive="dialogFormInstructive"
    @on:cancelFormInstructive="handleCancelFormInstructive"
  />
</template>

<script>
import FormGroup from "../../components/FormGroup.vue";
import FormInstructive from "@/modules/auth/components/FormInstructive.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {
      dialogFormGroup: false,
      dialogFormInstructive: false,
    };
  },
  mounted() {},
  computed: {
    ...mapState("auth_store", ["instructives"]),
    headers() {
      return [
        { align: "center", key: "id", title: "Id grupo" },
        { align: "center", key: "text", title: "Nombre del grupo" },
      ];
    },
  },
  components: {
    FormGroup,
    FormInstructive,
  },
  methods: {
    handleShowFormGroup() {
      this.dialogFormGroup = true;
    },
    handleCancelFormGroup() {
      this.dialogFormGroup = false;
    },
    handleCancelFormInstructive() {
      this.dialogFormInstructive = false;
    },
    handleShowFormInstructive() {
      this.dialogFormInstructive = true;
    },
  },
  watch: {
    instructives(newValue) {
      console.log(newValue.text);
    },
  },
};
</script>

<style></style>

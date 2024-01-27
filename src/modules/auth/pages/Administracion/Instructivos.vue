<template>
  <v-toolbar title="Instructivos"
    ><template v-slot:append>
      <v-btn
        size="small"
        variant="text"
        icon="mdi-plus"
        @click="handleShowFormGroup"
      ></v-btn> </template
  ></v-toolbar>
  <div v-if="instructives" v-html="instructives.text"></div>
  <!-- <v-data-table :headers="headers" :items="instructives"> </v-data-table> -->
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
  mounted(){
  },
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
  },
  methods: {
    handleShowFormGroup() {
      this.dialogFormGroup = true;
    },
    handleCancelFormGroup() {
      this.dialogFormGroup = false;
    },
  },
  watch:{
    instructives(newValue){
      console.log(newValue.text)
    }
  }
};
</script>

<style></style>

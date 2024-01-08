<template>
  <h1>Dashboard mount</h1>
</template>

<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions("survey_store", ["getDashboard"]),
  },
  mounted(){
    this.getDashboard()
  }
};
</script>

<style></style>

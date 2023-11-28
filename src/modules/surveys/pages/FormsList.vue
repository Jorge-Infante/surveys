<template>
  <v-toolbar title="Formularios" density="compact"></v-toolbar>
  <v-table class="mt-5" fixed-header height="300px" density="compact">
    <thead>
      <tr>
        <th class="text-center">Id</th>
        <th class="text-center">Nombre</th>
        <th class="text-center">Slug</th>
        <th class="text-center">Autor</th>
        <th class="text-center">Configuración</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in forms" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.slug_name }}</td>
        <td>{{ item.author_username }}</td>
        <td><v-btn icon size="x-small"><v-icon>mdi-cog-outline</v-icon></v-btn></td>
      </tr>
    </tbody>
  </v-table>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("survey_store", ["forms"]),
  },
  methods: {
    
  },
  mounted() {
    
  },
};
</script>

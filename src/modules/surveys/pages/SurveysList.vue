<template>
  <v-row>
    <v-toolbar title="Encuestas" density="compact"></v-toolbar>
    <v-table class="mt-5 mr-5" fixed-header density="compact">
      <thead>
        <tr>
          <th class="text-center">Id</th>
          <th class="text-center">Id encuesta</th>
          <th class="text-center">Nombre</th>
          <th class="text-center">Autor</th>
          <th class="text-center">Configuración</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in surveysList" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.survey_id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.author_username }}</td>
          <td>
            <v-btn icon size="x-small"><v-icon>mdi-cog-outline</v-icon></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-table class="mt-5" fixed-header density="compact">
      <thead>
        <tr>
          <th class="text-center">Nombre</th>
          <th class="text-center">Configuración</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.name.name }}</td>
          <td>
            <v-btn icon size="x-small" @click="handleSync(item)"
              ><v-icon>mdi-upload</v-icon></v-btn
            >
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-row>
</template>
<script>
import { mapActions, mapState } from "vuex";
import db from "@/services/pouchdb";
export default {
  data() {
    return {
      db: null,
      items: [],
    };
  },
  computed: {
    ...mapState("survey_store", ["surveysList"]),
  },
  methods: {
    ...mapActions("survey_store", ["saveSurvey"]),
    async fetchItems() {
      try {
        const result = await this.db.allDocs({ include_docs: true });
        this.items = result.rows.map((row) => row.doc);
        console.log("los items: ", this.items);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    },
    async handleSync(item) {
      const { name } = item;
      console.log("vamos a sincronizar: ", name);
      try {
        const res = await this.saveSurvey(name);
        console.log(" ---- EL RESPONSE: ", res);
        if (res.status == 201) {
          console.log(" ---- EL RESPONSE 2: ", res.status);
          this.db
            .get(item._id)
            .then((doc) => {
              return db.remove(doc);
            })
            .then((result) => {
              console.log("Eliminado", result);
            })
            .catch((error) => {
              console.error("Error eliminando del index", error);
            });
        }
      } catch (error) {
        console.log(error);
      }

      // this.db.remove("my_database", item._id);
      // this.db.get(item._id)
      //   .then((doc) => {
      //     return db.remove(doc);
      //   })
      //   .then((result) => {
      //     console.log("Eliminado", result);
      //   })
      //   .catch((error) => {
      //     console.error("Error eliminando del index", error);
      //   });
    },
  },
  mounted() {},
  created() {
    this.db = db;
    this.fetchItems();
  },
};
</script>

<template>
  <div>
    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel>
        <v-expansion-panel-title>Encuestas en la nube</v-expansion-panel-title>
        <v-expansion-panel-text>
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
                  <v-btn
                    icon
                    size="x-small"
                    :to="{ name: 'survey-fill-out' }"
                    @click="hadleEditSurvey(item)"
                    ><v-tooltip activator="parent" location="start"
                      >Actualizar encuesta</v-tooltip
                    ><v-icon>mdi-file-document-refresh-outline</v-icon></v-btn
                  >
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title
          >Encuestas por sincronizar</v-expansion-panel-title
        >
        <v-progress-linear
          v-if="loadImages"
          indeterminate
          color="yellow-darken-2"
        ></v-progress-linear>

        <v-expansion-panel-text>
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
                  <v-btn
                    :loading="loading"
                    icon
                    size="x-small"
                    @click="handleSync(item)"
                    ><v-icon>mdi-upload</v-icon></v-btn
                  >
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import Swal from "sweetalert2";
import db from "@/services/pouchdb";
import localforage from "localforage";
import { generarUUID } from "@/modules/surveys/utils/utils";
export default {
  data() {
    return {
      db: null,
      items: [],
      loading: false,
      panel: [0],
      urls: [],
      loadImages: false,
    };
  },
  computed: {
    ...mapState("survey_store", ["surveysList"]),
  },
  methods: {
    ...mapActions("survey_store", ["saveSurvey", "formToFill", "uploadFile"]),
    async fetchItems() {
      try {
        const result = await this.db.allDocs({ include_docs: true });
        this.items = result.rows.map((row) => row.doc);
        console.log("los items: ", this.items);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    },
    async bulkImages(item) {
      let quest = [];

      for (let seccion of item.name.data.survey) {
        for (let question of seccion.questions) {
          if (question.type == "Imagen" && question.value !== null ) {
            this.loadImages = true;
            quest.push(question);

            let idImg = generarUUID();
            console.log(question.value);
            const file = new File([question.value[0]], `${idImg}.jpeg`, {
              type: "image/jpeg",
            });
            console.log(
              "LA QUESTION: ",
              question,
              "el archivo: ",
              file,
              "el tipo : ",
              typeof file
            );
            try {
              let params = { file };
              console.log("PARAMETROS: ", params);
              const res = await this.uploadFile(params);
              question.url = res.url;
            } catch (error) {
              console.log("error al cargar la imagen: ", error);
            }
          }
        }
      }
      this.loadImages = false;
      console.log("FILTRADOS: ", quest, "NUEVO VALOR DEL ITEM", item);
      this.loading = true;
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
              this.fetchItems();
            })
            .catch((error) => {
              console.error("Error eliminando del index", error);
            });
        }
        this.loading = false;
        Swal.fire({
          title: "¡Encuesta sincronizada!",
          icon: "success",
        });
      } catch (error) {
        this.loading = false;
        Swal.fire({
          title: "¡Error al sincronizar!",
          icon: "error",
        });
        console.log(error);
      }
    },
    async handleSync(item) {
      await this.bulkImages(item);
      // this.loading = true;
      // const { name } = item;
      // console.log("vamos a sincronizar: ", name);
      // try {
      //   const res = await this.saveSurvey(name);
      //   console.log(" ---- EL RESPONSE: ", res);
      //   if (res.status == 201) {
      //     console.log(" ---- EL RESPONSE 2: ", res.status);
      //     this.db
      //       .get(item._id)
      //       .then((doc) => {
      //         return db.remove(doc);
      //       })
      //       .then((result) => {
      //         console.log("Eliminado", result);
      //         this.fetchItems();
      //       })
      //       .catch((error) => {
      //         console.error("Error eliminando del index", error);
      //       });
      //   }
      //   this.loading = false;
      //   Swal.fire({
      //     title: "¡Encuesta sincronizada!",
      //     icon: "success",
      //   });
      // } catch (error) {
      //   this.loading = false;
      //   Swal.fire({
      //     title: "¡Error al sincronizar!",
      //     icon: "error",
      //   });
      //   console.log(error);
      // }
    },
    hadleEditSurvey(item) {
      console.log("el param: ", item);
      item.update = true;
      const survey_id = item.survey_id;

      // const id = item.id
      this.$router.push({
        name: "survey-fill-out-edit",
        params: { survey: survey_id },
        query: {
          item: JSON.stringify(item),
        },
      });
    },
  },
  created() {
    this.db = db;
    this.fetchItems();
  },
};
</script>

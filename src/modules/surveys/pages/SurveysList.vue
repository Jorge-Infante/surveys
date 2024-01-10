<template>
  <div>
    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel>
        <v-expansion-panel-title>Encuestas en la nube</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card flat>
            <template v-slot:text>
              <v-text-field
                v-model="search"
                label="Buscar encuesta en la nube"
                prepend-inner-icon="mdi-magnify"
                single-line
                variant="outlined"
                hide-details
              ></v-text-field>
            </template>

            <v-data-table
              :headers="headers"
              :items="surveysList"
              :search="search"
            >
              <template v-slot:item.actions="{ item }">
                <v-row>
                  <v-btn
                    v-if="!item.approved_by"
                    icon
                    size="x-small"
                    :to="{ name: 'survey-fill-out' }"
                    @click="hadleEditSurvey(item)"
                    ><v-tooltip activator="parent" location="start"
                      >Actualizar encuesta</v-tooltip
                    ><v-icon>mdi-file-document-refresh-outline</v-icon></v-btn
                  >
                  <v-btn
                    v-if="!item.approved_by"
                    icon
                    size="x-small"
                    class="ml-1"
                    @click="showDeleteDialog(item.id)"
                    ><v-tooltip activator="parent" location="start"
                      >Eliiminar encuesta</v-tooltip
                    ><v-icon>mdi-trash-can-outline</v-icon></v-btn
                  >
                </v-row>
                <!-- <v-icon
                  size="small"
                  class="me-2"
                  @click="hadleEditSurvey(item)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon size="small" @click="deleteItem(item)">
                  mdi-delete
                </v-icon> -->
              </template></v-data-table
            >
          </v-card>

          <!-- <v-table class="mt-5 mr-5" fixed-header density="compact">
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
          </v-table> -->
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
          <!-- <v-table class="mt-5" fixed-header density="compact">
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
          </v-table> -->
          <v-card flat>
            <template v-slot:text>
              <v-text-field
                v-model="searchSync"
                label="Buscar encuestas local"
                prepend-inner-icon="mdi-magnify"
                single-line
                variant="outlined"
                hide-details
              ></v-text-field>
            </template>

            <v-data-table
              :headers="headersSync"
              :items="items"
              :search="searchSync"
            >
              <template v-slot:item.options="{ item }">
                <v-btn
                  :loading="loading"
                  icon
                  size="x-small"
                  @click="handleSync(item)"
                  ><v-icon>mdi-upload</v-icon></v-btn
                >
              </template></v-data-table
            >
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
  <v-dialog v-model="dialog" persistent width="auto">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props"> Open Dialog </v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5"> ¡Aviso! </v-card-title>
      <v-card-text>No podrá revertir los cambios...</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green-darken-1" variant="text" @click="dialog = false">
          Calcelar
        </v-btn>
        <v-btn color="primary" variant="text" @click="handleDetele">
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
      search: "",
      searchSync: "",
      items: [],
      loading: false,
      panel: [0],
      urls: [],
      loadImages: false,
      dialog: false,
      idDelete: null,
    };
  },
  computed: {
    ...mapState("survey_store", ["surveysList"]),
    headers() {
      return [
        {
          align: "center",
          key: "id",
          sortable: true,
          title: "Id",
        },
        { align: "center", key: "name", title: "Nombre" },
        { align: "center", key: "survey_id", title: "Id encuesta" },
        { align: "center", key: "slug_name", title: "Slug name" },
        { align: "center", key: "author_username", title: "Usuario" },
        { align: "center", key: "created", title: "Creación" },
        { title: "Actions", key: "actions", sortable: false },
      ];
    },
    headersSync() {
      return [
        {
          align: "center",
          key: "name.name",
          sortable: true,
          title: "Nombre",
        },
        { title: "Opciones", key: "options", sortable: false },
      ];
    },
  },
  methods: {
    ...mapActions("survey_store", [
      "saveSurvey",
      "formToFill",
      "uploadFile",
      "deleteSurvey",
    ]),
    showDeleteDialog(id) {
      this.idDelete = id;
      this.dialog = true;
    },
    handleDetele() {
      try {
        this.deleteSurvey(this.idDelete);
        this.dialog = false;
        Swal.fire({
          title: "¡Eliminado correctamente!",
          icon: "success",
        });
      } catch (error) {
        this.dialog = false;
        Swal.fire({
          title: "¡Error al eliminar la encuesta!",
          icon: "error",
        });
      }
    },
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
          if (question.type == "Imagen" && question.value !== null) {
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
      const survey_id = item.id;

      // const id = item.id
      this.$router.push({
        name: "survey-fill-out-edit",
        params: { id: survey_id },
      });
    },
  },
  created() {
    this.db = db;
    this.fetchItems();
  },
};
</script>

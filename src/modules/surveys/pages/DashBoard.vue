<template>
  <div>
    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel>
        <v-expansion-panel-title>Encuestas</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col
              cols="6"
              v-for="item in dashBoardData.total_project"
              :key="item.format_slug_name"
            >
              <v-card class="text-left text-capitalize">
                <div class="d-flex align-center justify-space-between ml-2">
                  {{ item.format_name }}
                </div>
                <v-row>
                  <v-card-text>
                    <v-col cols="6">
                      <p>Realizadas: {{ item.total_surveys }}</p>
                      <p>Aprobadas: {{ item.total_surveys_approved }}</p>
                      <p>Total del proyecto: {{ item.total_project }}</p>
                    </v-col>
                  </v-card-text>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title>Departamentos</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col
              cols="6"
              v-for="item in dashBoardData.total_by_state.departamento"
              :key="item.nombre"
            >
              <v-card class="text-left text-capitalize">
                <div class="d-flex align-center justify-space-between ml-2">
                  {{ item.Nombre }}
                </div>
                <v-row>
                  <v-card-text>
                    <v-col cols="6">
                      <p>Realizadas: {{ item.Realizadas }}</p>
                      <p>Aprobadas: {{ item.Aprobadas }}</p>
                    </v-col>
                  </v-card-text>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title>Municipios</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col
              cols="6"
              v-for="item in dashBoardData.total_by_state.municipio"
              :key="item.nombre"
            >
              <v-card class="text-left text-capitalize">
                <div class="d-flex align-center justify-space-between ml-2">
                  {{ item.Nombre }}
                </div>
                <v-row>
                  <v-card-text>
                    <v-col cols="6">
                      <p>Realizadas: {{ item.Realizadas }}</p>
                      <p>Aprobadas: {{ item.Aprobadas }}</p>
                    </v-col>
                  </v-card-text>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title>Filtros</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="4"
              ><v-autocomplete
                v-model="selectSurvey"
                label="Encuesta"
                :items="encuestas"
              ></v-autocomplete
            ></v-col>
            <v-col cols="4"
              ><v-autocomplete
                v-model="selectDep"
                label="Departamento"
                :items="departamentos"
              ></v-autocomplete
            ></v-col>
            <v-col cols="4"
              ><v-autocomplete
                v-model="selectMun"
                label="Municipio"
                :items="municipios"
              ></v-autocomplete
            ></v-col>
          </v-row>
          <v-row>
            <v-col cols="4"
              ><v-autocomplete
                v-model="selectExt"
                label="Extensionista"
                :items="usuarios"
              ></v-autocomplete
            ></v-col>
            <v-col cols="2"
              ><v-btn 
                :loading="loading"
                @click="HandleDownloadExcel" 
                >Exportar Excel</v-btn></v-col
            >
            <v-col cols="2">
              <v-btn 
                :loading="loading"
                @click="HandleDownloadRecords"
                >Exportar Records</v-btn
              ></v-col
            >
          </v-row>

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
              v-model="selected"
              :headers="headers"
              :items="listReport"
              :search="search"
              :items-per-page-options="[10, 50, 100]"
              :items-per-page="itemsPerPage"
              :page="page"
              show-select
            >
              <template v-slot:item.actions="{ item }">
                <v-row>
                  <v-btn
                    icon
                    size="x-small"
                    :to="{ name: 'survey-fill-out' }"
                    @click="hadleEditSurvey(item)"
                    ><v-tooltip activator="parent" location="start"
                      >Actualizar encuesta</v-tooltip
                    ><v-icon>mdi-file-document-refresh-outline</v-icon></v-btn
                  >
                  <v-btn icon size="x-small" @click="handleFinishSurvey(item)"
                    ><v-tooltip activator="parent" location="start"
                      >Finalizar encuesta</v-tooltip
                    ><v-icon>mdi-check</v-icon></v-btn
                  >
                  <v-btn
                    icon
                    size="x-small"
                    class="ml-1"
                    @click="showDeleteDialog(item.id)"
                    ><v-tooltip activator="parent" location="start"
                      >Eliiminar encuesta</v-tooltip
                    ><v-icon>mdi-trash-can-outline</v-icon></v-btn
                  >
                </v-row>
              </template>
              <template v-slot:item.estado="{ item }">
                <div v-if="item.approved_by">Aprobada</div>
                <div v-else-if="item.rejected_by">Rechazada</div>
                <div v-else-if="item.ended_by">Finalizada</div>
                <div v-else>Pendiente</div>
              </template>
              <template v-slot:bottom>
                <div class="text-center pt-2">
                  <v-pagination
                    v-model="page"
                    :length="pageCount"
                  ></v-pagination>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-dialog v-model="dialog" width="800">
      <v-container>
        <v-card title="Finalización de encuestas">
          <v-row class="ma-2">
            <v-col cols="6">
              <v-select :items="options" label="Opción" v-model="selectState">
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-textarea
                v-model="observation"
                label="Observación"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-card-actions class="justify-end ma-2">
            <v-btn class="btn-primary" @click="handleChangeSurveyState"
              >Finalizar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-container>
    </v-dialog>
  </div>
  <v-dialog v-model="dialogDelete" persistent width="auto">
    <v-card>
      <v-card-title class="text-h5"> ¡Aviso! </v-card-title>
      <v-card-text>No podrá revertir los cambios...</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green-darken-1" variant="text" @click="dialog = false">
          Cancelar
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
export default {
  data() {
    return {
      loading: false,
      selectExt: null,
      selectSurvey: null,
      selectDep: null,
      selectMun: null,
      panel: [0],
      departamentos: [],
      municipios: [],
      search: "",
      selected: [],
      idsList: "",
      dialog: false,
      id: null,
      state: null,
      user: null,
      observation: null,
      selectState: null,
      options: ["Aprobado", "Terminado", "Rechazado"],
      usuarios: [],
      encuestas: [],
      listReport: [],
      dialogDelete: false,
      idDelete: null,
      itemsPerPage: 20,
      administrador: null,
      coordinador: null,
      extensionista: null,
      page: 1,
    };
  },
  methods: {
    ...mapActions("survey_store", [
      "getDashboard",
      "downloadRecords",
      "downloadExcel",
      "finishSurvey",
      "getSurveys",
      "deleteSurvey",
      "getFilters",
    ]),
    showDeleteDialog(id) {
      this.idDelete = id;
      this.dialogDelete = true;
    },
    handleDetele() {
      try {
        this.deleteSurvey(this.idDelete);
        this.dialogDelete = false;
        Swal.fire({
          title: "¡Eliminado correctamente!",
          icon: "success",
        });
      } catch (error) {
        this.dialogDelete = false;
        Swal.fire({
          title: "¡Error al eliminar la encuesta!",
          icon: "error",
        });
      }
    },
    hadleEditSurvey(item) {
      console.log("el param: ", item);
      item.update = true;
      const survey_id = item.id;

      // const id = item.id
      this.$router.push({
        name: "survey-fill-out-edit",
        params: { id: survey_id, showSurvey: true },
      });
    },
    HandleDownloadRecords() {
      this.loading=true;
      this.downloadRecords(this.idsList)
        .then((response) => {
          // Crear un objeto URL para el blob
          const url = window.URL.createObjectURL(new Blob([response.data]));

          // Crear un enlace temporal y hacer clic para descargar
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `Archivos.zip`);
          document.body.appendChild(link);
          link.click();

          // Limpiar el enlace y el objeto URL después de la descarga
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.error("Error al descargar el archivo:", error);
        });
    },
    HandleDownloadExcel() {
      this.loading=true;
      const params = `ids=${this.idsList}&extensionista=${this.selectExt}&encuesta=${this.selectSurvey}&municipio=${this.selectMun}&departamento=${this.selectDep}&characters=${this.search}`
      this.downloadExcel(params)
        .then((response) => {
          // Crear un objeto URL para el blob
          const url = window.URL.createObjectURL(new Blob([response.data]));

          // Crear un enlace temporal y hacer clic para descargar
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `Archivos.zip`);
          document.body.appendChild(link);
          link.click();
          link.remove();

          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.error("Error al descargar el archivo:", error);
        });
    },
    handleFinishSurvey(item) {
      console.log("EL ITEM: ", item);
      this.id = item.id;
      this.user = item.author;
      this.dialog = true;
    },
    handleChangeSurveyState() {
      try {
        this.finishSurvey(this.formData);
        this.dialog = false;
        Swal.fire({
          title: "¡Finalizado exitosamente!",
          icon: "success",
        });
        this.getSurveys();
      } catch (error) {
        Swal.fire({
          title: "¡Error al finalizar la encuesta!",
          icon: "error",
        });
      }
    },
    mapUniqueValues(arrayConRepetidos) {
      const valoresUnicos = new Set(arrayConRepetidos);
      const arraySinRepetidos = Array.from(valoresUnicos);
      const arraySinNulos = arraySinRepetidos.filter(
        (item) => item !== null && item !== ""
      );
      return arraySinNulos;
    },
    async initialFilters() {
      await this.getDashboard();
      await this.getSurveys(`page=${1}&page_size=${this.itemsPerPage}`);
      this.listReport = this.surveysList;  
      this.usuarios = this.filters.users;
      this.departamentos = this.filters.departamentos;
      this.municipios = this.filters.municipios;
      this.encuestas = this.filters.forms;
    },
    async updateSurveys() {
      await this.getSurveys(
        `page=${this.page}&page_size=${this.itemsPerPage}&extensionista=${this.selectExt}&encuesta=${this.selectSurvey}&municipio=${this.selectMun}&departamento=${this.selectDep}&characters=${this.search}`
      );
      this.listReport = this.surveysList;
    },
  },
  computed: {
    ...mapState("survey_store", [
      "dashBoardData",
      "surveysList",
      "totalSurveys",
      "forms",
      "filters",
    ]),
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
        { align: "center", key: "Usuario", title: "Documento" },
        { align: "center", key: "Departamento", title: "Departamento" },
        { align: "center", key: "Municipio", title: "Municipio" },
        { align: "center", key: "author_username", title: "Usuario" },
        { align: "center", key: "created", title: "Creación" },
        { align: "center", key: "estado", title: "Estado" },
        { title: "Actions", key: "actions", sortable: false },
      ];
    },
    formData() {
      let data = {
        id: this.id,
        state: this.state,
        user: this.user,
        observation: this.observation,
      };
      return data;
    },
    formFilter() {
      let data = {
        departamento: this.selectDep,
        municipio: this.selectMun,
        extensionista: this.selectExt,
        encuesta: this.selectSurvey,
      };
      return data;
    },
    pageCount() {
      return Math.ceil(this.totalSurveys / this.itemsPerPage);
    },
  },
  mounted() {
    this.initialFilters();
  },
  watch: {
    dashBoardData() {},
    selected(selectNew) {
      this.idsList = this.selected.join(",");
      console.log("uno mas", selectNew, "con join", this.idsList);
    },
    selectState(nuevo) {
      if (nuevo === "Aprobado") {
        this.state = "approved_by";
      } else if (nuevo === "Terminado") {
        this.state = "ended_by";
      } else if (nuevo === "Rechazado") {
        this.state = "rejected_by";
      }
    },
    formData(nuevo) {
      console.log("El form Data: ", nuevo);
    },
    page(nuevo) {
      this.getSurveys(
        `page=${nuevo}&page_size=${this.itemsPerPage}&extensionista=${this.selectExt}&encuesta=${this.selectSurvey}&municipio=${this.selectMun}&departamento=${this.selectDep}`
      );
    },
    surveysList(nuevo) {
      this.listReport = nuevo;
    },
    selectSurvey(nuevo) {
      this.selectDep = '';
      this.selectMun = '';
      this.selectExt = '';
      this.updateSurveys();
    },
    selectMun(nuevo) {
      if (nuevo) {
        this.updateSurveys();
      };
    },
    selectDep(nuevo) {
      if (nuevo) {
        this.updateSurveys();
      };
    },
    selectExt(nuevo) {
      if (nuevo) {
        this.updateSurveys();
      };
    },
    search(nuevo){
      this.updateSurveys();
    },
  },
};
</script>

<style></style>

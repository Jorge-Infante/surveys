<template>
  <div>
    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel>
        <v-expansion-panel-title>Encuestas</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col
              cols="6"
              v-for="item in dashBoardData.total_by_ext"
              :key="item.name"
            >
              <v-card class="text-left text-capitalize">
                <div class="d-flex align-center justify-space-between ml-2">
                  {{ item.name }}
                </div>
                <v-row>
                  <v-card-text>
                    <v-col cols="6">
                      <p>Realizadas: {{ item.total }}</p>
                      <p>Aprobadas: {{ item.aprobadas }}</p>
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
              ><v-select
                v-model="selectSurvey"
                label="Encuesta"
                :items="encuestas"
              ></v-select
            ></v-col>
            <v-col cols="4"
              ><v-select
                v-model="selectDep"
                label="Departamento"
                :items="departamentos"
              ></v-select
            ></v-col>
            <v-col cols="4"
              ><v-select
                v-model="selectMun"
                label="Municipio"
                :items="municipios"
              ></v-select
            ></v-col>
          </v-row>
          <v-row>
            <v-col cols="4"
              ><v-select
                v-model="selectExt"
                label="Extensionista"
                :items="usuarios"
              ></v-select
            ></v-col>
            <v-col cols="2"
              ><v-btn @click="HandleDownloadExcel">Exportar Excel</v-btn></v-col
            >
            <v-col cols="2">
              <v-btn @click="HandleDownloadRecords"
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
      options: ["Aprobado", "Terminado", "Rechazado"],
      id: null,
      state: null,
      user: null,
      observation: null,
      selectState: null,
      usuarios: [],
      encuestas: [],
      listReport: [],
      dialogDelete: false,
      idDelete: null,
      itemsPerPage: 50,
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
        params: { id: survey_id },
      });
    },
    HandleDownloadRecords() {
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
      this.downloadExcel()
        .then((response) => {
          // Crear un objeto URL para el blob
          const url = window.URL.createObjectURL(new Blob([response.data]));

          // Crear un enlace temporal y hacer clic para descargar
          const link = document.createElement("a");
          link.href = url;
          let filename = response.headers.get("filename");
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          link.remove();

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
    loadFilters(nuevo) {
      this.listReport = nuevo;
      let usuarios = nuevo.map((elemento) => {
        return elemento.author_username;
      });
      this.usuarios = this.mapUniqueValues(usuarios);

      let departamentos = nuevo.map((elemento) => {
        return elemento.Departamento;
      });
      this.departamentos = this.mapUniqueValues(departamentos);
      let municipios = nuevo.map((elemento) => {
        return elemento.Municipio;
      });
      this.municipios = this.mapUniqueValues(municipios);
      let encuestas = nuevo.map((elemento) => {
        return elemento.name;
      });
      this.encuestas = this.mapUniqueValues(encuestas);
      console.log(
        this.usuarios,
        this.departamentos,
        this.municipios,
        this.encuestas
      );
    },
  },
  computed: {
    ...mapState("survey_store", ["dashBoardData", "surveysList", "totalSurveys"]),
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
    pageCount () {
      this.getSurveys(`page=${this.page}&page_size=${this.itemsPerPage}`);
      return Math.ceil(this.totalSurveys / this.itemsPerPage)
    },
  },
  mounted() {
    this.listReport = this.surveysList;
    this.getDashboard();
    this.loadFilters(this.surveysList);
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
    formFilter(nuevo) {
      console.log("CHANGE FORM FILTER: ", nuevo);
      let newList = this.surveysList.filter(
        (item) =>
          (item.Departamento !== null &&
            item.Departamento == nuevo.departamento) ||
          (item.Municipio !== null && item.Municipio == nuevo.municipio) ||
          (item.author_username !== null &&
            item.author_username == nuevo.extensionista) ||
          (item.name !== null && item.name == nuevo.encuesta)
      );

      this.listReport = newList;
    },

    surveysList(nuevo) {
      this.loadFilters(nuevo);
    }, 
  },
};
</script>

<style></style>

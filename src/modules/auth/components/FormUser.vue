<template>
  <v-dialog v-model="dialog" width="800">
    <v-card class="px-6 py-8">
      <v-toolbar title="Creación de usuario"></v-toolbar>

      <v-form class="mt-4" @submit.prevent ref="form">
        <v-row>
          <v-col cols="6"
            ><v-text-field
              clearable
              label="Usuario"
              v-model="username"
              autocomplete="off"
              :rules="[rules.required]"
            ></v-text-field
          ></v-col>
          <v-col cols="6"
            ><v-text-field
              clearable
              label="Nombre"
              v-model="first_name"
              autocomplete="off"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-row>
          <v-col cols="6"
            ><v-text-field
              clearable
              label="Cedula"
              v-model="identification"
            ></v-text-field
          ></v-col>
          <v-col cols="6"
            ><v-text-field
              clearable
              label="Perfil"
              v-model="ext_profile"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-autocomplete
              label="Grupos"
              v-model="groups_select"
              :items="groups"
              item-title="name"
              item-value="id"
              :returnObject="false"
              multiple
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="6">
            <v-autocomplete
              v-model="projects_select"
              label="Proyectos"
              :items="projects"
              item-title="name"
              item-value="id"
              :returnObject="false"
              multiple
            >
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row v-if="!updateUser">
          <v-col cols="6"
            ><v-text-field
              v-model="password"
              @input="validarIgualdad"
              clearable
              label="Contraseña"
              type="password"
              autocomplete="off"
              placeholder="Contraseña del usuario"
              :rules="[rules.required]"
            ></v-text-field
          ></v-col>
          <v-col cols="6"
            ><v-text-field
              v-model="password2"
              :rules="[reglaIgualdad, rules.required]"
              clearable
              type="password"
              label="Contraseña"
              autocomplete="off"
              placeholder="Repita su contraseña"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="6"
            ><v-text-field
              v-model="password"
              @input="validarIgualdad"
              clearable
              label="Contraseña"
              type="password"
              autocomplete="off"
              placeholder="Contraseña del usuario"
            ></v-text-field
          ></v-col>
          <v-col cols="6"
            ><v-text-field
              v-model="password2"
              :rules="[reglaIgualdad]"
              clearable
              type="password"
              label="Contraseña"
              autocomplete="off"
              placeholder="Repita su contraseña"
            ></v-text-field
          ></v-col>
        </v-row>
      </v-form>
      <v-row class="d-flex justify-center" v-if="errors">
        <v-col cols="10"
          ><v-alert
            density="compact"
            type="warning"
            title="Por favor, validar los siguientes datos... "
          >
            <p v-if="this.errors.identification">
              Cedula: {{ this.errors.identification[0] }}
            </p>
            <div v-if="this.errors.user">
              <p v-if="this.errors.user.first_name">
                Nombre: {{ this.errors.user.first_name[0] }}
              </p>
              <p v-if="this.errors.user.username">
                Usuario: {{ this.errors.user.username[0] }}
              </p>
            </div>
          </v-alert></v-col
        >
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          size="small"
          variant="elevated"
          @click="validate"
        >
          Guardar
        </v-btn>
        <v-btn
          color="success"
          size="small"
          @click="dialog = false"
          variant="elevated"
        >
          Cancelar
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
      updateItem: null,
      dialog: false,
      username: null,
      first_name: null,
      password: null,
      password2: null,
      groups_select: null,
      groups_select_arr: [],
      identification: null,
      ext_profile: null,
      projects_select: null,
      projects_select_arr: [],
      updateUser: false,
      errors: null,
      reglaIgualdad: (v) => v === this.password || "Los campos no son iguales",
      rules: {
        required: (value) => !!value || "El campo es obligatorio",
      },
    };
  },
  computed: {
    ...mapState("auth_store", ["groups", "projects"]),
    formData() {
      let data = {
        user: {
          username: this.username,
          first_name: this.first_name,
          password: this.password,
          groups: this.groups_select_arr,
        },
        identification: this.identification,
        ext_profile: this.ext_profile,
        projects: this.projects_select_arr,
      };
      return data;
    },
  },
  props: {
    dialogFormUser: { type: Boolean },
    userToUpdate: { type: Object },
  },
  methods: {
    ...mapActions("auth_store", ["saveEnty", "updateEnty"]),
    validarIgualdad() {
      // Actualiza la regla cuando cambia el valor de campo1
      this.reglaIgualdad = (v) =>
        v === this.password || "Los campos no son iguales";
    },
    async validate() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        console.log("VALIDACIÓN OK OK OK");
        this.handleSaveUser();
      }
    },
    async handleSaveUser() {
      if (this.updateUser) {
        let newProjectsSelect = this.projects_select.map(
          (element) => element.id
        );
        this.projects_select = newProjectsSelect;
        let newGroupsSelect = this.groups_select.map((element) => element.id);
        this.groups_select = newGroupsSelect;
        const params = {
          url: `users/${this.updateItem.id}/`,
          mutation1: "updateState",
          enty: "users",
          keySearch: this.updateItem.id,
          data: this.formData,
        };
        try {
          await this.updateEnty(params);
          this.dialog = false;
          Swal.fire({
            title: "¡Usuario actualizado exitosamente!",
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            title: "¡Error al actulizar usuario!",
            icon: "error",
          });
          console.log(error);
        }
      } else {
        const params = {
          url: "users/",
          mutation1: "addEnty",
          enty: "users",
          data: this.formData,
        };
        try {
          await this.saveEnty(params);
          this.dialog = false;
          Swal.fire({
            title: "Usuario registrado exitosamente!",
            icon: "success",
          });
        } catch (error) {
          console.log(error);
          this.errors = error.response.data.errors;
        }
      }
    },
  },

  watch: {
    dialogFormUser(newValue) {
      this.dialog = newValue;
    },
    dialog(newValue) {
      if (newValue === false) this.$emit("on:cancelFormUser");
    },
    formData(newValue) {
      console.log("Nuevo form data: ", newValue);
    },
    userToUpdate(newValue) {
      this.dialog = true;
      this.updateUser = true;
      console.log(newValue);
      this.username = newValue.user.username;
      this.first_name = newValue.user.first_name;
      this.groups_select = newValue.user.groups;
      this.identification = newValue.identification;
      this.ext_profile = newValue.ext_profile;
      this.projects_select = newValue.projects;
      this.updateItem = newValue;
    },
    projects_select(newValue) {
      this.projects_select_arr = newValue;
    },
    groups_select(newValue) {
      this.groups_select_arr = newValue;
    },
  },
};
</script>

<style></style>

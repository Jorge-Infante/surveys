<template>
  <div class="main-content-login">

  <div class="d-flex justify-center align-center w-100 h-100">
    <v-card
      class="mx-auto boxLogin"
      max-width="448"
      rounded="lg"
    >
    <div>
      <v-img
      class="mx-auto text-center"
        :width="180"
        aspect-ratio="16/9"
        cover
        src="@/assets/images/logo-o2.jpg"
      ></v-img>
    </div>
      <v-form @submit.prevent ref="form">
        <div
          class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
        >
          Cuenta
        </div>

        <v-text-field
          v-model="account"
          density="compact"
          placeholder="Nombre de la cuenta"
          hint="Nombre o correo de su cuenta"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          :rules="[rules.required]"
        ></v-text-field>

        <div
          class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
        >
          Contraseña
        </div>

        <v-text-field
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Ingrese su contraseña"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          :rules="[rules.required]"
        ></v-text-field>
      </v-form>

      <v-btn
        :loading="loading"
        class="btn btn-primary mb-4"
        variant="tonal"
        @click="validate"
      >
        Iniciar
      </v-btn>
    </v-card>
  </div>
</div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data: () => ({
    visible: false,
    account: null,
    password: null,
    loading: false,
    rules: {
      required: (value) => !!value || "El campo es obligatorio",
    },
  }),
  computed: {
    formData() {
      let data = {
        username: this.account,
        password: this.password,
      };
      return data;
    },
  },
  methods: {
    ...mapActions("auth_store", ["login"]),
    async validate() {
      const { valid } = await this.$refs.form.validate();

      if (valid) this.handleFormData();
    },
    async handleFormData() {
      this.loading = true;
      try {
        const res = await this.login(this.formData);
        if (res.status == 200) {
          console.log("LA DATA: ", res.data);
          console.log("LA REFRESH: ", res.data.refresh);
          console.log("LA ACCESS: ", res.data.access);
          localStorage.setItem("refresh", res.data.refresh);
          localStorage.setItem("access", res.data.access);
          this.$router.push({ name: "survey" });
        }
      } catch (error) {
        this.loading = false;
        console.log("ERROR", error);
      }
    },
  },
  unmounted() {
    this.loading = false;
  },
};
</script>

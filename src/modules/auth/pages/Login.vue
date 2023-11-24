<template>
  <div>
    <v-card
      class="mx-auto ma-12 pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
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

      <v-btn block class="mb-8" color="blue" size="large" variant="tonal" @click="validate">
        Iniciar
      </v-btn>
    </v-card>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data: () => ({
    visible: false,
    account: null,
    password: null,
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
      try {
        const res = await this.login(this.formData);
        if(res.status==200){
          console.log('LA DATA: ',res.data)
          console.log('LA REFRESH: ',res.data.refresh)
          console.log('LA ACCESS: ',res.data.access)
          localStorage.setItem('refresh', res.data.refresh);
          localStorage.setItem('access', res.data.access);
          this.$router.push({ name: 'survey'})
        }
      } catch (error) {
        console.log("ERROR", error);
      }
    },
  },
};
</script>

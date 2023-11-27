<template>
  <v-layout>
    <v-navigation-drawer permanent>
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-home-city"
          title="Home"
          value="home"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account"
          title="My Account"
          value="account"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Users"
          value="users"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main style="height: 400px"><router-view></router-view></v-main>
  </v-layout>
</template>

<script>
import Survey from "../pages/Survey.vue";
export default {
  data: () => ({
    drawer: true,
    rail: true,
  }),
  components: {
    Survey,
  },
};
</script>

<style></style>

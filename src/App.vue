<template>
  <div id="app">
    <navbar></navbar>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import firebase from "firebase";

import navbar from "./components/Navbar.vue";

@Component({ components: { navbar } })
export default class App extends Vue {
  signOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.$router.replace({
          name: "home"
        });
      });
  }
}
</script>

<template>
  <Header />

  <Screen />

  <Footer />
</template>

<script>
import Header from "./components/Header.vue";
import Screen from "./components/Screen.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Header,
    Footer,
    Screen,
  },
};
</script>

<style>
#app {
  font-family: monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>

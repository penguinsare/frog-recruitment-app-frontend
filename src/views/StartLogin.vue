<template>
  <div>
    <h1>Login initiated</h1>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      prevRoute: null
    };
  },

  //async created() {
  async mounted() {
    try {
      if (this.$store.getters.isAuthenticated) {
        this.$router.push({ name: "home" });
      } else {
        var result = await this.$root.mgr
          .signinRedirectCallback(this.$root.$route.fullPath)
          .then(user => {
            if (user != null) {
              this.$router.push({ name: "home" });
            } else {
              this.$router.push({ name: "Unauthorized" });
            }
          });
      }
    } catch (e) {}
  }
};
</script>
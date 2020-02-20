<template>
  <div class="home">
    <h1>{{message1}}</h1>
    <p>{{message2}}</p>

    <div>
      Frog Recruitment App is the perfect tool for small recruitment companies.
      It will help you keep track of your clients, job candidate and job openings.
      Each employee has their own account for theit assets and can see their colleagues' assets but cannot edit them.
      Except text based input the application allows you to uplaod PDFs linked to each client or job candidate.
      Frog Recruitment App can generate candidate reports in Microsoft Office Word format
      to be edited and afterwards sent to your client.
      Frog Recruitment App can also generate different Terms of Business Agreements in PDF format
      according to the business terms between you and your client.        
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      message1: "Welcome",
      message2: "Please choose a table from the menu above."
    };
  },

  //async created() {
  async mounted() {}
};
</script>
<style>
</style>
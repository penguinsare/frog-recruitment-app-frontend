<template>
<div class="home">
  <h1>{{message1}}</h1>
  <p>{{message2}}</p>

  <!-- <p v-if="isLoggedIn">User: {{username}}</p> -->
  <!-- <button @click="login" v-if="!isLoggedIn">Login</button>
  <button @click="logout" v-if="isLoggedOut">Logout</button> -->
</div>
  <!-- <div class="main-content">

    <div class="main-content__top">
        <h1 class="main-content__title">
            Home
        </h1>
    </div>

    <div class="main-content__body">

      <p>
        Hi! This is a simplified version of the responsive menu I implemented in the
        Admin Panel of a project some time ago. Maybe it can help newcomers to
        <a href="https://vuejs.org/">Vue.js</a> and <a href="https://router.vuejs.org/">Vue Router</a>
        to have some ideas of how to start puting the framework, router, styles
        and other concepts together.
      </p>

      <p>
        You can find the Github Repository of this menu
        <a href="https://github.com/daniel-cintra/vue-menu">here</a>.
      </p>

      <p>
        The menu can be easily customized changing:
      </p>

      <ol>

        <li>
          <strong>src/components/Menu.vue</strong>
          where the root level itens can be found.
        </li>

        <li>
          <strong>src/components/support/menu-data.js</strong>
          where the childs of root level itens can be found.
        </li>

        <li>
          <strong>src/router.js</strong>
          where each route can be mapped to load the correspondent component.
          For the sake of simplicity, with exception of the <strong>home route</strong>, the
          sections are loaded dynamically in this example.
        </li>

      </ol>

    </div>

  </div> -->

</template>

<script>
export default {
        name: "app",
        data() {
            return {
                message1: 'Welcome',
                message2: 'Please choose a table from the menu above.'
            }
        },

        //async created() {
        async mounted() {
            
        }
    }
</script>
<style>
 
    /* .btn {
        color: #42b983;
        font-weight: bold;
        background-color: #007bff;
        border-color: #007bff;
        display: inline-block;
        font-weight: 400;
        text-align: center;
        vertical-align: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-color: transparent;
        border: 1px solid #42b983;
        padding: .375rem .75rem;
        margin: 10px;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: .25rem;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    } */
 
</style>
<template>
<body>
<b-navbar class="custom-navbar my-0"  toggleable="md" type="dark">
   <b-navbar-brand href="/">
     <img src="../public/image.png" class="d-inline-block align-top" width="30" height="30" alt="">
     <span id="logo">Frog Recruitment App</span>
  </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse" >
      <div class="menu-icon-div"></div>
      <div class="menu-icon-div"></div>
      <div class="menu-icon-div"></div>
    </b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
                
        <b-nav-item class="custom-nav-item" v-if="userAuthenticatedAndNotAdmin" to='/clients'><span class="custom-link mx-2">Clients</span></b-nav-item>
        <b-nav-item class="custom-nav-item" v-if="userAuthenticatedAndNotAdmin" :to="{name:'jobs'}"><span class="custom-link mx-2">Jobs</span></b-nav-item>
        <b-nav-item class="custom-nav-item" v-if="userAuthenticatedAndNotAdmin" to='/candidates'><span class="custom-link mx-2">Candidates</span></b-nav-item>
        <b-nav-item class="custom-nav-item" v-if="userAuthenticatedAndAdmin"    to='/users'><span class="custom-link mx-2">Users</span></b-nav-item>
        
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form class="ml-auto">
          <em v-if="userAuthenticated" class="custom-link mx-4">{{myUserName}}</em>
          <b-button size="sm" class="my-2 my-sm-0" style="background-color:#9CC925;" v-if="userAuthenticated" @click="logout()" >Logout</b-button>
        </b-nav-form>
      
      </b-navbar-nav>
    </b-collapse>
 
</b-navbar>   
  <router-view style="padding:15px 16px 15px 15px;overflow-x: auto;" />

      
</body>
</template>

<script>
import {BNavbar, BTable, BFormGroup, 
        BFormInput, BButton,
        BFormSelect, BPagination,
        BContainer, BRow,
        BCol} from 'bootstrap-vue';
import JobsTable from './views/JobsTable';
import CandidatesTable from './views/CandidatesTable';
import ClientsTable from './views/ClientsTable';
import TermsOfBusiness from './views/TermsOfBusiness.vue';
import axios from 'axios';

export default {
  name: 'app',
  components: {
    JobsTable,
    CandidatesTable,
    ClientsTable,
    TermsOfBusiness,
    BNavbar,
  },

  created() {
  },
  data() {
    return {
      isOpenMobileMenu: false,
      activeTableProp: 0,
      userName: '',
      showLogoutButton: false,
    };
  },
  updated() {
    this.showLogoutButton = this.$store.getters.isAuthenticated;    
  },
  computed: {
    wrapperClass() {
      return {
        'toggled': this.isOpenMobileMenu === true,
      };
    },
    userAuthenticated() {
      return  this.showLogoutButton;
    },
    userAuthenticatedAndNotAdmin() {      
      return  this.showLogoutButton && this.$store.getters.user.profile.name !== "administrator" ? true : false;
    },
    userAuthenticatedAndAdmin() {
      return  this.showLogoutButton && this.$store.getters.user.profile.name === "administrator" ? true : false;
    },
    myUserName() {
      return  this.$store.state.user.profile.name; 
    },
  },
  methods:{
    logout() {
      this.$root.$data.mgr.revokeAccessToken();
      this.$root.$data.mgr.signoutRedirect();
    }
  }
}
</script>

<style lang="scss" scoped>
  body {
    margin: 0;
  }
  @import 'styles/layout.scss';
  @import 'styles/content-overlay.scss';
  @import 'styles/media-queries.scss';

#logo {
  color: #9CC925;
  font-size: 18px;
  margin-top: 6%;
  float:left; 
}
img {
    object-fit: contain;
    width: 50px;
    height: 45px;
    float:left; 
}
 ul.topnav {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
}

ul.topnav li {float: left;}

ul.topnav li a {
  display: block;  
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}
// ul.topnav li a:hover{}
ul.topnav li a:hover:not(.active) {
  background-color: #111;
  color: white;
  cursor: pointer;
  }

ul.topnav li a.active {background-color: #9CC925;}

ul.topnav li.right {float: right;}

@media screen and (max-width: 600px) {
  ul.topnav li.right, 
  ul.topnav li {float: none;}
}

.custom-navbar{
  background-color: #333;
}
.custom-link {
  color:white;
  //margin: 25px 0px 25px 0px;
}
.custom-nav-item:hover {
  background-color: #9CC925;
  color: white;
  cursor: pointer;
}
.router-link-active {
  background-color: #9CC925;
  color: white;
  cursor: pointer;
}
.menu-icon-div {
  width: 35px;
  height: 5px;
  background-color:white;
  margin: 5px 0;
  //border-radius: 20%;
}
</style> 
  

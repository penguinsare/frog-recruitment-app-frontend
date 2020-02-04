<template>
<div>
  <b-row class="my-1">
      <b-col sm="3">
        <h1 v-if="isEditMode">Edit Account</h1>
        <h1 v-else>Add Account</h1>
      </b-col>

    </b-row>
    <b-row class="my-1">
      <b-col sm="3">
        <label>Username:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input  :state="usernameUniqueAndNotEmpty"  :disabled="isEditMode"
        aria-describedby="input-live-feedback" v-model="username"></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback">
          Username cannot be empty or match an already existing username
        </b-form-invalid-feedback>
      </b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="3">
        <label>Name:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input  :state="nameUniqueAndNotEmpty"
        aria-describedby="input-live-feedback" v-model="name"></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback">
          Name cannot be empty or match an already existing name
        </b-form-invalid-feedback>
      </b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="3">
        <label>Email:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input  :state="emailUniqueAndNotEmpty"
        aria-describedby="input-live-feedback" v-model="email"></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback">
          Email cannot be empty or match an already existing email
        </b-form-invalid-feedback>
      </b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="3">
        <label>Phone:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input
        aria-describedby="input-live-feedback" v-model="phone"></b-form-input>
      </b-col>
    </b-row>
    <!-- <b-row class="my-1">
      <b-col sm="3">
        <label>Recruiter:</label>
      </b-col>
      <b-col sm="9">
        <multiselect  track-by="name" label="name" v-model="chosenRecruiter" :options="recruiters"></multiselect>
      </b-col>
    </b-row> -->
    <!-- <b-row class="my-3">
      <b-col sm="3">
        <label>Recruiter:</label>
      </b-col>
      <b-col sm="9" lg="6">
        <div>
        <multiselect  track-by="recruiterId" label="name" v-model="chosenRecruiter" :options="recruiters"></multiselect>
        <label class="text-danger small" v-show="validChosenRecruiter">Select recruiter</label>
        </div>
      </b-col>
    </b-row>  -->
    <b-row class="my-1" v-if="!isEditMode">
      <b-col sm="3">
        <label>Password:</label>
      </b-col>
      <b-col sm="9">
          <b-form-input type="password" :state="passwordsMatch"
        aria-describedby="input-live-feedback" v-model="password"></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback">
          Passwords should match and not be empty!
        </b-form-invalid-feedback>
        <!-- <b-form-input type="password" v-model="password"></b-form-input> -->
      </b-col>
    </b-row>
    <b-row class="my-1" v-if="!isEditMode">
      <b-col sm="3">
        <label>Confirm password:</label>
      </b-col>
      <b-col sm="9">
          <b-form-input type="password"  :state="passwordsMatch"
        aria-describedby="input-live-feedback" v-model="confirmPassword"></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback">
          Passwords should match and not be empty!
        </b-form-invalid-feedback>
        <!-- <b-form-input :type="password" v-model="confirmPassword"></b-form-input> -->
      </b-col>
    </b-row>
        <b-row class="my-1">
      <b-col sm="3">
        <label>User Privileges:</label>
      </b-col>
      <b-col sm="9">
          <b-form-select  v-model="userPrivilege" :options="privilegeOptions" ></b-form-select>  
        <!-- <b-form-input :type="password" v-model="confirmPassword"></b-form-input> -->
      </b-col>
    </b-row>
    <!--b-row class="my-1">
      <b-col sm="3">
        <label>Candidate:</label>
      </b-col>
      <b-col sm="9">
        <b-dropdown  size="sm" id="dropdown-1" class="m-md-2">
          <template slot="button-content">
            {{this.candidateName}}
          </template>
          <b-dropdown-item v-for="candidate in this.candidates" class="b-dropdown-item" :key="candidate.name" @click="onCandidateChosen(candidate)">{{ candidate.name }}</b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row-->
    <b-button class="my-btn" id="add" :disabled="!requirementsOK" @click="add">Save</b-button>
    <b-button class="my-btn" id="close" @click="close">Close</b-button>
</div>
</template>

<script>
import {BRow, BCol, BButton, BDropdown} from 'bootstrap-vue';
import axios from 'axios';
import Multiselect from 'vue-multiselect'

export default {
  name: 'adduser',
 /*  mode: 'production', */
  components: {
    BRow, BCol,
    BButton,
    BDropdown,
    Multiselect
  },
  computed: {
    requirementsOK: function() {
      if (this.mode === 'add'){        
        return (  this.password.length > 0 && 
                  this.password == this.confirmPassword && 
                  this.username.length > 0 && 
                  !this.users.some(item => item.userName == this.username) &&
                  this.name.length > 0 && 
                  !this.recruiters.some(item => item.name == this.name) &&
                  this.email.length > 0 && 
                  !this.recruiters.some(item => item.email == this.email)) ? true:false;
      }
      else{
        return (  
                  this.name.length > 0 && 
                  !this.recruiters.some(item => item.name == this.name) &&
                  this.email.length > 0 && 
                  !this.recruiters.some(item => item.email == this.email)) ? true:false;
      }
    },
    passwordsMatch: function() {
       return this.password.length > 0 && this.password == this.confirmPassword;
    },
    usernameUniqueAndNotEmpty: function() {
      if (this.mode === 'add'){        
        return this.username.length > 0 && 
        !this.users.some(item => item.userName == this.username) ? true:false
      }
      else{
        return true;
      }
    },
    validChosenRecruiter(){
      return this.chosenRecruiter == null
    },
    nameUniqueAndNotEmpty(){
      return this.name.length > 0 && 
      !this.recruiters.some(item => item.name == this.name) ? true:false
    },
    emailUniqueAndNotEmpty(){
      return this.email.length > 0 && 
      !this.recruiters.some(item => item.email == this.email) ? true:false
    },
    isEditMode(){
      return this.mode === 'edit' ? true : false;
    }
    // passwordsMatch(){
    //     return this.password == this.confirmPassword;
    // },
    // // usernameUniqueAndNotEmpty: function() {
    // //   return usernameUniqueAndNotEmpty();
    // usernameUniqueAndNotEmpty() {
    //   return 
    //   (this.username.length > 0 && 
    //   !this.users.some(item => item.userName == this.username) )
    //   ? true : false
    // },
    //   (this.username.length > 0 && 
    //   !this.users.some(item => item.userName == this.username) )
    //   ? true : false
    // compContactPerson() {
    //   return (this.chosenClient ? this.chosenClient.contactPerson : "");
    // }
  },
  methods: {
    openDialog() {
      this.$bvModal.show('addUser')
    },
    close() {
      this.$router.go(-1)
    },
    add() {
      if (this.$route.query.mode === 'add'){
       
        axios.post('api/users', {
          userName: this.username,
          //recruiterId: this.chosenRecruiter.recruiterId,
          password: this.password,
          confirmPassword: this.confirmPassword,  
          accessClaim: this.userPrivilege, 
          name: this.name,
          email: this.email,
          phone: this.phone     
        })
        .then()
        .catch(function (error) {
          console.log(error);
        })
        .finally(() => this.$router.go(-1))
      }
      else{
      
        axios.put('api/users/' + this.username, {
          userName: this.username,
          //recruiterId: this.chosenRecruiter.recruiterId,
          //password: this.password,
          //confirmPassword: this.confirmPassword,  
          accessClaim: this.userPrivilege, 
          name: this.name,
          email: this.email,
          phone: this.phone     
        })
        .then()
        .catch(function (error) {
          console.log(error);
        })
        .finally(() => this.$router.go(-1))
      }
    },
    // passwordsMatch(){
    //     return this.password == this.confirmPassword;
    // },
    // usernameUniqueAndNotEmpty: function() {
    //   return usernameUniqueAndNotEmpty();
    // usernameUniqueAndNotEmpty() {
    //   return 
    //   (this.username.length > 0 && 
    //   !this.users.some(item => item.userName == this.username) )
    //   ? true : false
    // },
    // usernameUniqueAndNotEmpty() {
    //   return 
    //   (this.username.length > 0 && 
    //   !this.users.some(item => item.userName == this.username) )
    //   ? true : false
    // },
  },
  created(){
    // axios.get('api/recruiters')
    //   .then(res => this.recruiters = res.data)
    //   .catch(err => console.log(err));
    if (this.$route.query.mode){
      this.mode = this.$route.query.mode
    }
    if (this.$route.query.username){
      this.username = this.$route.query.username
    }
    if (this.$route.query.name){
      this.name = this.$route.query.name
    }
    if (this.$route.query.email){
      this.email = this.$route.query.email
    }
    if (this.$route.query.phone){
      this.phone = this.$route.query.phone
    }
    if (this.$route.query.accessPermission){
      this.userPrivilege = this.$route.query.accessPermission
    }    
    axios.get('api/users')
      .then(res => this.users = res.data)
      .catch(err => console.log(err));

    axios.get('api/UserPrivileges')
      .then(res => {
        this.privilegeOptions = res.data;
        var x;
        for (x in  this.privilegeOptions) {          
          // this.privilegeOptions[x] = { text: res.data[x].value, value: res.data[x].value}; 
          this.privilegeOptions[x].text =  this.privilegeOptions[x].value;     
          this.privilegeOptions[x].value = this.privilegeOptions[x].value;      
        }

        //this.privilegeOptions = { text: res.data.value, value: res.data.value}; 
        if (this.mode === 'add'){
          this.userPrivilege = this.privilegeOptions[0].value;
        }
      })
      .catch(err => console.log(err));
  },
  data() {
    return {
      username : '',
      recruiterName : '',
      recruiters: [],
      users: [],
      chosenRecruiter : null,
      password: '',
      confirmPassword: '',
      privilegeOptions: [],
      userPrivilege: null,
      name: '',
      email: '',
      phone: '',
      mode: '',
      //accessPermission: '',
    }
  }
}
</script>

<style lang="scss">
  body {
    margin: 0;
  }
</style> 
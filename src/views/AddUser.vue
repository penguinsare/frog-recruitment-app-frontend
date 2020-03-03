<template>
<div>
  <div class="container">
      <br>
        <div v-if="isEditMode">
          <h2>Edit User Account</h2>
        </div>
          <div v-else>
          <h2>Add User Account</h2>
        </div>
        <hr><br>

    
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
      <b-row class="mb-4">
        <b-col sm="3">
          <label>Phone:</label>
        </b-col>
        <b-col sm="9">
          <b-form-input
          aria-describedby="input-live-feedback" v-model="phone"></b-form-input>
          <b-form-invalid-feedback id="input-live-feedback">
             s
          </b-form-invalid-feedback>
        </b-col>
      </b-row>     
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
        </b-col>
      </b-row>
          <b-row class="my-1">
        <b-col sm="3">
          <label>User Privileges:</label>
        </b-col>
        <b-col sm="9">
            <b-form-select  v-model="userPrivilege" :options="privilegeOptions" ></b-form-select>          
        </b-col>
      </b-row>      
      <br>
      <div class="text-right">
        <b-button class="my-btn" variant="success" size="lg" id="add" :disabled="!requirementsOK" @click="add">Save</b-button>
        <b-button class="my-btn" size="lg" id="close" @click="close">Close</b-button>
      </div>
    </div>
</div>
</template>

<script>
import {BRow, BCol, BButton, BDropdown} from 'bootstrap-vue';
import axios from 'axios';
import Multiselect from 'vue-multiselect'

export default {
  name: 'adduser',
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
    passwordNotEmpty() {
      return this.password.length > 0 ? true : false;
    },
    usernameUniqueAndNotEmpty: function() {
      if (this.mode === 'add'){        
        return this.username.length > 0 && 
        !this.users.some(item => item.userName == this.username) ? true:false;
      }
      else{
        return true;
      }
    },
    validChosenRecruiter(){
      return this.chosenRecruiter == null;
    },
    nameUniqueAndNotEmpty(){
      return this.name.length > 0 && 
      !this.recruiters.some(item => item.name == this.name) ? true:false;
    },
    emailUniqueAndNotEmpty(){
      return this.email.length > 0 && 
      !this.recruiters.some(item => item.email == this.email) ? true:false;
    },
    isEditMode(){
      return this.mode === 'edit' ? true : false;
    }    
  },
  methods: {
    openDialog() {
      this.$bvModal.show('addUser');
    },
    close() {
      this.$router.go(-1);
    },
    add() {
      if (this.$route.query.mode === 'add'){       
        axios.post('api/users', {
          userName: this.username,
          password: this.password,
          confirmPassword: this.confirmPassword,  
          accessClaim: this.userPrivilege, 
          name: this.name,
          email: this.email,
          phone: this.phone     
        })
        .then()
        .catch(function (error) {
         // console.log(error);
        })
        .finally(() => this.$router.go(-1));
      }
      else{
      
        axios.put('api/users/' + this.username, {
          userName: this.username, 
          accessClaim: this.userPrivilege, 
          name: this.name,
          email: this.email,
          phone: this.phone     
        })
        .then()
        .catch(function (error) {
         // console.log(error);
        })
        .finally(() => this.$router.go(-1));
      }
    },
   
  },
  created(){
    if (this.$route.query.mode){
      this.mode = this.$route.query.mode;
    }
    if (this.$route.query.username){
      this.username = this.$route.query.username;
    }
    if (this.$route.query.name){
      this.name = this.$route.query.name;
    }
    if (this.$route.query.email){
      this.email = this.$route.query.email;
    }
    if (this.$route.query.phone){
      this.phone = this.$route.query.phone;
    }
    if (this.$route.query.accessPermission){
      this.userPrivilege = this.$route.query.accessPermission;
    }    
    axios.get('api/users')
      .then(res => this.users = res.data)

    axios.get('api/UserPrivileges')
      .then(res => {
        this.privilegeOptions = res.data;
        var x;
        for (x in  this.privilegeOptions) {           
          this.privilegeOptions[x].text =  this.privilegeOptions[x].value;     
          this.privilegeOptions[x].value = this.privilegeOptions[x].value;      
        }
        if (this.mode === 'add'){
          this.userPrivilege = this.privilegeOptions[0].value;
        }
      })
      //.catch(err => console.log(err));
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
    }
  }
}
</script>

<style lang="scss">
  body {
    margin: 0;
  }
</style> 
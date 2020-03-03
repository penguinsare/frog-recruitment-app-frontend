<template>
<div>
    <b-row class="my-1">
      <b-col sm="3">
        <label>Name:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input :state="nameValid"
        v-model="name"></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback">
          Recruiter's name cannot be empty!
        </b-form-invalid-feedback>
      </b-col>
    </b-row>
        <b-row class="my-1">
      <b-col sm="3">
        <label>Email:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input :state="emailValid" v-model="email"></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback">
          Recruiter's email cannot be empty!
        </b-form-invalid-feedback>
      </b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="3">
        <label>Phone:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input v-model="phone"></b-form-input>
      </b-col>
    </b-row>
    <b-button class="my-btn" id="add" :disabled="!requirementsOk" @click="add">
      <b-spinner type="grow" variant="light" small v-if="isUploading"></b-spinner>
      Save
    </b-button>
    <b-button class="my-btn" id="close" @click="close">Close</b-button>
</div>
</template>

<script>
import {BRow, BCol, BButton, BDropdown} from 'bootstrap-vue';
import axios from 'axios';


export default {
  name: 'editrecruiter',
  components: {
    BRow, BCol,
    BButton,
    BDropdown
  },
  computed: {
    nameValid() {
      return this.name.length > 0 ? true : false;
    },
    emailValid() {
      return this.email.length > 0 ? true : false;
    },
    requirementsOk() {
      return this.name.length > 0 && this.email.length > 0;  
    }
  },
  methods: {
    close() {
      this.$router.go(-1);
    },
    add() {
      this.isLoading = true;
      if (this.recruiterId > 0){
        axios.put('api/recruiters/' + this.recruiterId, {
          recruiterId: this.recruiterId,
          name: this.name,
          email: this.email,
          phone: this.phone,
        })
        .then()
        .catch(function (error) {
          console.log(error);
        })
        .finally( () => this.$router.go(-1));
      } 
      else{
        axios.post('api/recruiters/', {
          recruiterId: this.recruiterId,
          name: this.name,
          email: this.email,
          phone: this.phone,
        })
        .then()
        .catch(function (error) {
          console.log(error);
        })
        .finally( () => this.$router.go(-1));
      }     
      
    }
  },
  created(){
    if (this.$route.query.recruiterId){
      this.recruiterId = this.$route.query.recruiterId;
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
  },
  data() {
    return {
      recruiterId : 0,
      name : '',
      email: '',
      phone: '',
      isUploading: false,
    }
  }
}
</script>

<style lang="scss">
  body {
    margin: 0;
  }
</style> 
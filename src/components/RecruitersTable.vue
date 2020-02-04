<template>
<div id="app">
  <div class="justify-content-centermy-1 row">
    <b-form-group class="col-3" >
      <span class="textJobs">Recruiters</span>  
    </b-form-group>
    <b-form-group   class="col-3" >
      <b-form-input v-model="filter" placeholder="Type to Search"></b-form-input>
    </b-form-group>
    <div class="col-1"></div>
    <div class="col-2 justify-content-center">
      <div class="row ">
        <b-form-select class="col-4" id="select-pages"  :options="[{text:5,value:5},{text:10,value:10},{text:15,value:15}]" v-model="perPage"></b-form-select>
        <span class="col-6 my-1">Rows per page</span>
      </div>
    </div>
    <b-form-group class="col-2" >
      <div class="row justify-content-end">
      <b-button variant="primary" @click="addNew()">Add Recruiter</b-button>
      </div>
    </b-form-group>
  </div>

  <div class="midbody" v-if="isLoading" >
    <b-spinner variant="info" label="Spinning"></b-spinner>
    <span class="loading h2"> &nbsp; Loading...     </span>
  </div>

  <div v-else>
  <!-- Main table element -->
  <b-table striped hover :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter">
    <template slot="name" scope="item">
      {{item.value}}
    </template>
    <template slot="email" scope="item">
      {{item.value}}
    </template>
    <template slot="phone" scope="item">
      {{item.value}}      
    </template>
  <!-- Column to control data.. -->
     <template slot="actions" scope="items">
      <b-button class="my-btn" variant="warning" size="sm" @click="Edit(items.item)">Edit</b-button>
      <b-button class="my-btn" variant="danger" size="sm" @click="Remove(items.item)">Remove</b-button>
    </template>
  </b-table>
  </div>

  <div class="justify-content-center row my-1">
    <b-pagination size="md" :total-rows="this.items.length" :per-page="perPage" v-model="currentPage" />
  </div>
</div>
</template>
<script>
import {BTable, BFormGroup, 
        BFormInput, BButton,
        BFormSelect, BPagination,
        BContainer, BRow,
        BCol} from 'bootstrap-vue'; /* 'c:/Users/shide/node_modules/bootstrap-vue/es/components/table'; */
import axios from 'axios';
import EditRecruiter from './modals/EditRecruiter'

export default {
  name: 'app',
 /*  mode: 'production', */
  components: {
    BTable,
    BFormGroup,
    BFormInput,
    BButton,
    BFormSelect,
    BPagination,
    BContainer,
    BRow,
    BCol,
    EditRecruiter,
  },
  data() {
    return {
      items: [],
      fields: {
       name: {
        //label: 'Person Full name',
        sortable: true
      },
      email: {
        //label: 'Email',
        sortable: true
      },
      phone: {
        //label: 'Phone'
        sortable: true
      },
      actions: {
        //edit or remove row...
      }
    },
    currentPage: 1,
    perPage: 5,
    filter: null  ,
    isLoading: false,
    }
  },
  created(){
    this.isLoading = true
    axios.get('api/recruiters')
      .then(res => this.items = res.data)
      .catch(err => console.log(err))
      .finally(() => this.isLoading = false)
  }, 
  methods: {
    addNew() {
      this.$router.push({name: 'add-recruiter'})
    },
    edit(item) {
     this.$router.push({
       name: 'edit-recruiter',
       query: {
         recruiterId: item.recruiterId,
         name: item.name,
         email: item.email,
         phone: item.phone,
       }
     })
    },
    remove(item) {
      if(confirm("Do you want to remove " + item.name + "?")){
        this.objToRemove = 'api/recruiters/';
        this.objToRemove += item.recruiterId;
        axios.delete(this.objToRemove)
        .then()
        .catch(err => console.log(err))
        .finally( () => 
          axios.get('api/recruiters')
            .then(res => this.items = res.data)
            .catch(err => console.log(err)))
      }
    }
  }
}
</script>

<style lang="scss">
 @import '~bootstrap/scss/bootstrap.scss';
 @import '~bootstrap-vue/src/index.scss';

  body {
    margin: 0;
  }
</style> 
<template>
<div id="app">
  <div class="justify-content-centermy-1 row">
    <b-form-group class="col-3" >
      <span class="textJobs">Users</span>
    </b-form-group>
     <b-form-group   class="col-3" >
      <b-form-input v-model="filter" placeholder="Type to Search"></b-form-input>
    </b-form-group>
    <div class="col-1"></div>
    <div class="col-2 justify-content-center">
      <div class="row ">
        <b-form-select class="col-4" id="select-pages"  :options="[{text:15,value:15},{text:30,value:30},{text:'all',value:maxRowsNumber}]" v-model="perPage"></b-form-select>
        <span class="col-6 my-1">Rows per page</span>
      </div>
    </div>
    <b-form-group   class="col-2" >
      <div class="row justify-content-end">
      <b-button variant="primary" @click="addNew()">Add User Account</b-button>
      </div>
    </b-form-group>
  </div>

 <div class="midbody" v-if="isLoading" >
  <b-spinner class="loading" label="Spinning"></b-spinner>
  <span class="loading h2"> &nbsp; Loading...     </span>
</div>

  <div v-else>
  <!-- Main table element -->
    <b-table striped hover :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter">
      <template slot="username" scope="item">
        {{item.item.userName}}
      </template>
      <template slot="recruiterName" scope="item">
        {{item.item.recruiter.name}}
      </template>   
      <template slot="recruiterEmail" scope="item">
        {{(item.item.recruiter !== null) ? item.item.recruiter.email : null}}
      </template>  
      <template slot="recruiterPhone" scope="item">
        {{(item.item.recruiter !== null) ? item.item.recruiter.phone : null}}
      </template>   
       <template slot="accessPermission" scope="item">
        {{item.item.accessPermission}}
      </template>   
    <!-- Column to control data.. -->
      <template slot="actions" scope="items">
        <b-button class="my-btn" variant="warning" size="sm" @click="edit(items.item)">Edit</b-button>
        <b-button class="my-btn" variant="info" size="sm" @click="changePassword(items.item)">Change Password</b-button>
        <b-button class="my-btn" variant="success" size="sm" @click="transferAssets(items.item)">Transfer Assets</b-button>
        <b-button class="my-btn" variant="danger" size="sm" @click="remove(items.item)" :disabled="!canRemoveUser(items.item)">Remove</b-button>
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
        BCol} from 'bootstrap-vue'; 
import axios from 'axios';
import AddUser from './modals/AddUser'
import ChangeUserPassword from './modals/ChangeUserPassword'

export default {
  name: 'app',
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
    AddUser,
    ChangeUserPassword
  },
  methods: {
  },
  data() {
    return {
      items: [],
      fields: {
      username: {
        label: 'Username',
        sortable: true
      },
      recruiterName: {
        label: 'Name',
        sortable: true
      },
      recruiterEmail: {
        label: 'Email',
        sortable: true
      },
      recruiterPhone: {
        label: 'Phone',
        sortable: true
      },
      accessPermission: {
        label: 'Permissions',
        sortable: true
      },
      actions: {
        // edit or remove row
      },
      
    },
    currentPage: 1,
    perPage: 15,
    objToRemove: '',
    filter: null ,
    error: null ,
    isLoading: false,
    }
  },
  created(){
    this.isLoading = true;
    axios.get('api/users')
      .then(res => this.items = res.data)
      .catch(err => console.log(err.message))
      .finally(() => this.isLoading = false);
  },
  computed: {
    maxRowsNumber() {
      return this.items.length;
    },
  },
  methods: {
    canRemoveUser(item) {
      return item.canRemoveUser ? true : false;
    },
    addNew() {
      this.$router.push({
        name: 'add-user',
        query: {
          mode: 'add'
        }
      });
    },
    edit(item) {
      this.$router.push({
        name: 'edit-user',
        query: {
          mode: 'edit',
          username: item.userName,
          name: item.recruiter.name,
          email: item.recruiter.email,
          phone: item.recruiter.phone,
          accessPermission: item.accessPermission,
        }
      });
    },
    changePassword(item) {
      this.$router.push({
        name: 'change-user-password',
        query: {
          userName: item.userName,          
        }
      })
    },
    transferAssets(item) {
      this.$router.push({
        name: 'transfer-assets',
        query: {
          username: item.userName,
          name: item.recruiter.name,
          email: item.recruiter.email,
          recruiterId: item.recruiter.id,
        }
      })
    },
    remove(item) {
      if(confirm("Do you want to remove " + item.contactPerson + "?")){
        this.objToRemove = 'api/users/';
        this.objToRemove += item.userName;
        axios.delete(this.objToRemove)
        .then(function(response) {
         // console.log(response);
        })
        .catch(err => console.log(err))
        .finally( () => 
          axios.get('api/users')
            .then(res => this.items = res.data)
            .catch(err => console.log(err))
        )
      }
    }
  }
}
</script>

<style lang="scss">
 @import '~bootstrap/scss/bootstrap.scss';
 @import '~bootstrap-vue/src/index.scss';

.label {
  color: white;
  padding: 8px;
  background-color: #4f4f50;
  font-size: 18px;
}
</style> 
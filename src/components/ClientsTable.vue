<template>
<div id="app">
  <div class="justify-content-centermy-1 row">
    <b-form-group class="col-3" >
      <span class="textJobs">Clients</span>  
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
      <b-button variant="primary" @click="addNew()">Add Client</b-button>
      </div>
    </b-form-group>
  </div>

  <div class="midbody" v-if="isLoading" >
    <!-- <b-spinner variant="info" label="Spinning"></b-spinner> -->
    <b-spinner class="loading" label="Spinning"></b-spinner>
    <span class="loading h2"> &nbsp; Loading...     </span>
  </div>

  <div v-else>
    <!-- Main table element -->
    <b-table bordered small responsive striped hover :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter">
      <template slot="name" scope="item">
        
        {{item.value}} 
       
      </template>
      <template slot="company" scope="item">
        <a href="#" @click.prevent="showFilteredJobs(item.item)">
        {{item.item.companyName}}
         </a>
      </template>
      <template slot="contact" scope="item">
        {{item.item.contactPerson}}
      </template>
      <template slot="email" scope="item">
        {{item.item.email}}      
      </template>
      <template slot="phone" scope="item">
        {{item.item.telephoneOffice}}
      </template>
      <template slot="mobile" scope="item">
        {{item.item.telephoneMobile}}
      </template>
      <template slot="recruiter" scope="item">
         {{(item.item.recruiter !== null) ? item.item.recruiter.name : null}}
      </template>
      <template slot="documents" scope="item">     
        <ul>
          <li v-for="document in item.item.documents" :key="document.FileRepresentationInDatabaseId">
            <a :href="filePath(document)" @click.prevent="downloadDocument(filePath(document), fileName(document))">
              {{document.name }}       
            </a>
          </li>
        </ul>
      </template>
      
    <!-- Column to control data.. -->
      <template slot="actions" scope="items">
        <b-button class="my-btn" variant="warning" size="sm" @click="edit(items.item)" v-if="showEditButtons(items.item)">Edit</b-button>
        <b-button class="my-btn" variant="info" size="sm" @click="uploadCv(items.item)" v-if="showEditButtons(items.item)">Upload File</b-button> 
        <b-button class="my-btn" variant="dark" size="sm" @click="goToTermsOfBusinessPage(items.item)" v-if="showEditButtons(items.item)">Terms of Business</b-button>
        <b-button class="my-btn rem-btn" variant="danger" size="sm" @click="remove(items.item)" v-if="showRemoveButton">Remove</b-button>
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
import EditClient from './modals/EditClient'

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
    EditClient
  },
  data() {
    return {
      items: [],
      fields: {
      company: {
        label: 'Company Name',
        sortable: true
      },
       contact: {
        label: 'Contact Person',
        sortable: true
      },
      designation: {
        label: 'Designation',
        sortable: true
      },
      phone: {
        label: 'Telephone No. (office)',
        sortable: true
      },
      mobile: {
        label: 'Telephone No. (mobile)',
        sortable: true
      },
      email: {
        //label: 'is Active'
        sortable: true
      },
      recruiter: {
        label: 'Recruiter',
        sortable: true
      },
      documents: {
        label: 'Documents saved',
        sortable: false
      },
      remarks: {
        label: 'Remarks',
        sortable: true
      },
      actions: {
        //actions : edit or remove row
      }
    },
    currentPage: 1,
    perPage: 15,
    objToRemove: '',
    filter: null  ,
    isLoading: false,
    }
  },
  created(){
    this.isLoading = true;
    axios.get('api/clients')
      .then(res => this.items = res.data)
      .catch(err => console.log(err))
      .finally(() => this.isLoading = false);
  },
  computed: {
     maxRowsNumber() {
      return this.items.length;
    },
    showRemoveButton(){
      return  this.$store.getters.user.profile.access  == 'elevated' ? true : false;
    },
  },
  methods: {
    showEditButtons(item){
      return  (this.$store.getters.user.profile.recruiterId  == item.recruiter.id || 
              this.$store.getters.user.profile.access  === 'elevated') ? true : false;
    },
    uploadCv(item){
      this.$router.push({
        name: 'upload-client-file',
        query: {
          clientId: item.clientId
        }
      })
    },
    fileName(document){
      if (document){
        return  document.name; 
      }           
    },   
    filePath(document){
      if (document){
        return  'api/SavedDocuments/' + document.fileRepresentationInDatabaseId;     
      }        
    },
    downloadDocument(url, name) {
       axios.get(url, {responseType: 'blob'})
        .then(( {data }) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = name;
          link.click();
        })
        .catch(err => console.log(err));
    },
    goToTermsOfBusinessPage(item){
      this.$router.push({
        name: 'terms-of-business',
        query: {
          clientId: item.clientId,
          contactPerson: item.contactPerson,
          companyName: item.companyName,
          address: item.address,
        }        
      });
    },
    showFilteredJobs(item){
      this.$router.push({
        name: 'filtered-jobs',
        query:{
          filterString: item.companyName,
          showBackButton: true,
        }
      })
    },
    addNew() {
      this.$router.push({
        name: 'add-client',
        query: {
          mode: 'add',
        }
      });
    },
    edit(item) {
      this.$router.push({
        name: 'edit-client',
        query: {
          mode: 'edit',
          clientId: item.clientId,          
        }
      })
    },
    remove(item) {
      if(confirm("Do you want to remove " + item.contactPerson + "?")){
        this.objToRemove = 'api/clients/';
        this.objToRemove += item.clientId;
        axios.delete(this.objToRemove)
        .then()
        .catch(err => console.log(err))
        .finally( () => 
          axios.get('api/clients')
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

  body {
    margin: 0;
  }
</style> 
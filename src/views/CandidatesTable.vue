<template>
<div id="app">
  <div class="justify-content-centermy-1 row">
    <b-form-group class="col-3" >
      <span class="textJobs">Candidates</span>  
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
    <b-form-group class="col-2" >
      <div class="row justify-content-end">
      <b-button variant="primary" @click="addNew()">Add Candidate</b-button>
      </div>
    </b-form-group>    
  </div>
  
  <div class="midbody" v-if="isLoading" >
    <b-spinner class="loading" label="Spinning"></b-spinner>
    <span class="loading h2"> &nbsp; Loading...     </span>
  </div>

  <div v-else>
  <b-table ref="tableRef" bordered small responsive striped hover :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter" :key="refreshTable">
    <template slot="name" scope="item">
        {{item.item.name}}
    </template>
    <template slot="email" scope="item">
      {{item.item.email}}
    </template>
    <template slot="phone" scope="item">
      {{item.item.phone}}      
    </template>
    <template slot="recruiter" scope="item">
      {{(item.item.recruiter !== null) ? item.item.recruiter.name : null}}
    </template>
    <template slot="status" scope="item">
      {{(item.item.candidateStatus !== null) ? item.item.candidateStatus.status : null}}
    </template>
    <template slot="job" scope="item">
      <ul>
        <li v-for="job in item.item.appliedForJobs" :key="job.candidateSentToInterviewId">
          <router-link :to="{name: 'edit-job', query: {mode: 'edit', jobId: job.jobId}}">
            {{ job.title }}
          </router-link>
          
        </li>
      </ul>
    </template>
    <template slot="docs" scope="item">
      <ul>
        <li v-for="document in item.item.documents" :key="document.FileRepresentationInDatabaseId">
          <a :href="filePath(document)" @click.prevent="downloadDocument(filePath(document), fileName(document))">
            {{document.name }}       
          </a>
        </li>
      </ul>
      
    </template>
    <template slot="actions" scope="items">
      <b-button class="my-btn" variant="warning" size="sm" @click="edit(items.item)" v-if="showEditButtons(items.item)">Edit</b-button>
      <b-button class="my-btn" variant="info" size="sm" @click="uploadCv(items.item)" v-if="showEditButtons(items.item)">Upload File</b-button>
      <b-button class="my-btn" variant="dark" size="sm" @click="generateReport(items.item)"> Candidate Report</b-button>
      <b-button class="my-btn" variant="danger" size="sm" @click="remove(items.item)" v-if="showRemoveButton">Remove</b-button>      
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
import EditCandidate from './EditCandidate.vue'
import AddCv from './AddCv.vue'
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
    EditCandidate,
    AddCv
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
        //label: 'Person age',
        sortable: true
      },
      phone: {
        //label: 'is Active'
        sortable: true
      },
      job: {
        //label: 'Actions'
        sortable: true
      },
      status: {
        label: 'Status',
        sortable: true
      },
      docs: {
        label: 'Documents saved',
        sortable: true
      },
      recruiter: {
        label: 'Recruiter',
        sortable: true
      },
      actions: {

      }
    },
    currentPage: 1,
    perPage: 15,
    objToRemove: '',
    filter: null,
    refreshTable: 0 ,
    isLoading: false,
    }
  },
  created(){
    this.isLoading = true;
    axios.get('api/candidates')
      .then(res => this.items = res.data)
      .catch(err => console.log(err))
      .finally(() => this.isLoading = false);
  },
  computed: {
    maxRowsNumber() {
      return this.items.length;
    },
     reloadTable() {
      return  this.refreshTable;
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
    generateReport(item) {
      this.$router.push({
        name: 'generate-report',
        query: {
          candidateName: item.name,
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
    uploadCv(item){
      this.$router.push({
        name: 'upload-cv',
        query: {
          candidateId: item.candidateId,
        }
      })
    },
    addNew() {
      this.$router.push({ 
        name: 'edit-candidate',       
      })
    },
    edit(item) {
      this.$router.push({ 
        name: 'edit-candidate', 
        query: { 
          candidateId: item.candidateId,
          name: item.name,
          email: item.email,
          phone: item.phone,
          jobId: (item.job !== null) ? item.jobId : 0,
          documentId: (item.documents[0]) ? item.documents[0].fileRepresentationInDatabaseId : 0,
          documentName: (item.documents[0]) ? item.documents[0].name : '',
          loadInfoFromBackend: true,   
        } 
      })
    },
    remove(item) {
      if(confirm("Do you want to remove " + item.name + "?")){
        this.objToRemove = 'api/candidates/';
        this.objToRemove += item.candidateId;
        axios.delete(this.objToRemove)
        .then()
        .catch(err => console.log(err))
        .finally( () => 
          axios.get('api/candidates')
          .then(res => this.items = res.data)
          .catch(err => console.log(err))
        );
      }
    },
    
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
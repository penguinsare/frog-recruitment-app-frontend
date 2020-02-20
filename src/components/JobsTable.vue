<template>
<div id="app">
  <div class="justify-content-centermy-1 row">
    <b-form-group class="col-3" >
      <b-button v-if="showButton" @click="close()">&lt; Back</b-button>
      <span v-else class="textJobs" >Jobs</span>     
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
        <b-button variant="primary" @click="addNew()">Add Job</b-button>
      </div>      
    </b-form-group>   
    
  </div>

  <div class="midbody" v-if="isLoading" >
    <b-spinner class="loading" label="Spinning"></b-spinner>
    <span class="loading h2"> &nbsp; Loading...     </span>
  </div>

  <div v-else>
  <b-table striped hover :sort-direction="sortDirection" :sort-compare-options="{ numeric: true, sensitivity: 'base' }" :sort-desc.sync="desc" :sort-by.sync="sortBy" :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter">
    <template slot="title" scope="item">
      {{item.value}}
    </template>
    <template slot="client" scope="item">
       <a href="#" @click.prevent="filterEmployer(item.item)">
         {{(item.item.client !== null) ? item.item.client.companyName : null}}
      </a>
    </template>
    <template slot="contact" scope="item">
      {{(item.item.client !== null) ?item.item.client.contactPerson : null}}
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
    <template slot="candidate" scope="item">
      <ul>
        <li v-for="candidate in item.item.candidatesSent" :key="candidate.candidateSentToInterviewId">
          <router-link :to="{name: 'edit-candidate', query: {loadInfoFromBackend: true, candidateId: candidate.candidateId}}">
            {{ candidate.candidateName }} {{showCandidateEmailIfExist(candidate)}}
          </router-link>
          
        </li>
      </ul>
    </template>
    <template slot="placement" scope="item">
      <ul>
        <li >
          Salary:
          <b-input-group size="sm" append="THB">
            <b-form-input disabled size="sm"  v-model="item.item.baseSalary"></b-form-input>
          </b-input-group>        
        </li>
        <li >
          Fee:  
          <b-input-group size="sm" append="%">
            <b-form-input disabled size="sm"  v-model="item.item.fee"></b-form-input>
          </b-input-group>    
        </li>
        <li >
          Starting: <b-form-input class="form-control" size="sm" disabled type="date" v-model="item.item.startDate"/> 
        </li>
      </ul>
    </template>
    <template slot="status" scope="item">
      {{(item.item.jobStatus !== null) ? item.item.jobStatus.status : null}}
    </template>
    <template slot="remarks" scope="item">
      {{item.item.remarks}}
    </template>
    <template slot="actions" scope="items">
      <b-button class="my-btn" variant="warning" size="sm" @click="edit(items.item)" v-if="showEditButtons(items.item)">Edit</b-button>
      <b-button class="my-btn" variant="info" size="sm" @click="uploadCv(items.item)" v-if="showEditButtons(items.item)">Upload File</b-button> 
      <b-button class="my-btn" variant="success" size="sm" @click="sendCandidateToInterview(items.item)" v-if="showEditButtons(items.item)" >Send Candidate</b-button>      
      <b-button class="rem-btn my-btn" variant="danger" size="sm" @click="remove(items.item)" v-if="showRemoveButton">Remove</b-button>
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
import EditJob from './modals/EditJob'

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
    EditJob
  },
  data() {
    return {
      items: [],
      sortDirection: 'desc',
      desc: true,
      sortBy: 'id',
      fields: {
        client: {
          label: 'Company Name',
          sortable: true
        },
        contact: {
          label: 'Contact Person',
          sortable: true
        },
        title: {
          label: 'Job Title',
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
        candidate: {
          label: 'Candidates sent',
          sortable: false
        },
        placement: {
          label: 'Placement',
          sortable: false
        },
        status: {
          label: 'Job status',
          sortable: true
        },
        remarks: {
          label: 'Remarks',
          sortable: true
        },
        actions: {
          // edit or remove row
        }
      },
      currentPage: 1,
      perPage: 15,
      objToRemove: '',
      filter: null ,
      error: null ,
      isLoading: false,
      showBackButton: false,
    }
  },
  created(){
    this.isLoading = true;
    if(this.$route.query.filterString){
        this.filter = this.$route.query.filterString;
    }
    if(this.$route.query.showBackButton){
        this.showBackButton = this.$route.query.showBackButton;
    }
    axios.get('api/jobs')
      .then(res =>{ 
        this.items = res.data
      })
      .catch(err => console.log(err.message))
      .finally(() => this.isLoading = false);
  },
  computed: {
    maxRowsNumber() {
      return this.items.length;
    },
    showButton(){
      this.isLoading = true
      if(this.$route.query.filterString){
        this.filter = this.$route.query.filterString;
      }else{
        this.filter = '';
      }
      if(this.$route.query.showBackButton){
        this.showBackButton = this.$route.query.showBackButton;
      }
      axios.get('api/jobs')
        .then(res =>{ 
          this.items = res.data;
        })
        .catch(err => console.log(err.message))
        .finally(() => this.isLoading = false);
      return this.$route.name === 'filtered-jobs' ? true : false;
    },
    showRemoveButton(){
      return  this.$store.getters.user.profile.access  == 'elevated' ? true : false;
    },
  },
  methods: {
    showCandidateEmailIfExist(candidate){
      if (candidate.candidateEmail){
        return "(" + candidate.candidateEmail + ")";
      }
    },
    showEditButtons(item){
      return  (this.$store.getters.user.profile.recruiterId  == item.recruiter.id || 
              this.$store.getters.user.profile.access  === 'elevated') ? true : false;
    },
    close(){
      this.$router.go(-1);
    },
    filterEmployer(item){
      this.filter = item.client ? item.client.companyName : '';
    },
    sendCandidateToInterview(item) {
      this.$router.push({
        name: 'send-candidate',
        query: {
          jobId: item.jobId,
          title: item.title,
        }
      })
    },
    placeCandidate(item) {
      this.$router.push({
        name: 'add-placement',
        query: {
          jobId: item.jobId,
          title: item.title,
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
        .then(({data}) => {
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
        name: 'upload-job-file',
        query: {
          jobId: item.jobId,
        }
      })
    },
    addNew() {
      this.$router.push({
        name: 'add-job',
        query: {
          mode: 'add'
        }
      })
    },
    edit(item) {
      this.$router.push({
        name: 'edit-job',
        query: {
          mode: 'edit',
          jobId: item.jobId,
        }
      })
    },
    remove(item) {
      if(confirm("Do you want to remove " + item.title + "?")){
        this.objToRemove = 'api/jobs/';
        this.objToRemove += item.jobId;
        axios.delete(this.objToRemove)
          .then(function(response) {
          })
          .catch(err => console.log(err))
          .finally( () => 
            axios.get('api/jobs')
              .then(res => this.items = res.data)
              .catch(err => console.log(err))
          );
      }
    }
  }
}
</script>

<style lang="scss">
 @import '~bootstrap/scss/bootstrap.scss';
 @import '~bootstrap-vue/src/index.scss';
.rem-btn {
  background-color: rgb(72, 22, 22)
}
.label {
  color: white;
  padding: 8px;
  background-color: #4f4f50;
  font-size: 18px;
}

.textJobs{
  font-size: 30px;
  margin: 50px;
}


.my-btn {
    margin: 2px;
}


</style> 
<template>

  <div class="midbody" v-if="isLoading" >
    <b-spinner class="loading" label="Spinning"></b-spinner>
    <span class="loading h2"> &nbsp; Loading...     </span>
  </div>

  <div v-else>
   <div class="container">
      <br>
       <div v-if="isEditMode">
        <h2>Edit Candidate</h2>
      </div>
        <div v-else>
        <h2>Add Candidate</h2>
      </div>
      
    <div class="container"><hr><br></div>      
        
      <b-row class="my-1">
        <b-col sm="3">
          <label>Name:</label>
        </b-col>
        <b-col sm="9">
          <b-form-input id="input-name" :state="requirementsOK"
          aria-describedby="input-live-feedback" v-model="name"></b-form-input>
          <b-form-invalid-feedback id="input-live-feedback">
            Candidate's name cannot be empty!
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3">
          <label>Email:</label>
        </b-col>
        <b-col sm="9">
          <b-form-input v-model="email"></b-form-input>
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
      <b-row class="my-1">
        <b-col sm="3">
          <label>Status:</label>
        </b-col>
        <b-col sm="9">
          <multiselect  track-by="candidateStatusId" label="status" v-model="chosenStatus" :options="statusOptions"></multiselect>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3">
          <label>Job Title:</label>
        </b-col>
        <b-col sm="9">
          <multiselect  track-by="jobId" label="title" v-model="chosenJob" :options="jobs"></multiselect>
        </b-col>
      </b-row>
      <b-row class="my-1">
      <b-col sm="3">
        <label>Documents saved:</label>
      </b-col>
      <b-col sm="9">
        <b-table outlined striped hover :items="items" :fields="fields">
          <template slot="document" scope="item">
           
          <a :href="filePath(item.item)" @click.prevent="downloadDocument(item.item)">
           {{ item.item.name}}        
          </a>
            <b-button class="btn btn-sm" style="background-color: red; border-radius: 60%;" @click="removeDocument(item.item)" v-if="showRemoveButton">X</b-button>
          </template>
        </b-table>
      </b-col>
      </b-row>
      <br>
      <div class="text-right">
      <b-button class="my-btn" variant="success" size="lg" id="add" :disabled="!requirementsOK" @click="add">
         <b-spinner small v-if="isUploading"></b-spinner>
        Save
      </b-button>
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
  name: 'editcandidate',
  components: {
    BRow, BCol,
    BButton,
    BDropdown,
    Multiselect
  },
  computed: {
    requirementsOK() {
      return this.name.length > 0 ? true : false;
    },
    isEditMode() {
      return this.candidateId > 0 ? true : false;
    },
    showRemoveButton() {
      return this.$store.state.user.profile.access === 'elevated' ? true : false;
    },
  },
  methods: {
    removeDocument(item) {
       if(confirm("Do you want to remove the document" + item.name + "?")){        
        axios.delete(this.filePath(item))
        .then(() => {
          axios.get('api/candidates/' + this.candidateId)
          .then(res => this.items = res.data.documents ? res.data.documents : this.items)
        })
      }
    },
    close() {
      this.$router.go(-1);
    },
    add() {
      this.isUploading = true
      this.pathToElement = 'api/candidates/' + this.candidateId;
      if (this.candidateId){
        axios.put(this.pathToElement, {
          candidateId: this.candidateId,
          name: this.name,
          email: this.email,
          phone : this.phone,
          candidateStatusId: this.choseStatus ? this.chosenStatus.candidateStatusId : 0,
          jobId: (this.chosenJob) ? this.chosenJob.jobId : this.jobId,
          recruiterId: this.$store.state.user.profile.recruiterId,
        })
        .then()
        .catch(function (error) {
          console.log(error);
        })
        .finally( () => this.$router.go(-1));
      }
      else{
        axios.post('api/candidates/', {
          name: this.name,
          email: this.email,
          phone : this.phone,
          candidateStatusId:  this.choseStatus ? this.chosenStatus.candidateStatusId : 0,
          jobId: (this.chosenJob) ? this.chosenJob.jobId : this.jobId,
          recruiterId: this.$store.state.user.profile.recruiterId,
        })
        .then()
        .catch(function (error) {
          console.log(error);
        })
        .finally( () => this.$router.go(-1));
      }      
    },   
    filePath(item){
      return  'api/SavedDocuments/' + item.fileRepresentationInDatabaseId;      
    },
    downloadDocument(item) {
      axios.get(this.filePath(item), {responseType: 'blob'})
      .then(( {data }) => {
        const blob = new Blob([data], { type: 'application/pdf' })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = item.name
        link.click()
      })
      .catch(err => console.log(err));
    },
    uploadCv(){
      this.$router.push({
        name: 'upload-cv',
        query: {
          candidateId: this.candidateId,
          documentId: this.documentId, 
        }
      })
    },
  },
  created(){
    this.isLoading = true
    if (this.$route.query.loadInfoFromBackend){
      this.loadInfoFromBackend = this.$route.query.loadInfoFromBackend;     
    }
    if (this.$route.query.candidateId){
      this.candidateId = this.$route.query.candidateId;      
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
    if (this.$route.query.jobId){
      this.jobId = this.$route.query.jobId;
    } 
    if (this.$route.query.documentId){
      this.documentId = this.$route.query.documentId;
    }
    if (this.$route.query.documentName){
      this.documentName = this.$route.query.documentName;
    }
    if (this.$route.query.chosenStatus){
      this.chosenStatus = this.$route.query.chosenStatus;
    }
  

    if (this.loadInfoFromBackend === true){
    axios.get('api/candidates/' + this.candidateId)
      .then(res => 
      {
        this.name = res.data.name
        this.email = res.data.email
        this.phone = res.data.phone
        this.jobId = res.data.job ? res.data.job.id : 0
        this.items = res.data.documents ? res.data.documents : []
        this.chosenStatus = res.data.candidateStatus
        axios.get('api/jobs')
        .then(res => 
        {
          this.jobs = res.data
          if (this.jobId > 0)
          {
            var x;
            for (x in this.jobs)
            {
              if (this.jobs[x].jobId == this.jobId) {
                this.chosenJob = this.jobs[x];
              }
            }
          }            
        })
        .catch(err => console.log(err))
        .finally(() => {
          axios.get('api/candidateStatuses')
          .then(res => 
          {
            this.statusOptions = res.data;
            var x;
            for (x in this.statusOptions)
            {
              if (this.statusOptions[x].candidateStatusId == this.chosenStatus.candidateStatusId) {
                this.chosenStatus = this.statusOptions[x];
              }
            }
          })
          .finally(() => this.isLoading = false);       
        })
      })
      .catch(err => console.log(err));
    }
    else{
      axios.get('api/jobs')
      .then(res => 
      {
        this.jobs = res.data;
        if (this.jobId > 0)
        {
          var x;
          for (x in this.jobs)
          {
            if (this.jobs[x].jobId == this.jobId) {
              this.chosenJob = this.jobs[x];
            }
          }
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        axios.get('api/candidateStatuses')
        .then(res => 
        {
          this.statusOptions = res.data;          
        })
        .finally(() => this.isLoading = false);       
      })
    }    
  },
  data() {
    return {
      candidateId: 0,
      name: '',
      email: '',
      phone: '',
      jobId: 0,
      candidateStatusId: 0,
      recruiterId: 0,
      jobs: [],
      chosenStatus: null,
      statusOptions: [],
      chosenJob : null,
      documentName: '',
      documentId: 0,
      loadInfoFromBackend: false,
      isLoading: false,
      isUploading: false,
      items: [],
      fields: {
        document: {
          label: 'Document Name',
          sortable: false,
        }, 
      },
    }
  }
}
</script>

<style lang="scss">
  body {
    margin: 0;
  }
</style> 
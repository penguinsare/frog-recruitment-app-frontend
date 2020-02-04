<template>
<div>
  <!-- <b-modal id="editclient" hide-footer title="Edit the existing 'Client' element"> -->
  <div class="midbody" v-if="isLoading" >
    <b-spinner variant="info" label="Spinning"></b-spinner>
    <span class="loading h2"> &nbsp; Loading...     </span>
  </div>
    
  <div v-else>
    <div class="container">
      <br>
      <h2 v-if="isEditMode">Edit Client</h2> 
      <h2 v-else>Add Client</h2> 
    </div>
    <div class="container"><hr><br></div>
    <div class="container">
    <b-row class="my-1">
      <b-col sm="3">
        <label>Contact Person:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input id="input-contactPerson" :state="requirementsOK"
        aria-describedby="input-live-feedback" v-model="contactPerson"></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback">
          Contact Person cannot be empty!
        </b-form-invalid-feedback>
      </b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="3">
        <label>Company Name:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input v-model="companyName"></b-form-input>
      </b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="3">
        <label>Designation:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input v-model="designation"></b-form-input>
      </b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="3">
        <label>Telephone (Office):</label>
      </b-col>
      <b-col sm="9">
        <b-form-input v-model="telephoneOffice"></b-form-input>
      </b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="3">
        <label>Telephone (Mobile):</label>
      </b-col>
      <b-col sm="9">
        <b-form-input v-model="telephoneMobile"></b-form-input>
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
        <label>Address:</label>
      </b-col>
      <b-col sm="9">
        <b-form-textarea  v-model="address"></b-form-textarea>
      </b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="3">
        <label>Remarks:</label>
      </b-col>
      <b-col sm="9">
        <b-form-textarea v-model="remarks"></b-form-textarea>
      </b-col>
    </b-row>
    <b-row class="my-1">
      <b-col sm="3">
        <label>Recruiter:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input disabled v-model="recruiterName"></b-form-input>
      </b-col>
    </b-row>
    
    <!--b-row class="my-1">
      <b-col sm="3">
        <label>Recruiter:</label>
      </b-col>
      <b-col sm="9">
        <b-dropdown  size="sm" id="dropdown-1" class="m-md-2">
          <template slot="button-content">
            {{this.recruiterName}}
          </template>
          <b-dropdown-item v-for="recruiter in this.recruiters" class="b-dropdown-item" :key="recruiter.name" @click="onRecruiterChosen(recruiter)">{{ recruiter.name }}</b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row-->
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
      <b-spinner type="grow" variant="light" small v-if="isUploading"></b-spinner>
      Save
    </b-button>
    <b-button class="my-btn" size="lg" id="close" @click="close">Close</b-button>
    </div>
  <!-- </b-modal> -->
  </div>
  </div>
</div>
</template>

<script>
import {BRow, BCol, BButton} from 'bootstrap-vue';
import axios from 'axios';

export default {
  name: 'editclient',
 /*  mode: 'production', */
  components: {
    BRow, BCol,
    BButton,
  },

  computed: {
    requirementsOK() {
      return this.contactPerson.length > 0 ? true : false
    },
    isEditMode() {
      return this.mode === 'edit' ? true : false
    },
    showRemoveButton() {
      return this.$store.state.user.profile.access === 'elevated' ? true : false
    },
  },
  methods: {
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
        link.click()})
        .catch(err => console.log(err))
    },
    removeDocument(item) {
       if(confirm("Do you want to remove the document" + item.name + "?")){        
        axios.delete(this.filePath(item))
        .then(() => {
          axios.get('api/clients/' + this.clientId)
          .then(res => this.items = res.data.documents ? res.data.documents : this.items)
        })
      }
    },
    close() {
      this.$router.go(-1)
    },
    add() {
      this.isUploading = true
      if (this.clientId > 0)
      {
        this.pathToElement = 'api/clients/' + this.clientId
        axios.put(this.pathToElement, {
          clientId : this.clientId,
          contactPerson: this.contactPerson,
          companyName: this.companyName,
          designation : this.designation,
          telephoneOffice : this.telephoneOffice,
          telephoneMobile : this.telephoneMobile,
          address: this.address,
          email: this.email,
          remarks: this.remarks,
          recruiterId: this.$store.state.user.profile.recruiterId,
        })
        .then()
        .catch(function (error) {
          console.log(error)
        })
        .finally( () => this.$router.go(-1))
      }
      else{
        axios.post('api/clients/', {
          clientId : this.clientId,
          contactPerson: this.contactPerson,
          companyName: this.companyName,
          designation : this.designation,
          telephoneOffice : this.telephoneOffice,
          telephoneMobile : this.telephoneMobile,
          address: this.address,
          email: this.email,
          remarks: this.remarks,
          recruiterId: this.$store.state.user.profile.recruiterId,
        })
        .then()
        .catch(function (error) {
          console.log(error)
        })
        .finally( () => this.$router.go(-1))
      }      
    }
  },
  created(){
    this.isLoading = true
    if (this.$route.query.mode){
      this.mode = this.$route.query.mode
    }
    if (this.mode === 'edit'){

      if (this.$route.query.clientId){
        this.clientId = this.$route.query.clientId
        axios.get('api/clients/' + this.$route.query.clientId)
        .then(res => {
          this.title = res.data.title
          this.remarks = res.data.title
          this.contactPerson = res.data.contactPerson
          this.companyName = res.data.companyName
          this.designation = res.data.designation
          this.telephoneOffice = res.data.telephoneOffice
          this.telephoneMobile = res.data.telephoneMobile
          this.email = res.data.email
          this.address = res.data.address
          this.remarks = res.data.remarks
          this.items = res.data.documents
          this.recruiterName = res.data.recruiter ? res.data.recruiter.name : ''        
          this.recruiterId = res.data.recruiter ? res.data.recruiter.id : 0  
        })
        .catch(err => console.log(err))
        .finally(() => this.isLoading = false)

      }else{
        this.isLoading = false
      }
    }else{
        this.recruiterName =  this.$store.state.user.profile.name,          
        this.recruiterId =  this.$store.state.user.profile.recruiterId, 
        this.isLoading = false
      }   
  },
  data() {
    return {
      clientId : 0,
      mode: '',
      contactPerson : "",
      companyName	: "",
      designation	: '',
      telephoneOffice :	'',
      telephoneMobile	: '',
      email	: "",
      address: '',
      remarks :	'',
      recruiterId: 0,
      recruiterName: '',
      // recruiters: [],
      pathToElement : '',
      isUploading: false,
      isLoading: false,
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
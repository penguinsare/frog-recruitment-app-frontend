<template>
<div>
  <div class="midbody" v-if="isLoading" >
    <b-spinner variant="info" label="Spinning"></b-spinner>
    <span class="loading h2"> &nbsp; Loading...     </span>
  </div>


<div v-else>
  <!-- <b-modal id="editJob" hide-footer title="Edit the existing 'Job' element"> -->
  <div class="container">
      <br>
      <div v-if="isEditMode">
        <h2>Edit Job</h2>
      </div>
        <div v-else>
        <h2>Add Job</h2>
      </div>

       
    </div>
    <div class="container"><hr><br></div>
  

   <div class="container"> 
    <b-row class="my-3">
      <b-col sm="3">
        <label>Company Name:</label>
      </b-col>
      <b-col sm="9">
        <multiselect  track-by="clientId" label="companyNcontact" v-model="chosenClient" :options="clients"></multiselect>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col sm="3">
        <label>Contact Person:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input disabled v-model="compContactPerson"></b-form-input>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col sm="3">
        <label>Job Title (Open Jobs):</label>
      </b-col>
      <b-col sm="9">
        <multiselect   v-model="title" :options="jobTitles"></multiselect>
        <!-- <b-form-input id="input-jobtitle" :state="requirementsOK"
        aria-describedby="input-live-feedback" v-model="title"></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback">
          Job title cannot be empty!
        </b-form-invalid-feedback> -->
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col sm="3">
        <label>Job Title:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input id="input-jobtitle" :state="requirementsOK"
        aria-describedby="input-live-feedback" v-model="title"></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback">
          Job title cannot be empty!
        </b-form-invalid-feedback>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col sm="3">
        <label>Job Status:</label>
      </b-col>
      <b-col sm="9">
        <multiselect track-by="status" label="status" v-model="chosenJobStatus" :options="jobStatuses"></multiselect>
      </b-col>
    </b-row>    
    <b-row class="my-3">
      <b-col sm="3">
        <label>Recruiter:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input disabled v-model="recruiterName"></b-form-input>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col sm="3">
        <label>Remarks:</label>
      </b-col>
      <b-col sm="9">
        <b-form-textarea v-model="remarks"></b-form-textarea>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col sm="3">
        <label>Candidates sent:</label>
      </b-col>
      <b-col sm="9">
        <b-table outlined striped hover :items="items" :fields="fields">
          <template slot="candidate" scope="item">
            <router-link :to="{name: 'edit-candidate', query: {candidateId: item.item.candidateId, loadInfoFromBackend: true}}" > 
              {{item.item.candidateName + ' (' + item.item.candidateEmail + ') '}} 
            </router-link>
            <b-button  class="btn btn-sm btn-circle" style="border-radius: 60%;" variant="danger" @click="removeCandidateSent(item.item)" v-if="showRemoveButton">X</b-button>
            <!-- <b-spinner v-if="removeInProgress" style="width: 2rem; height: 2rem;" > </b-spinner> -->
          </template>
        </b-table>
      </b-col>
    </b-row>
    
    <b-row class="my-3">
      <b-col sm="3">
        <label>Documents saved:</label>
      </b-col>
      <b-col sm="9">
        <b-table outlined striped hover :items="docItems" :fields="docFields">
          <template slot="document" scope="item">
           
          <a :href="filePath(item.item)" @click.prevent="downloadDocument(item.item)">
           {{ item.item.name}}        
          </a>
            <b-button class="btn btn-sm btn-circle" style="border-radius: 60%;" variant="danger" @click="removeDocument(item.item)" v-if="showRemoveButton">X</b-button>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <b-row class="my-3">
      <b-col sm="3">
        <label>Placement:</label>
      </b-col>
      <b-col sm="9">       

      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col sm="3">
        <label>Base salary (THB):</label>
      </b-col>
      <b-col sm="9">       
         <b-form-input v-model="baseSalary"></b-form-input>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col sm="3">
        <label>Fee (%):</label>
      </b-col>
      <b-col sm="9">       
         <b-form-input v-model="fee"></b-form-input>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col sm="3">
        <label>Start date:</label>
      </b-col>
      <b-col sm="9">       
         <b-form-input type="date" v-model="startDate"></b-form-input>
      </b-col>
    </b-row>
    <br>
    <div class="text-right"> 
    <b-button class="my-btn" variant="success" size="lg" id="add" :disabled="!requirementsOK" @click="add">
      <b-spinner type="grow" variant="light" small v-if="isUploading"></b-spinner>Save
    </b-button>
    <b-button class="my-btn" id="close" @click="close" size="lg">Close</b-button>
  <!-- </b-modal> -->
    </div>
  </div>
</div>
</div>
</template>

<script>
import {BRow, BCol, BButton, BDropdown} from 'bootstrap-vue';
import axios from 'axios';
import Multiselect from 'vue-multiselect'

  // register globally
 // Vue.component('multiselect', Multiselect)

export default {
  name: 'editjob',
 /*  mode: 'production', */
  components: {
    BRow, BCol,
    BButton,
    BDropdown,
    Multiselect
  },
  computed: {
    jobTitles() {
      return (this.jobs && this.chosenClient) ? this.jobs
      .filter(j =>  j.client.contactPerson === this.chosenClient.contactPerson && j.jobStatus ? j.jobStatus.status.toUpperCase() === "OPEN" ? true : false : false)
      .map(j => j.title) : []   
    },
    requirementsOK() {
      return this.title.length > 0 ? true : false
    },
    compContactPerson() {
      return (this.chosenClient ? this.chosenClient.contactPerson : "");
    },
    clientsTransformedList() {
      return this.clientsCombo
    },
    isEditMode() {
      return this.mode === 'edit' ? true : false
    },
    showRemoveButton() {
      return this.$store.state.user.profile.access === 'elevated' ? true : false
    },
  },
  methods: {
    // formatDate(){
    //   if (this.startDate == null)
    //   {
    //     return ' '
    //   }else{
    //     var res = this.startDate.split("-");
    //     return res[2] + '-' + res[1] + '-' + res[0]
    //   }       
    // },
    candidateName(item){
          return  item.name;      
    },
    showCandidateProfile(item) {
     this.$router.push({
        name: 'edit-candidate',
        query: {
          mode: 'edit',
          candidateId: item.candidateId,
        }})
      
    },
    removeDocument(item) {
       if(confirm("Do you want to remove the document" + item.name + "?")){        
        axios.delete(this.filePath(item))
        .then(() => {
          axios.get('api/candidates/' + this.candidateId)
          .then(res => this.items = res.data.documents ? res.data.documents : this.items)
        })
      }
    },
    removeCandidateSent(item) {
       if(confirm("Do you want to remove " + item.candidateName + "?")){
        this.removeInProgress = true
        axios.delete('api/sendToInterview/' + item.candidateSentToIntrerviewId)
        .then(() => {
          axios.get('api/jobs/' + this.jobId)
          .then(res => this.items = res.data.candidatesSent ? res.data.candidatesSent : this.items)
        })
      }
    },
    close() {
      this.$router.go(-1)
    },
    add() {
      this.isUploading = true
      
      if (this.jobId > 0){
        this.pathToElement = 'api/jobs/' + this.jobId;
        axios.put(this.pathToElement, {
          jobId : this.jobId,
          title: this.title,
          clientId: this.chosenClient ? this.chosenClient.clientId : 0,
          recruiterId: this.$store.state.user.profile.recruiterId,
          jobStatusId: this.chosenJobStatus ? this.chosenJobStatus.jobStatusId : 0,
          remarks: this.remarks,
          baseSalary: this.baseSalary,
          fee:  this.fee,
          startDate:  this.startDate
        })
        .then()
        .catch(function (error) {
          console.log(error)
        })
        .finally( () => this.$router.go(-1))
      }
      else{
        axios.post('api/jobs/', {
          title: this.title,
          clientId: this.chosenClient ? this.chosenClient.clientId : 0,
          recruiterId: this.$store.state.user.profile.recruiterId,
          jobStatusId: this.chosenJobStatus ? this.chosenJobStatus.jobStatusId : 0,
          remarks: this.remarks,
           baseSalary: this.baseSalary,
          fee:  this.fee,
          startDate: this.startDate
        })
        .then()
        .catch(function (error) {
          console.log(error)
        })
        .finally( () => this.$router.go(-1))
      }
      
    },
  },
  created(){
    this.isLoading = true 

    if (this.$route.query.mode){
      this.mode = this.$route.query.mode
    } 
    if (this.$route.query.mode === 'edit'){  
      if (this.$route.query.jobId){
        this.jobId = this.$route.query.jobId
      }  
      // if (this.$route.query.title){
      //   this.title = this.$route.query.title
      // }
      // if (this.$route.query.clientId){
      //   this.clientId = this.$route.query.clientId
      // }
      // if (this.$route.query.recruiterId){
      //   this.recruiterId = this.$route.query.recruiterId
      // }
      // if (this.$route.query.recruiterName){
      //   this.recruiterName = this.$route.query.recruiterName
      // }
      // if (this.$route.query.remarks){
      //   this.remarks = this.$route.query.remarks
      // }  
      // if (this.$route.query.jobStatusId){
      //   this.jobStatusId = this.$route.query.jobStatusId
      // }
      // if (this.$route.query.candidateId){
      //   this.candidateId = this.$route.query.candidateId
      // }
    }
    else{
      this.recruiterId = this.$store.state.user.profile.recruiterId
      this.recruiterName = this.$store.state.user.profile.name
    }

    axios.get('api/clients')
    .then(res => {
      this.clients = res.data
      var x;
      for (x in this.clients) {          
        this.clients[x].companyNcontact = this.clients[x].companyName + " (" + this.clients[x].contactPerson + ")";
        //this.chosenClient = (this.clients[x].clientId == this.clientId) ? this.clients[x] : this.chosenClient
      }
      axios.get('api/jobstatus')
      .then(res => {
        this.jobStatuses = res.data
        if (this.jobStatusId > 0) {
          var x;
          for (x in this.jobStatuses)
          {
            if (this.jobStatuses[x].jobStatusId == this.jobStatusId) {
              this.chosenJobStatus = this.jobStatuses[x];
            }
          }
        }  
        axios.get('api/jobs')
        .then(res => {
          this.jobs = res.data

          if (this.$route.query.mode === 'edit'){
            axios.get('api/jobs/' + this.$route.query.jobId)
            .then(res => {
              this.title = res.data.title
              this.remarks = res.data.remarks
              this.jobStatusId = res.data.jobStatus ? res.data.jobStatus.jobStatusId : this.jobStatusId
              this.clientId = res.data.client ? res.data.client.id : this.clientId
              this.recruiterId = res.data.recruiter ? res.data.recruiter.id : this.recruiterId
              this.recruiterName = res.data.recruiter ? res.data.recruiter.name : this.recruiterName
              this.items = res.data.candidatesSent
              this.docItems = res.data.documents
              this.placement = res.data.placement
              this.isLoading = false
              this.baseSalary = res.data.baseSalary
              this.fee = res.data.fee
              this.startDate = res.data.startDate

              var x;
              for (x in this.clients) {          
                //this.clients[x].companyNcontact = this.clients[x].companyName + " (" + this.clients[x].contactPerson + ")";
                this.chosenClient = (this.clients[x].clientId == this.clientId) ? this.clients[x] : this.chosenClient
              }
              var y;
              for (y in this.jobStatuses)
              {
                if (this.jobStatuses[y].jobStatusId == this.jobStatusId) {
                  this.chosenJobStatus = this.jobStatuses[y];
                }
              }
              axios.get('api/candidates/' + this.placement.candidateId)
              .then(res => {
                this.placement.name = res.data.name;
              })
            })
            .catch(() => this.isLoading = false)
          }
          else{
            this.isLoading = false
          } 
        })
        .catch(() => this.isLoading = false)                  
      })
    })
    .catch(() => this.isLoading = false)
    //.finally(() => this.isLoading = false)
    
  },
  data() {
    return {
      mode: '',
      jobId : 0,
      title : '',
      remarks : '',
      jobStatusId: 0,
      jobStatuses: [],
      chosenJobStatus: null,
      clientId: 0,
      clients: [],
      clientsCombo: [],
      chosenClient : null,
      recruiterId: 0,
      recruiterName: '',
      recruiters: [],
      chosenRecruiter : null,
      pathToElement : '',
      candidateId: 0,
      isLoading: false,
      isUploading: false,
      baseSalary: '',
      fee: '',
      startDate: '',
      jobs: [],
      // placementFields: {
      //   candidate: {
      //     label: 'Candidate',
      //     sortable: false
      //   }, 
      //   basicSalary: {
      //     label: 'Basic Salary (THB)',
      //     sortable: false
      //   },
      //   fee: {
      //     label: 'Fee (%)',
      //     sortable: false
      //   },
      //   startingDate: {
      //     label: 'Starting Date',
      //     sortable: false
      //   },
      //   actions: {
      //     label: ' ',
      //     sortable: false
      //   },
      //},
      fields:{
        candidate: {
          label: 'Name',
          sortable: false
        },        
      },
      docFields: {
        document: {
          label: 'Document Name',
          sortable: false,
        }
      },
      items: [],
      docItems: [],
      removeInProgress: false,

    }
  }
}
</script>


<!-- TODO!!!!! atm I just copy but otherwise it crashes the app
     Add Multiselect CSS. Can be added as a static asset or inside a component. -->
<!--style src="vue-multiselect/dist/vue-multiselect.min.css"></style-->
<style>
fieldset[disabled] .multiselect{pointer-events:none}.multiselect__spinner{position:absolute;right:1px;top:1px;width:48px;height:35px;background:#fff;display:block}.multiselect__spinner:after,.multiselect__spinner:before{position:absolute;content:"";top:50%;left:50%;margin:-8px 0 0 -8px;width:16px;height:16px;border-radius:100%;border:2px solid transparent;border-top-color:#41b883;box-shadow:0 0 0 1px transparent}.multiselect__spinner:before{animation:spinning 2.4s cubic-bezier(.41,.26,.2,.62);animation-iteration-count:infinite}.multiselect__spinner:after{animation:spinning 2.4s cubic-bezier(.51,.09,.21,.8);animation-iteration-count:infinite}.multiselect__loading-enter-active,.multiselect__loading-leave-active{transition:opacity .4s ease-in-out;opacity:1}.multiselect__loading-enter,.multiselect__loading-leave-active{opacity:0}.multiselect,.multiselect__input,.multiselect__single{font-family:inherit;font-size:16px;-ms-touch-action:manipulation;touch-action:manipulation}.multiselect{box-sizing:content-box;display:block;position:relative;width:100%;min-height:40px;text-align:left;color:#35495e}.multiselect *{box-sizing:border-box}.multiselect:focus{outline:none}.multiselect--disabled{background:#ededed;pointer-events:none;opacity:.6}.multiselect--active{z-index:50}.multiselect--active:not(.multiselect--above) .multiselect__current,.multiselect--active:not(.multiselect--above) .multiselect__input,.multiselect--active:not(.multiselect--above) .multiselect__tags{border-bottom-left-radius:0;border-bottom-right-radius:0}.multiselect--active .multiselect__select{transform:rotate(180deg)}.multiselect--above.multiselect--active .multiselect__current,.multiselect--above.multiselect--active .multiselect__input,.multiselect--above.multiselect--active .multiselect__tags{border-top-left-radius:0;border-top-right-radius:0}.multiselect__input,.multiselect__single{position:relative;display:inline-block;min-height:20px;line-height:20px;border:none;border-radius:5px;background:#fff;padding:0 0 0 5px;width:100%;transition:border .1s ease;box-sizing:border-box;margin-bottom:8px;vertical-align:top}.multiselect__input:-ms-input-placeholder{color:#35495e}.multiselect__input::placeholder{color:#35495e}.multiselect__tag~.multiselect__input,.multiselect__tag~.multiselect__single{width:auto}.multiselect__input:hover,.multiselect__single:hover{border-color:#cfcfcf}.multiselect__input:focus,.multiselect__single:focus{border-color:#a8a8a8;outline:none}.multiselect__single{padding-left:5px;margin-bottom:8px}.multiselect__tags-wrap{display:inline}.multiselect__tags{min-height:40px;display:block;padding:8px 40px 0 8px;border-radius:5px;border:1px solid #e8e8e8;background:#fff;font-size:14px}.multiselect__tag{position:relative;display:inline-block;padding:4px 26px 4px 10px;border-radius:5px;margin-right:10px;color:#fff;line-height:1;background:#41b883;margin-bottom:5px;white-space:nowrap;overflow:hidden;max-width:100%;text-overflow:ellipsis}.multiselect__tag-icon{cursor:pointer;margin-left:7px;position:absolute;right:0;top:0;bottom:0;font-weight:700;font-style:normal;width:22px;text-align:center;line-height:22px;transition:all .2s ease;border-radius:5px}.multiselect__tag-icon:after{content:"\D7";color:#266d4d;font-size:14px}.multiselect__tag-icon:focus,.multiselect__tag-icon:hover{background:#369a6e}.multiselect__tag-icon:focus:after,.multiselect__tag-icon:hover:after{color:#fff}.multiselect__current{min-height:40px;overflow:hidden;padding:8px 30px 0 12px;white-space:nowrap;border-radius:5px;border:1px solid #e8e8e8}.multiselect__current,.multiselect__select{line-height:16px;box-sizing:border-box;display:block;margin:0;text-decoration:none;cursor:pointer}.multiselect__select{position:absolute;width:40px;height:38px;right:1px;top:1px;padding:4px 8px;text-align:center;transition:transform .2s ease}.multiselect__select:before{position:relative;right:0;top:65%;color:#999;margin-top:4px;border-color:#999 transparent transparent;border-style:solid;border-width:5px 5px 0;content:""}.multiselect__placeholder{color:#adadad;display:inline-block;margin-bottom:10px;padding-top:2px}.multiselect--active .multiselect__placeholder{display:none}.multiselect__content-wrapper{position:absolute;display:block;background:#fff;width:100%;max-height:240px;overflow:auto;border:1px solid #e8e8e8;border-top:none;border-bottom-left-radius:5px;border-bottom-right-radius:5px;z-index:50;-webkit-overflow-scrolling:touch}.multiselect__content{list-style:none;display:inline-block;padding:0;margin:0;min-width:100%;vertical-align:top}.multiselect--above .multiselect__content-wrapper{bottom:100%;border-bottom-left-radius:0;border-bottom-right-radius:0;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom:none;border-top:1px solid #e8e8e8}.multiselect__content::webkit-scrollbar{display:none}.multiselect__element{display:block}.multiselect__option{display:block;padding:12px;min-height:40px;line-height:16px;text-decoration:none;text-transform:none;vertical-align:middle;position:relative;cursor:pointer;white-space:nowrap}.multiselect__option:after{top:0;right:0;position:absolute;line-height:40px;padding-right:12px;padding-left:20px;font-size:13px}.multiselect__option--highlight{background:#41b883;outline:none;color:#fff}.multiselect__option--highlight:after{content:attr(data-select);background:#41b883;color:#fff}.multiselect__option--selected{background:#f3f3f3;color:#35495e;font-weight:700}.multiselect__option--selected:after{content:attr(data-selected);color:silver}.multiselect__option--selected.multiselect__option--highlight{background:#ff6a6a;color:#fff}.multiselect__option--selected.multiselect__option--highlight:after{background:#ff6a6a;content:attr(data-deselect);color:#fff}.multiselect--disabled .multiselect__current,.multiselect--disabled .multiselect__select{background:#ededed;color:#a6a6a6}.multiselect__option--disabled{background:#ededed!important;color:#a6a6a6!important;cursor:text;pointer-events:none}.multiselect__option--group{background:#ededed;color:#35495e}.multiselect__option--group.multiselect__option--highlight{background:#35495e;color:#fff}.multiselect__option--group.multiselect__option--highlight:after{background:#35495e}.multiselect__option--disabled.multiselect__option--highlight{background:#dedede}.multiselect__option--group-selected.multiselect__option--highlight{background:#ff6a6a;color:#fff}.multiselect__option--group-selected.multiselect__option--highlight:after{background:#ff6a6a;content:attr(data-deselect);color:#fff}.multiselect-enter-active,.multiselect-leave-active{transition:all .15s ease}.multiselect-enter,.multiselect-leave-active{opacity:0}.multiselect__strong{margin-bottom:8px;line-height:20px;display:inline-block;vertical-align:top}[dir=rtl] .multiselect{text-align:right}[dir=rtl] .multiselect__select{right:auto;left:1px}[dir=rtl] .multiselect__tags{padding:8px 8px 0 40px}[dir=rtl] .multiselect__content{text-align:right}[dir=rtl] .multiselect__option:after{right:auto;left:0}[dir=rtl] .multiselect__clear{right:auto;left:12px}[dir=rtl] .multiselect__spinner{right:auto;left:1px}@keyframes spinning{0%{transform:rotate(0)}to{transform:rotate(2turn)}}

.btn-circle{
  width: 30px;
  height: 30px;
}

</style>

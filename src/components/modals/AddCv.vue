
  <template>
  
    <div>
    <!-- <b-modal id="addcv" hide-footer title="Upload file"> -->
      <b-container>
        <br>
        <b-row><h2>{{title}}</h2></b-row>      
        <hr>     
      </b-container>
      
      <br>
      <div class="container">
        <b-jumbotron>
          <b-row><p class="selectFile font-weight-bold">Select File to Upload</p></b-row>
          <b-row class="justify-content-md-center" >
            
            <b-col col sm="1"><p class="file font-weight-bold">File:</p></b-col>
            <b-col col sm="3"><input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/></b-col>
          </b-row>
          <br>

          <b-row class="justify-content-md-center"> 
        <b-button id="submit" class="my-btn" variant="success" size="lg" :disabled="!canUpload" @click="submitFile()">
           <b-spinner small v-if="isLoading"></b-spinner>
          Save
        </b-button>

        <b-button id="close" class="my-btn" size="lg" @click="close">Close</b-button>
        </b-row>
        </b-jumbotron>
      </div>              
      
           
      
        <!-- <b-row class="justify-content-md-center my-1 ">
        <b-col >
          <p>Select file to upload.</p>
        </b-col>          
        </b-row>
        <b-row class="my-1">
          <b-col sm="1">
              <label>File:</label>
          </b-col>
          <b-col sm="9">
              <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
          </b-col>
        </b-row>

        
           
        <b-button id="submit" class="my-btn" :disabled="!canUpload" @click="submitFile()">
          <b-spinner small v-if="isLoading"></b-spinner>
          Save
        </b-button>
        <b-button id="close" class="my-btn" @click="close">Close</b-button> -->

      
        
    <!-- </b-modal> -->
    </div>
</template>
<script>
import {BRow, BCol, BButton, BModal, VBModalPlugin} from 'bootstrap-vue';
import axios from 'axios';

export default {
  name: 'addcv',
 /*  mode: 'production', */
  components: {
    BRow, BCol,
    BButton,
    BModal
  },
  directives: {
    VBModalPlugin
  },
  computed: { 
    canUpload() {
      return this.canUploadFile 
    }   
  },
  methods: {
    close() {
      this.$router.go(-1)
    },
    handleFileUpload() {
      if (this.$refs.file.files.length > 0)
      {
        this.canUploadFile = true;
        this.file = this.$refs.file.files[0];
      }   
      else{
        this.canUploadFile = false;
        this.file = null;
      }   
    },
    submitFile() {
      this.isLoading = true
      let formData = new FormData();
      formData.append('file', this.file);
      let fileIsLoadedInFormData = false;
      for (var pair of formData.entries()) {
        fileIsLoadedInFormData = true;
      }
      
      
      if (fileIsLoadedInFormData)
      {
        if (this.documentId > 0 || this.jobId > 0)
        {
          // axios.delete(this.pathToDeletePreviousDocument)
          // .then( (response) => {
          //   console.log(response);
            axios.post(this.pathToSaveDocument,
              formData,
              {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
              }
            ).then()
            .catch( error => {
              console.log(error)
            })
            .finally(() => this.$router.go(-1))
          // })
          // .catch(err => {
          //   console.log(err) 
          //   this.$router.go(-1)})
        }
        else{
          axios.post(this.pathToSaveDocument,
              formData,
              {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
              }
            ).then()
            .catch()
            .finally( () => this.$router.go(-1))
        }
        

        
        
      }
    }
  },
  created(){
    if (this.$route.query.candidateId){
      this.candidateId = this.$route.query.candidateId
      this.pathToSaveDocument = 'api/candidates/UploadDocument/' + this.candidateId;
      this.title = "Upload CV"
    }
    if (this.$route.query.jobId){
      this.jobId = this.$route.query.jobId
      this.pathToSaveDocument = 'api/jobs/UploadDocument/' + this.jobId;
      this.title = "Upload File"
    }
    if (this.$route.query.clientId){
      this.clientId = this.$route.query.clientId
      this.pathToSaveDocument = 'api/clients/UploadDocument/' + this.clientId;
      this.title = "Signed Terms of Business"
    }
    if (this.$route.query.documentId){
      this.documentId = this.$route.query.documentId
      this.pathToDeletePreviousDocument = 'api/SavedDocuments/' + this.documentId;
    }
  },
  data() {
    return {
      candidateId : 0,
      jobId: 0,
      clientId: 0,
      documentId: 0,
      file: '',
      canUploadFile: false,
      pathToSaveDocument: '',
      pathToDeletePreviousDocument: '',
      documents: '',
      isLoading: false,
      title: '',
    }
  }
}
</script>

<style lang="scss">
  body {
    margin: 0;
  }
  
  .file{
    font-size: 20px;
  }

  .selectFile{
    font-size: 20px;
    margin-left: 370px;
  }
</style> 
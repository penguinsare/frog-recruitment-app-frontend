<template>
<div id="app">
  <div class="container">
      <br>
      <div>
        <h1>Generate Terms of Business</h1>
      </div>              
    </div>
    <div class="container"><hr><br></div>
 

  <div class="midbody" v-if="isLoading" >
    <b-spinner class="loading" label="Spinning"></b-spinner>
    <span class="loading h2"> &nbsp; Loading...     </span>
  </div>

  <div v-else>
    <div class="container">
    <b-row class="my-3">
      <b-col sm="3">
        <label>Company Name:</label>
      </b-col> 
      <b-col sm="9" lg="6">
          <b-form-input id="input-live-feedback" type="text" disabled  v-model="companyName" ></b-form-input>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col sm="3">
        <label>Contact Person:</label>
      </b-col> 
      <b-col sm="9" lg="6">
          <b-form-input id="input-live-feedback" type="text" disabled  v-model="contactPerson" ></b-form-input>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col sm="3">
        <label>Date:</label>
      </b-col> 
      <b-col sm="9" lg="6">
          <b-form-input id="input-live-feedback" type="date"  v-model="date" :state="(date !== '')" ></b-form-input>
          <b-form-invalid-feedback id="input-live-feedback">
            Enter date!
          </b-form-invalid-feedback>
      </b-col>
    </b-row> 
    <b-row class="my-3">
      <b-col sm="3">
        <label>Credit Terms:</label>
      </b-col>
      <b-col sm="9" lg="6" >
        <b-form-select v-model="selectedCreditTerm" :options="creditTermsOptions">
        </b-form-select>
      </b-col>
    </b-row>
    <b-row class="my-2" align-v="center">
      <b-col sm="3">
        <label>Annual remuneration package:</label>
      </b-col>
      <b-col sm="9">
        <b-form-checkbox v-model="remMonthlySalaryCheckbox">Monthly salary</b-form-checkbox>
      </b-col>
    </b-row>
    <b-row class="my-3" align-h="end">
      <b-col sm="9">
        <b-form-checkbox v-model="remBonusCheckbox">Bonus</b-form-checkbox>
      </b-col>
    </b-row>
    <b-row class="my-3" align-h="end">
      
      <b-col sm="9">
        <b-form-checkbox v-model="remFixedAllowanceCheckbox">Fixed allowance</b-form-checkbox>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col sm="3">
        <label>Type of bonuses:</label>
      </b-col>
      <b-col sm="9" lg="6">
        <b-form-select v-model="selectedBonusType" :options="bonusTypeOptions"></b-form-select>   
      </b-col>
    </b-row>
    <b-row class="my-4">  
      <b-col sm="3">
        <label>Fee type:</label>
      </b-col>
      <b-col sm="3">
          <b-form-select v-model="selectedFeeTypeOption" :options="feeTypeOptions" :state="validTierFee"></b-form-select>   
          
      </b-col>
    </b-row> 
        <b-row class="my-2">    
      <b-col sm="9">
        <div class="alert alert-primary" role="alert">
            ***Any changes to the value of the table below will require prior approval from the Business Director. Kindly obtain approval before sending the TOB to the client.
            Check the boxes under Remove to remove the tier. Removing of tier does not require an approval from the Business Director.
        </div>
      </b-col>
    </b-row> 
    <b-table  class="my-2" no-border-collapse small outlined bordered stacked="md" :items="items" :fields="fields" >
      <template slot="tier" scope="item">      
        {{item.id}}       
      </template>
      <template slot="salaryRange" scope="item">   
        <b-row >    
          <b-col class="text-nowrap" sm="4">
            <b-form-input size="sm" v-model="item.item.salaryRange.from"></b-form-input>
          </b-col>
          <b-col sm="4">
            <b-form-select size="sm" v-model="item.item.salaryRange.relationship" :options="salaryRangeOptions"></b-form-select>
          </b-col>
          <b-col sm="4">
            <b-form-input size="sm" v-model="item.item.salaryRange.to" :disabled="!salaryRangeSecondFieldIsActive(item.item)"></b-form-input>
          </b-col>
        </b-row>    
      </template>    
      <template slot="chargeRate" scope="item"> 
        <b-row> 
          <b-col sm="4">  
            <b-input-group size="sm" append="%">
              <b-form-input size="sm"  v-model="item.item.chargeRate.percentage"></b-form-input>
            </b-input-group> 
          </b-col>  
          <b-col sm="1">   
            <span style="{text-align: center}">of</span>   
          </b-col>
          <b-col sm="7">   
            <b-form-select size="sm" v-model="item.item.chargeRate.onBaseOf" :options="chargeRateOptions"></b-form-select>  
          </b-col>     
        </b-row> 
      </template>
      <template slot="warranty" scope="item">  
        <b-row >    
          <b-col>    
            <b-form-select size="sm" v-model="item.item.warranty" :options="warrantyOptions"></b-form-select>  
          </b-col>        
        </b-row>     
      </template>
      <template slot="remove" scope="item">  
        <b-form-checkbox class="w-100" size="md" v-model="item.item.remove" ></b-form-checkbox>  
      </template>
    </b-table> 


    <div class="my-4 text-right">
    <b-button id="export-btn" class="my-btn" variant="success" size="lg" @click="downloadPDF" :disabled="!canGenerate">Generate TOB</b-button>
    <b-button  class="my-btn" size="lg" @click="cancel()" >Cancel</b-button>
    </div>
    <br/>
    <br/>

    <br>
    
    <img id="hiddenImage" src="../../public/image_white.png" style="display:none" >
    </div>
  </div>
</div>
</template>
<script>
import { BButton, BContainer, BRow, BCol, BTableLite, BTable} from 'bootstrap-vue'; 
import axios from 'axios';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as fs from 'fs';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, TableLayoutType, ShadingType} from 'docx';
import { saveAs } from 'file-saver';
import Multiselect from 'vue-multiselect'
import {addMyCustomFonts} from '../Prompt-Regular-normal.js'

export default {
  name: 'terms',
  components: {
    BButton,
    BContainer,
    BRow,
    BCol,
    Multiselect,
    BTableLite,
    BTable,
  },
  data() {
    return {
      clientId: 0,
      chosenRecruiter: null,
      clientsAreLoading: false,
      recruitersAreLoading: false,
      recruiters: [],
      name : "",
      contactPerson: "",
      address : "",
      date : "",
      fields: {
        id: {
          label: 'Tier'
        },
        salaryRange: {
          label: 'Salary Range (THB)'
        },
        chargeRate: {
          label: 'Charge Rate'
        },
        warranty: {
          label: 'Warranty'
        },
        remove: {
          label: 'Remove'
        }
      },
      paragraphStyle: "normal",
      standardSize: 24,
      tableFill: "dedede",
      leftTableMargin: 70,
      tobOptions: [
        {value: null, text: '--Select one--'},
        {value: 'Perm', text: 'Perm'},
        {value: 'Temp', text: 'Temp'},
        {value: 'Contract', text: 'Contract'},
      ],
      clients: [],
      creditTermsOptions: [
        {value: "null", text: '30 days'},
        {value: "45", text: '45 days'},
      ],
      otherOptions: [
        {value: null, text: '--Select one--'},
        {value: '1', text: 'option 1'},
        {value: '2', text: 'option 2'},
        {value: '3', text: 'option 3'},
      ],
      feeTypeOptions: [
        {value: "Tier Fee", text: "Tier Fee"},
        {value: "Flat Fee", text: "Flat Fee"},
      ],
      salaryRangeOptions: [
        {value: 'And Below', text: 'And Below'},
        {value: 'To', text: 'To'},
        {value: 'And Above', text: 'And Above'},
      ],
      warrantyOptions: [
        {value: 1, text: '1 Month'},
        {value: 2, text: '2 Months'},
        {value: 3, text: '3 Months'},
        {value: 4, text: '4 Months'},
        {value: 5, text: '5 Months'},
        {value: 6, text: '6 Months'},
        {value: 7, text: '7 Months'},
        {value: 8, text: '8 Months'},
      ],
      chargeRateOptions: [
        {value: 'Annual Package', text: 'Annual Package'},
        {value: 'option 2', text: 'option 2'},
        {value: 'option 3', text: 'option 3'},
      ],
      bonusTypeOptions: [
        {value: null, text: '--Select one--'},
        {value: 'fixed', text: 'fixed'},
        {value: 'variable', text: 'variable'},
      ],
      selectedCreditTerm: null,
      selectedBonusType: null,
      selectedTob: null,
      selectedOption: null,
      selectedFeeTypeOption: 0,
      remMonthlySalaryCheckbox: true,
      remBonusCheckbox: false,
      remFixedAllowanceCheckbox: false,
      chosenClient: null,
      minimumPlacementCharge: 0,
      items: [
        {
          id: 1,
          salaryRange: {
            from: 40000,
            relationship: 'And Below',
            to: 0,
          },
          chargeRate: {
            percentage: 10,
            onBaseOf: 'Annual Package',
          },
          warranty: 3, 
          remove: false,
        },
        {
          id: 2,
          salaryRange: {
            from: 40001,
            relationship: 'To',
            to: 80000,
          },
          chargeRate: {
            percentage: 12,
            onBaseOf: 'Annual Package',
          },
          warranty: 3, 
          remove: false,
        },
        {
          id: 3,
          salaryRange: {
            from: 80001,
            relationship: 'To',
            to: 120000,
          },
          chargeRate: {
            percentage: 15,
            onBaseOf: 'Annual Package',
          },
          warranty: 3, 
          remove: false,
        },
        {
          id: 4,
          salaryRange: {
            from: 120001,
            relationship: 'And Above',
            to: 0,
          },
          chargeRate: {
            percentage: 18,
            onBaseOf: 'Annual Package',
          },
          warranty: 3, 
          remove: false,
        },
      ],
    }
  },
  created(){
    if (this.$route.query.clientId){
      this.clientId = this.$route.query.clientId;     
    }    
    if (this.$route.query.contactPerson){
      this.contactPerson = this.$route.query.contactPerson;    
    }
    if (this.$route.query.companyName){
      this.companyName = this.$route.query.companyName;      
    }
    if (this.$route.query.address){
      this.address = this.$route.query.address;     
    }
  },
  computed: {
    isLoading(){
      return this.clientsAreLoading || this.recruitersAreLoading;
    },
    canGenerate(){
      return this.date && this.selectedFeeTypeOption !== 0;
    },
    validTierFee(){
      return this.selectedFeeTypeOption == 0 ? false : true;
    },
    clientIsInvalid(){
      return this.chosenClient ? true : false;
    },
    chargeRatePercentage(){
      return (this.selectedFeeTypeOption === 0 ? '' : this.items[this.selectedFeeTypeOption - 1].chargeRate.percentage);
    },
    chargeRateOnBaseOf(){
      return (this.selectedFeeTypeOption === 0 ? '' : (this.items[this.selectedFeeTypeOption - 1].chargeRate.onBaseOf === "Annual Package" ? "ANNUAL REMUNERATION PACKAGE" : ''));
    },
    validChosenRecruiter(){
      return this.chosenRecruiter == null;
    },    
  },
  methods: { 
    formatRemunerationPackage() {
      let returnString = "";
      if (this.remMonthlySalaryCheckbox === true &&
          this.remBonusCheckbox === true &&
          this.remFixedAllowanceCheckbox === true) { 
            returnString = "monthly basic salary, bonuses and other fixed allowances";
      }else if (this.remMonthlySalaryCheckbox === true &&
          this.remBonusCheckbox === true) {
            returnString = "monthly basic salary and bonuses";
      }else if (this.remMonthlySalaryCheckbox === true &&
          this.remFixedAllowanceCheckbox === true) {
            returnString = "monthly basic salary and other fixed allowances";
      }else if (this.remBonusCheckbox === true &&
          this.remFixedAllowanceCheckbox === true) {
            returnString = " bonuses and other fixed allowances";
      }else if (this.remMonthlySalaryCheckbox === true) {
            returnString = "monthly basic salary";
      }else if (
          this.remBonusCheckbox === true) {
            returnString = "bonuses";
      }else if (
          this.remFixedAllowanceCheckbox === true) {
            returnString = "fixed allowances";
      }else {
        returnString = "";
      }
      return returnString;
    },
    cancel() {
      this.$router.go(-1);
    },
    formatDate(){
      if (this.date == null)
      {
        return ' ';
      }else{
        var res = this.date.split("-");
        let day = res[2];
        let month = res[1];
        let year = res[0];
        let dateString = '';
        if (day === '01') {
          dateString += '1st ';
        }else if (day === '02') {
          dateString += '2nd ';
        }else if (day === '03') {
          dateString += '3rd ';
        }else if (day === '04') {
          dateString += '4th ';
        }else if (day === '05') {
          dateString += '5th ';
        }else if (day === '06') {
          dateString += '6th ';
        }else if (day === '07') {
          dateString += '7th ';
        }else if (day === '08') {
          dateString += '8th ';
        }else if (day === '09') {
          dateString += '9th ';
        }else {
          dateString += day + 'th ';
        }      
        
        if (month === '01') {
          dateString += 'January ';
        }else if (month === '02') {
          dateString += 'February ';
        }else if (month === '03') {
          dateString += 'March ';
        }else if (month === '04') {
          dateString += 'April ';
        }else if (month === '05') {
          dateString += 'May ';
        }else if (month === '06') {
          dateString += 'June ';
        }else if (month === '07') {
          dateString += 'July ';
        }else if (month === '08') {
          dateString += 'August ';
        }else if (month === '09') {
          dateString += 'September ';
        }else if (month === '10') {
          dateString += 'October ';
        }else if (month === '11') {
          dateString += 'November ';
        }else if (month === '12') {
          dateString += 'December ';
        }else {
          dateString += '';
        }
        dateString += year;
        return dateString;
      }       
    },  
    salaryRangeSecondFieldIsActive(item) {
      return (item.salaryRange.relationship === 'And Below' || item.salaryRange.relationship === 'And Above') ? false : true;
    },
    setTobType(){
      if (this.selectedTob){
        if (this.selectedTob === 'Perm') {
          return 'Permanent Staff Placement';
        }else if (this.selectedTob === 'Temp') {
          return 'Temporary Staff Placement';
        }else if (this.selectedTob === 'Contract') {
          return 'Contract Based Staff Placement';
        }
      }else{
        return '';
      }      
    },
    setHeader(doc) {
      let img = document.getElementById("hiddenImage");
      doc.addImage(img, 'PNG', 20, 15, 18, 18);
      doc.setTextColor('#9CC925');
      doc.setFontSize(9);
      doc.setFontStyle('normal');
      
      doc.text("Company 1,Ltd.", 37, 24);
      doc.setFont("Prompt-Regular",'normal');
       doc.setFontSize(7);
     
      doc.setFont('times');
      doc.setTextColor(0);
      doc.setFontSize(9);
      doc.setFontStyle('normal');
      let headerY = 15;
      
      let lineHeight = 3.9;
      doc.text("Company 1., Ltd", 190, headerY, {align: "right"});
      
      doc.text("8 Rue des Bonnes Gens,", 190, headerY + lineHeight, {align: "right"});
      doc.text("France, 67000 Strassbourg,", 190, headerY + 2 * lineHeight, {align: "right"});          
    },
    downloadPDF() {
     
      let pdfName = 'terms_of_business'; 
      let lineOptions = {maxWidth: 170, align: 'justify'}
      var doc = new jsPDF('p', 'mm', 'a4');
      addMyCustomFonts(doc);

     
      doc.setPage(1);
      doc.setLineHeightFactor(1.22);
      doc.setFontSize(12);
      doc.setFont("times");
      let yPos = 60;
      let lineHeight = 3.9;
      this.setHeader(doc);

      
      doc.setFontSize(12);
      doc.setFontStyle('bold');
      doc.text("TERMS OF BUSINESS - PERMANENT STAFF PLACEMENT",105,50,{align: "center"});
      doc.setFontSize(9);
      doc.setFontStyle('normal');
      let firstParagraph = "<div style=\"font-size:9pt\">This Agreement dated <span style=\"color: red\">" + this.formatDate() + "</span>, is made between <b>Company 1, Ltd</b> " 
      + "(\"Company 1\"), Company registration number 05512235, having its address at 8 Rue des Bonnes Gens,  " 
      + "67000 Strassbourg, France and <span style=\"color: red\"><b>" + this.companyName + "</span></b> (\"the " 
      + "Client\"), having its address in <span style=\"color: red\">" + this.address + "</span>.</div>";

      doc.fromHTML(firstParagraph,20,yPos - 7,{width: 170});
      
      yPos = this.getNextYPos(yPos, firstParagraph, doc);
      let text = "The Terms and Conditions of our services for Permanent Employee Placements are as follows:";
      doc.text(text,20,yPos,lineOptions);

      yPos += lineHeight;
      
      doc.setFontStyle('bold');
      yPos = this.getNextYPos(yPos, text, doc)   ; 
      text = "1. PLACEMENT FEE";
      doc.text(text,20,yPos,lineOptions);
      doc.setFontStyle('normal');

      yPos += lineHeight;
      
      var secondTable = [
        ["FEE CHARGED", "GUARANTEE PERIOD"],
        ["20% OF ANNUAL REMUNERATION PACKAGE", "3 MONTHS"],
      ];
     
      var tierFeeTable = [
        ["Salary Range(EUR)","FEE CHARGED", "GUARANTEE PERIOD"],
      ];
      this.items.forEach(i => {
        if (i.remove === false) {
          if (i.salaryRange.relationship === "And Below"){
            tierFeeTable.push([i.salaryRange.from + " below", i.chargeRate.percentage + "%", i.warranty == 1 ? i.warranty + " Month" : i.warranty + " Months"]);
          }else if (i.salaryRange.relationship === "And Above") {
            tierFeeTable.push([i.salaryRange.from + " above", i.chargeRate.percentage + "%", i.warranty == 1 ? i.warranty + " Month" : i.warranty + " Months"]);
          }else if (i.salaryRange.relationship === "To") {
             tierFeeTable.push([i.salaryRange.from + " to " + i.salaryRange.to, i.chargeRate.percentage + "%", i.warranty == 1 ? i.warranty + " Month" : i.warranty + " Months"]);
          }else {
             tierFeeTable.push(["invalid data", i.chargeRate.percentage + "%", i.warranty == 1 ? i.warranty + " Month" : i.warranty + " Months"]);
          }          
        }
      })

      if(this.selectedFeeTypeOption === "Tier Fee"){
        doc.autoTable({
          body: tierFeeTable,
          theme: 'grid',
          tableWidth: 170,
          margin: {top: 0, right: 20, bottom: 0, left: 20},
          bodyStyles: {
            font: 'times',
            cellPadding: 0.5,
            textColor: 0,
            lineColor: 0,
            lineWidth: 0.5
          },
          styles: {halign: 'center', fontStyle: 'bold'},
          startY: yPos
        });
      }else {
        doc.autoTable({
          body: secondTable,
          theme: 'grid',
          tableWidth: 170,
          margin: {top: 0, right: 20, bottom: 0, left: 20},
          bodyStyles: {
            font: 'times',
            cellPadding: 0.5,
            textColor: 0,
            lineColor: 0,
            lineWidth: 0.5
          },
          styles: {halign: 'center', fontStyle: 'bold'},
          startY: yPos
        });
      }
      yPos = doc.autoTable.previous.finalY;
      yPos = this.getNextYPos(yPos, text, doc);
      text = "* From commencement of employment, regardless of if and when the letter of employment is signed.";
      doc.text(text,20,yPos,lineOptions);

      yPos = this.getNextYPos(yPos, text, doc);
      text = "* The fee include advertising, screening of candidates, candidates’ evaluation, placement and guarantee.";
      doc.text(text,20,yPos,lineOptions);


      yPos = this.getNextYPos(yPos, text, doc);
      text = "* The annual remuneration package will be inclusive of " + this.formatRemunerationPackage() + ".";
      doc.text(text,20,yPos,lineOptions);

      yPos += lineHeight;

      yPos = this.getNextYPos(yPos, text, doc);
      text =  "1.1 The following shall be contractual conditions that the client agrees to abide accordingly. It will be of the terms that Company 1 " +
              " and its clients have agreed to enter into with regards to the employment of a staff introduced " +
              "to the client by Company 1.";
      doc.text(text,20,yPos,lineOptions);

      yPos = this.getNextYPos(yPos, text, doc);
      text =  "1.2 The recruitment of placement fee as specified in the confirmation of order shall apply. This is due and payable to Company 1 " +
              "upon successful commencement of work by the selected candidates referred, irrespective of " +
              "whether any letter of employment or letter of offer has been signed by the Employee."; 
      doc.text(text,20,yPos,lineOptions);

      yPos = this.getNextYPos(yPos, text, doc);
      text =  "1.3 By expressly allowing for an interview to be conducted or by the commencement of employment of the permanent staff " +
              "introduced by Company 1, would constitute the client’s acceptance of all the terms and conditions " +
              "set forth in this agreement";
      doc.text(text,20,yPos,lineOptions);

      yPos += lineHeight;

      doc.setFontStyle('bold');
      yPos = this.getNextYPos(yPos, text, doc);
      text =  "2. PAYMENT TERMS";              
      doc.text(text,20,yPos,lineOptions);
      doc.setFontStyle('normal');      

      yPos = this.getNextYPos(yPos, text, doc);
      text =  "2.1 All invoices issued to client has to be settled fully within <span style=\"color: red\">" + (this.selectedCreditTerm == null ? "thirty (30) days" : "forty-five (45) days") + "</span> from the invoice date. ";          
      doc.text(text,20,yPos,lineOptions);

      yPos += lineHeight;

      doc.setFontStyle('bold');
      yPos = this.getNextYPos(yPos, text, doc);
      text =  "3. DEFERRED HIRING";     
      doc.text(text,20,yPos,lineOptions);
      doc.setFontStyle('normal');
      
      yPos = this.getNextYPos(yPos, text, doc);
      text =  "3.1 If a recommended candidate from Company 1 is employed and/or commences work for the " +
              "client within twelve (12) months from the referral date, the placement fee shall be payable in accordance with Clause 1 above.";           
      doc.text(text,20,yPos,lineOptions);

      yPos += lineHeight;

      doc.setFontStyle('bold');
      yPos = this.getNextYPos(yPos, text, doc);
      text =  "4. LIABILITIES AND INDEMNITIES";          
      doc.text(text,20,yPos,lineOptions);
      doc.setFontStyle('normal');

      yPos = this.getNextYPos(yPos, text, doc);
      text =  "4.1 Company 1 shall not be liable for any acts, errors or omission, injury, delay or consequential " +
              "loss arising directly or indirectly by the permanent staff introduced to the clients and do not have any liability for any loss or damage " +
              "suffered by the client whatsoever.";          
      doc.text(text,20,yPos,lineOptions);   
      
      yPos += lineHeight;

      doc.setFontStyle('bold');
      yPos = this.getNextYPos(yPos, text, doc);
      text =  "5. VALIDITY";          
      doc.text(text,20,yPos,lineOptions);
      doc.setFontStyle('normal');

      yPos = this.getNextYPos(yPos, text, doc);
      text =  "5.1 The above terms are subjected or review every 12 months from this date. We reserve the right at any time and from time to " +
              "time to modify or discontinue, temporarily or permanently, the terms and conditions (or any part thereof) with or without notice, " +
              "for any reason whatsoever, whether generally or limited to you only.";         
      doc.text(text,20,yPos,lineOptions);

      yPos = this.getNextYPos(yPos, text, doc);
      doc.setDrawColor(0);
      doc.line(20, yPos, 190, yPos);

      yPos += lineHeight;
      yPos += lineHeight;
      text =  "In agreement with the above terms and conditions, please email this response to";         
      doc.text(text,105,yPos,{align: "center"});

      yPos += lineHeight;
      text =  "Company 1, duly signed and stamped.";         
      doc.text(text,105,yPos,{align: "center"});

      yPos += lineHeight;

      doc.autoTable({
        body: [
          ["Company stamp", "Signature:"],
        ],
        theme: 'grid',
        tableWidth: 170,
        margin: {top: 0, right: 20, bottom: 0, left: 20},
        bodyStyles: {
          font: 'times',
          cellPadding: 0.5,
          cellWidth: 85,
          textColor: 0,
          lineColor: 0,
          lineWidth: 0.5,
          minCellHeight: 37,
          halign: 'left',
          valign: 'top',
        },
        styles: {halign: 'center', fontStyle: 'normal'},
        startY: yPos,
        didDrawCell: function (data) {
          if (data.cell.raw === "Signature:") {
            doc.autoTable({
              body: [
                ["Name:"],
                ["Designation:"],
                ["Date:"],
              ],
              startY: data.cell.y + 21.7,
              margin: {right: 20,left: data.cell.x },
              bodyStyles: {
                font: 'times',
                cellPadding: 0.5,
                textColor: 0,
                lineColor: 0,
                lineWidth: 0.5,
                halign: 'left',
                minCellHeight: 5,
              },
              tableWidth: 'auto',
              theme: 'grid',
              styles: {
                cellPadding: 1,
              }
            });
          }
        }
      });
      doc.save(pdfName + '.pdf');
    },
    getNextYPos(currentYPos, text, doc){
      let lineHeight = 3.9;
      let splittedText = doc.splitTextToSize(text, 170);
      let blockHeight = (splittedText.length) * lineHeight;
      currentYPos += blockHeight ;
      if (currentYPos > 250) {
        doc.addPage();
        this.setHeader(doc);
        currentYPos = 70;
      }
      return currentYPos;
    }
  }
}
</script>

<style>
  fieldset[disabled] .multiselect{pointer-events:none}.multiselect__spinner{position:absolute;right:1px;top:1px;width:48px;height:35px;background:#fff;display:block}.multiselect__spinner:after,.multiselect__spinner:before{position:absolute;content:"";top:50%;left:50%;margin:-8px 0 0 -8px;width:16px;height:16px;border-radius:100%;border:2px solid transparent;border-top-color:#41b883;box-shadow:0 0 0 1px transparent}.multiselect__spinner:before{animation:spinning 2.4s cubic-bezier(.41,.26,.2,.62);animation-iteration-count:infinite}.multiselect__spinner:after{animation:spinning 2.4s cubic-bezier(.51,.09,.21,.8);animation-iteration-count:infinite}.multiselect__loading-enter-active,.multiselect__loading-leave-active{transition:opacity .4s ease-in-out;opacity:1}.multiselect__loading-enter,.multiselect__loading-leave-active{opacity:0}.multiselect,.multiselect__input,.multiselect__single{font-family:inherit;font-size:16px;-ms-touch-action:manipulation;touch-action:manipulation}.multiselect{box-sizing:content-box;display:block;position:relative;width:100%;min-height:40px;text-align:left;color:#35495e}.multiselect *{box-sizing:border-box}.multiselect:focus{outline:none}.multiselect--disabled{background:#ededed;pointer-events:none;opacity:.6}.multiselect--active{z-index:50}.multiselect--active:not(.multiselect--above) .multiselect__current,.multiselect--active:not(.multiselect--above) .multiselect__input,.multiselect--active:not(.multiselect--above) .multiselect__tags{border-bottom-left-radius:0;border-bottom-right-radius:0}.multiselect--active .multiselect__select{transform:rotate(180deg)}.multiselect--above.multiselect--active .multiselect__current,.multiselect--above.multiselect--active .multiselect__input,.multiselect--above.multiselect--active .multiselect__tags{border-top-left-radius:0;border-top-right-radius:0}.multiselect__input,.multiselect__single{position:relative;display:inline-block;min-height:20px;line-height:20px;border:none;border-radius:5px;background:#fff;padding:0 0 0 5px;width:100%;transition:border .1s ease;box-sizing:border-box;margin-bottom:8px;vertical-align:top}.multiselect__input:-ms-input-placeholder{color:#35495e}.multiselect__input::placeholder{color:#35495e}.multiselect__tag~.multiselect__input,.multiselect__tag~.multiselect__single{width:auto}.multiselect__input:hover,.multiselect__single:hover{border-color:#cfcfcf}.multiselect__input:focus,.multiselect__single:focus{border-color:#a8a8a8;outline:none}.multiselect__single{padding-left:5px;margin-bottom:8px}.multiselect__tags-wrap{display:inline}.multiselect__tags{min-height:40px;display:block;padding:8px 40px 0 8px;border-radius:5px;border:1px solid #e8e8e8;background:#fff;font-size:14px}.multiselect__tag{position:relative;display:inline-block;padding:4px 26px 4px 10px;border-radius:5px;margin-right:10px;color:#fff;line-height:1;background:#41b883;margin-bottom:5px;white-space:nowrap;overflow:hidden;max-width:100%;text-overflow:ellipsis}.multiselect__tag-icon{cursor:pointer;margin-left:7px;position:absolute;right:0;top:0;bottom:0;font-weight:700;font-style:normal;width:22px;text-align:center;line-height:22px;transition:all .2s ease;border-radius:5px}.multiselect__tag-icon:after{content:"\D7";color:#266d4d;font-size:14px}.multiselect__tag-icon:focus,.multiselect__tag-icon:hover{background:#369a6e}.multiselect__tag-icon:focus:after,.multiselect__tag-icon:hover:after{color:#fff}.multiselect__current{min-height:40px;overflow:hidden;padding:8px 30px 0 12px;white-space:nowrap;border-radius:5px;border:1px solid #e8e8e8}.multiselect__current,.multiselect__select{line-height:16px;box-sizing:border-box;display:block;margin:0;text-decoration:none;cursor:pointer}.multiselect__select{position:absolute;width:40px;height:38px;right:1px;top:1px;padding:4px 8px;text-align:center;transition:transform .2s ease}.multiselect__select:before{position:relative;right:0;top:65%;color:#999;margin-top:4px;border-color:#999 transparent transparent;border-style:solid;border-width:5px 5px 0;content:""}.multiselect__placeholder{color:#adadad;display:inline-block;margin-bottom:10px;padding-top:2px}.multiselect--active .multiselect__placeholder{display:none}.multiselect__content-wrapper{position:absolute;display:block;background:#fff;width:100%;max-height:240px;overflow:auto;border:1px solid #e8e8e8;border-top:none;border-bottom-left-radius:5px;border-bottom-right-radius:5px;z-index:50;-webkit-overflow-scrolling:touch}.multiselect__content{list-style:none;display:inline-block;padding:0;margin:0;min-width:100%;vertical-align:top}.multiselect--above .multiselect__content-wrapper{bottom:100%;border-bottom-left-radius:0;border-bottom-right-radius:0;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom:none;border-top:1px solid #e8e8e8}.multiselect__content::webkit-scrollbar{display:none}.multiselect__element{display:block}.multiselect__option{display:block;padding:12px;min-height:40px;line-height:16px;text-decoration:none;text-transform:none;vertical-align:middle;position:relative;cursor:pointer;white-space:nowrap}.multiselect__option:after{top:0;right:0;position:absolute;line-height:40px;padding-right:12px;padding-left:20px;font-size:13px}.multiselect__option--highlight{background:#41b883;outline:none;color:#fff}.multiselect__option--highlight:after{content:attr(data-select);background:#41b883;color:#fff}.multiselect__option--selected{background:#f3f3f3;color:#35495e;font-weight:700}.multiselect__option--selected:after{content:attr(data-selected);color:silver}.multiselect__option--selected.multiselect__option--highlight{background:#ff6a6a;color:#fff}.multiselect__option--selected.multiselect__option--highlight:after{background:#ff6a6a;content:attr(data-deselect);color:#fff}.multiselect--disabled .multiselect__current,.multiselect--disabled .multiselect__select{background:#ededed;color:#a6a6a6}.multiselect__option--disabled{background:#ededed!important;color:#a6a6a6!important;cursor:text;pointer-events:none}.multiselect__option--group{background:#ededed;color:#35495e}.multiselect__option--group.multiselect__option--highlight{background:#35495e;color:#fff}.multiselect__option--group.multiselect__option--highlight:after{background:#35495e}.multiselect__option--disabled.multiselect__option--highlight{background:#dedede}.multiselect__option--group-selected.multiselect__option--highlight{background:#ff6a6a;color:#fff}.multiselect__option--group-selected.multiselect__option--highlight:after{background:#ff6a6a;content:attr(data-deselect);color:#fff}.multiselect-enter-active,.multiselect-leave-active{transition:all .15s ease}.multiselect-enter,.multiselect-leave-active{opacity:0}.multiselect__strong{margin-bottom:8px;line-height:20px;display:inline-block;vertical-align:top}[dir=rtl] .multiselect{text-align:right}[dir=rtl] .multiselect__select{right:auto;left:1px}[dir=rtl] .multiselect__tags{padding:8px 8px 0 40px}[dir=rtl] .multiselect__content{text-align:right}[dir=rtl] .multiselect__option:after{right:auto;left:0}[dir=rtl] .multiselect__clear{right:auto;left:12px}[dir=rtl] .multiselect__spinner{right:auto;left:1px}@keyframes spinning{0%{transform:rotate(0)}to{transform:rotate(2turn)}}
</style> 
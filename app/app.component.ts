
import { Validators, FormGroup, FormBuilder, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';

import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
   spinnerEnabled = false;
   sumhandleTimeFormat='';
  keys: string[];
  public data: any;
  public dataByDate: any;
  public listDate=[];
   public listSkills=[];
   SumHundle:number =0;
   Sumcallsonhold=0;
   SumholdTime=0;
  AverageAHT=0;
  AverageHoldTim=0;
   

   sumhandleTime=0;
  dataSheet = new Subject();
  @ViewChild('inputFile') inputFile: ElementRef;
  isExcelFile: boolean;
  name = 'Angular 5';
  inputValue;
  form: FormGroup;
  form2: FormGroup;

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      formInput1: ['', Validators.compose([Validators.required, this.currencyValidator()])],
      formInput2: ['', Validators.required]
    })

    this.form2 = this.formBuilder.group({
      multiSelect: ['', Validators.required],
      formInput2: ['', Validators.required],
      formInput3: ['', Validators.required],
    })

   // this.onChanges();
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(value => {
      console.log('form input value', value);
    });

    this.form2.valueChanges.subscribe( value => {
      console.log(value);
    })
  }

  onSubmit() {
    console.log(this.form.value);
  }

  onSubmit2() {
    console.log(this.form2.value);
     this.onParseFile();
  }

  currencyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return { 'validCurrency': { value: 'no value' } };
      }
      let inputValue = control.value.toString();
      inputValue = inputValue.replace(/[$,]/g, '');
      inputValue = parseFloat(inputValue);
      return isNaN(inputValue) ? { 'validCurrency': { value: control.value } } : null;
    };
  }


    removeData() {
   this.data=[];
  }

  onParseFile(){

    
    this.AverageAHT=0;
  this.AverageHoldTim=0;
    this.Sumcallsonhold=0;
     this.sumhandleTimeFormat='';
   this.SumHundle=0;
   this.SumholdTime=0;
   this.sumhandleTime=0;
   this.dataByDate=[];
     this.data.forEach(element=>{

       
            if(element.Date== this.form2.value.formInput2 )
            { 
             
          // 
          
              this.dataByDate.push(element) }
          }
          );
console.log(this.dataByDate);
this.dataByDate.forEach(element=>{
  let str:string=element['Skill Group Name'];
 
  for (var i = 0; i < this.form2.value.multiSelect.length; i++) {
 if( str.toLowerCase().indexOf(this.form2.value.multiSelect[i] ) !== -1 ){
 this.SumholdTime += Number(element['holdTime']);
              this.SumHundle += Number(element['Handled Calls']);
              this.sumhandleTime+= this.timestrToSec(element['handleTime']);
               this.Sumcallsonhold+= Number((element['callsonhold']));
  }
}
/*  
 if(this.form2.value.formInput3 =='mec'){
if( str.toLowerCase().indexOf(this.form2.value.formInput3 ) !== -1 || str.toLowerCase().indexOf('mbt') !== -1 ){
 this.SumholdTime += Number(element['holdTime']);
              this.SumHundle += Number(element['Handled Calls']);
              this.sumhandleTime+= this.timestrToSec(element['handleTime']);
               this.Sumcallsonhold+= Number((element['callsonhold']));
  }

 }
 else {
if( str.toLowerCase().indexOf(this.form2.value.formInput3 ) !== -1 ){
 this.SumholdTime += Number(element['holdTime']);
              this.SumHundle += Number(element['Handled Calls']);
              this.sumhandleTime+= this.timestrToSec(element['handleTime']);
               this.Sumcallsonhold+= Number((element['callsonhold']));
  }
   
 } */

  


});

          console.log('Sum Handled Calls  = '+this.SumHundle);
          console.log('Sum hold Time  = '+this.SumholdTime);
          console.log('Sum Handled Time  = '+this.formatTime(this.sumhandleTime) );
          
          
        this.sumhandleTimeFormat=this.formatTime(this.sumhandleTime);
 console.log('this.sumhandleTime  = '+this.sumhandleTime);
         this.AverageAHT=(this.sumhandleTime/86400)*86400/this.SumHundle;
         this.AverageHoldTim=this.SumholdTime/this.Sumcallsonhold;
  }
 onFileChange(ev) {
   this.listSkills=[];
    this.listDate=[];
   this.sumhandleTimeFormat='';
   this.SumHundle=0;
   this.SumholdTime=0;
   this.Sumcallsonhold=0;
   this.sumhandleTime=0;
   this.dataByDate=[];
    this.data=[];
        let workBook = null;
        let jsonData = null;
        const reader = new FileReader();
        const file = ev.target.files[0];
        reader.onload = (event) => {
          const data = reader.result;
          
          workBook = XLSX.read(data, { type: 'binary',cellDates: true });
          jsonData = workBook.SheetNames.reduce((initial, name) => {
            const sheet = workBook.Sheets[name];
            initial[name] = XLSX.utils.sheet_to_json(sheet);
            
            return initial;
          }, {}); 
        
          const dataString = JSON.stringify(jsonData);
          //document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
          this.data = jsonData.Sheet1;
        this.data.forEach(element=>{
          if(element['Skill Group Name']){
let skill:string=element['Skill Group Name'].toLowerCase().slice(0, 4);
              element['Call Type Name']=null;
            if(this.listDate.includes(element.Date)==false){
               this.listDate.push(element.Date);
            }
            if(this.listSkills.includes(skill)==false){
               this.listSkills.push(skill);
            }

          }
             
           });
        

        } 
        reader.readAsBinaryString(file);
      }

 timestrToSec(timestr) {
  var parts = timestr.split(":");
  return (parts[0] * 3600) +
         (parts[1] * 60) +
         (+parts[2]);
}

 pad(num) {
  if(num < 10) {
    return "0" + num;
  } else {
    return "" + num;
  }
}

 formatTime(seconds) {
  return [this.pad(Math.floor(seconds/3600)),
          this.pad(Math.floor(seconds/60)%60),
          this.pad(seconds%60),
          ].join(":");
}


timeStringToFloat(time) {
  var hoursMinutes = time.split(/[.:]/);
  var hours = parseInt(hoursMinutes[0], 10);
  var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1]) : 0;
  return hours + minutes / 60;
}
}

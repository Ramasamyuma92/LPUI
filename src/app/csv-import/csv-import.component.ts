import {Component, OnInit} from '@angular/core';
import {ViewChild} from '@angular/core';
import {CsvImportService} from '../service/csv-import.service';
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";
import {HttpErrorResponse} from "@angular/common/http";


@Component({
    selector: 'app-csv-import',
    templateUrl: './csv-import.component.html',
    styleUrls: ['./csv-import.component.css']
})
export class CsvImportComponent implements OnInit {

    title = 'app';
    public csvRecords: any[] = [];
    headers: any;
    headerListToDisplay: any;
    successMessageSaved: any = false;
    errorExists: any = false;
    p: number = 1;
    importResponse: any = "";
    fileName: any = "";
    fileValidation: boolean =true;
    errorMessage: string;
    public failureList: any[] = [];
    tabDisplay:any = true;
    isDisabledFile:boolean = true;
    fileNameVal = "";
    showloader : boolean = false;
    runTimeError='';


    @ViewChild('fileImportInput') fileImportInput: any;

    constructor(private CsvImportService: CsvImportService,private spinnerService : Ng4LoadingSpinnerService) {
    }

    ngOnInit() {
    }

    selectedIndex: number = 0;
    selectedTab: number = 1;

    clickMe() {
        if(this.selectedTab == 1){
            if(typeof (this.fileName) == 'undefined'){
                this.errorMessage = "Please upload a file to proceed";
                this.fileValidation = false;
            }else{
                this.fileValidation = true;
            }
        }
        if(this.fileValidation){
            if (this.selectedTab == 1){
                this.selectedTab = 2;
                this.errorExists = false;
            }
            else
                this.selectedTab = this.selectedTab + 1;
        }
    }

    selectTab(e){
        this.selectedTab = e.target.id
    }

    selectedIndexChange(val) {
        if(val>0 && typeof (this.fileName) == 'undefined'){
            this.tabDisplay = true;
        }
        else{
          this.tabDisplay = false;
          this.selectedIndex = val;
        }
    }

    fileChangeListener($event: any): void {
        this.importResponse ="";
        this.failureList = [];
        this.tabDisplay = false;
        this.successMessageSaved = false;
        this.errorExists = false;
        this.fileValidation = true;
        var text = [];
        var files = $event.srcElement.files;
        this.fileNameVal = files[0].name
        
        if (this.isCSVFile(files[0])) {
            this.isDisabledFile = false;
            var input = $event.target;
            var reader = new FileReader();
            reader.readAsText(input.files[0]);

            reader.onload = (data) => {
                let csvData = reader.result;
                let csvRecordsArray = csvData.split(/\r\n(?=(?:(?:[^"]*"){2})*[^"]*$)|\n(?=(?:(?:[^"]*"){2})*[^"]*$)/);

                let headersRow = this.getHeaderArray(csvRecordsArray);
                let headersRowDisplay = this.getHeaderArrayDisplay(csvRecordsArray);
                this.headers = headersRow;
                this.headerListToDisplay = headersRowDisplay;

                this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length, headersRow);
            }

            reader.onerror = function () {
                alert('Unable to read ' + input.files[0]);
            };

        } else {
            this.fileValidation = false;
            this.errorMessage = "Please upload a valid CSV file";
            this.fileReset();
        }
    }

    getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any, headersRow: any) {
        var dataArr = []


        for (let i = 1; i < csvRecordsArray.length; i++) {
            if(csvRecordsArray[i] == "") continue;

            let data = csvRecordsArray[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

            // FOR EACH ROW IN CSV FILE IF THE NUMBER OF COLUMNS
            // ARE SAME AS NUMBER OF HEADER COLUMNS THEN PARSE THE DATA
            var csvRecord: any = {};

            for (let j = 0; j < headerLength; j++) {
                if (typeof data[j] !== 'undefined')
                    csvRecord[headersRow[j]] = data[j].replace(/^"(.*)"$/, '$1').trim();
                else
                    csvRecord[headersRow[j]] = "";
            }

            dataArr.push(csvRecord);
        }
        return dataArr;
    }

    // CHECK IF FILE IS A VALID CSV FILE
    isCSVFile(file: any) {
        return file.name.endsWith(".csv");
    }

    // GET CSV FILE HEADER COLUMNS
    getHeaderArray(csvRecordsArr: any) {
        let headers = csvRecordsArr[0].split(',');
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j].replace(/^"(.*)"$/, '$1'));
        }
        return headerArray;
    }

    getHeaderArrayDisplay(csvRecordsArr: any) {
        let headers = csvRecordsArr[0].split(',');
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j].replace(/^"(.*)"$/, '$1').replace(/_/g, ' '));
        }
        return headerArray;
    }

    fileReset() {
        try {
        this.fileImportInput.nativeElement.value = "";
        this.csvRecords = [];
        this.isDisabledFile = false;
        }
        catch {

        }
    }

    csvUpload() {
        this.showloader= true;
        this.CsvImportService.importClientCSV(JSON.stringify(this.csvRecords), this.headers).subscribe(data => {
            if(data.data!=null){
            this.importResponse = data.data.importStatus;
            //recipientList
            //clientList
            this.fileReset();
            if (this.importResponse.status == "Success") {
                //this.spinnerService.hide();
                this.showloader = false;
                this.successMessageSaved = true;
                this.errorExists = false;
                this.fileName = '';
                this.fileNameVal = '';
                this.csvRecords = [];
                this.headerListToDisplay = [];
                this.isDisabledFile = true;

            }
            if (this.importResponse.status == "failed") {

                //this.spinnerService.hide();
                this.showloader = false;
                if(typeof this.headers.find(x => x=="branding_image_url") !== 'undefined')
                        this.failureList = data.data.clientList;
                else if(typeof this.headers.find(x => x=="recipient_state") !== 'undefined')
                        this.failureList = data.data.recipientList;
                else if(typeof this.headers.find(x => x=="item_image") !== 'undefined')
                        this.failureList = data.data.itemList;
                else if(typeof this.headers.find(x => x=="order_id") !== 'undefined')
                        this.failureList = data.data.orderList;

                this.errorExists = true;
                this.successMessageSaved = false;
            }
            if(this.importResponse==null && data.data.errorMessage!=null){
              this.runTimeError = data.data.errorMessage;
            }
            }
            else{
            this.errorExists = true;
            this.showloader= false;
            }
            if(this.importResponse==null && data.data.errorMessage!=null){
              this.runTimeError = data.data.errorMessage;
            }
        },(err : HttpErrorResponse)=>{
            this.errorExists = true;
            this.showloader= false;
        });
        if (this.successMessageSaved == true) {
            this.successMessageSaved = false;
        }
        if (this.errorExists == true) {
            this.errorExists = false;
        }
        
    }

    closeMessage(){
        this.successMessageSaved = false;
        this.fileValidation = true;
        this.errorExists = false;
    }

}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {RecipientService} from '../../service/recipient.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';


@Component({
    selector: 'app-rec-index',
    templateUrl: './rec-index.component.html',
    styleUrls: ['./rec-index.component.css']
})
export class RecIndexComponent implements OnInit {

    recipients= [];
    organizationId: any;
    p: number = 1;
    deleteConfirm = -1;
    isPrimary:boolean = false;

    constructor(private route: ActivatedRoute, private RecipientService: RecipientService, private spinnerService: Ng4LoadingSpinnerService) {
        this.route.params.subscribe(params => {
            this.organizationId = params.id;
            this.RecipientService.recipientList(params.id).subscribe(data => {
                this.recipients = data.data;
                this.spinnerService.hide();
            });
        });
    }

    ngOnInit() {
        this.reloadRecipient();
        this.spinnerService.show();

    }

    // Declare local variable
    direction: number = 0;
    isDesc:boolean = false;
    column = "";
    // Change sort function to this: 
    sort(property){
        this.isDesc = !this.isDesc; //change the direction    
        this.column = property;
        this.direction = this.isDesc ? 1 : -1;
    }

    reloadRecipient(){
        this.route.params.subscribe(params => {
            this.organizationId = params.id;
            this.RecipientService.recipientList(params.id).subscribe(data => {
                this.recipients = data.data;
                this.spinnerService.hide();
            });
        });
    }

    deletePopup(index){
        this.deleteConfirm = index
        this.isPrimary = false
    }
    closeMessage(){
        this.deleteConfirm = -1
    }
    deleteRecipient(index,clientId,recipientId){
        this.isPrimary = false
        this.RecipientService.deleteRecipient(clientId,recipientId).subscribe(data => {
            if (data.data.status == 'Primary Recipient cannot be Deleted') {
                this.isPrimary = true
            }
            else {   
                this.deleteConfirm =-1
                this.isPrimary = false
                this.reloadRecipient();
            }
        },
        (err : HttpErrorResponse)=>{
            console.log("Failed Deletion")
        });    
    }

}

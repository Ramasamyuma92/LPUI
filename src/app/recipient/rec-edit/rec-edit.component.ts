import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RecipientService} from '../../service/recipient.service';
import {OrganisationService} from '../../service/organisation.service';
import {DatePipe} from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
    selector: 'app-rec-edit',
    templateUrl: './rec-edit.component.html',
    styleUrls: ['./rec-edit.component.css']
})
export class RecEditComponent implements OnInit {

    recForm: FormGroup;
    post: any;                     // A property for our submitted form
    titleAlert: string = 'This field is required';
    recipientDetails: any;
    clients: any;
    successMessageSaved: any = false;
    dateOfBirthFormatted: any;
    dateOfJoiningFormatted: any;

    recipientId: number;
    clientId: number;
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    state: string;
    zip: string;
    email: string;
    address2: string;
    phone1: string;
    phone2: string;
    dateOfBirth: null;
    dateOfJoining: null;
    status: number;
    country: string;
    errorExists:boolean = false;
    errorMessage:string;

    today:Date = new Date();
    maxDate:Date = new Date();

    constructor(private fb: FormBuilder, private RecipientService: RecipientService, private OrganisationService: OrganisationService, private route: ActivatedRoute,private router: Router, private datePipe: DatePipe,private spinnerService: Ng4LoadingSpinnerService) {
        this.spinnerService.show();
        this.maxDate=new Date(this.maxDate.setFullYear(this.today.getFullYear()- 13))
        this.route.params.subscribe(params => {
            this.RecipientService.getRecipient(params.id).subscribe(data => {
                this.setFormData(data);
                this.spinnerService.hide();
            });
        });
        this.resetForm();
    }

    resetForm(){
        this.recForm = this.fb.group({
            'recipientId': 0,
            'clientId': 0,
            'firstName': ['', Validators.required],
            'address1': ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
            'address2': '',
            'city': ['', Validators.required],
            'state': ['', Validators.required],
            'zip': ['', Validators.required],
            'email': '',
            'lastName': ['', Validators.required],
            'phone1': '',
            'phone2': '',
            'dateOfBirth': null,
            'dateOfJoining': null,
            'status': 1,
            'country': ['US', Validators.required]
        });
    }
    setFormData(data){
        this.recipientDetails = data.data;
        this.clientId = this.recipientDetails.clientId;

        if (this.recipientDetails.dateOfBirth != null) {
            let date_dateOfBirth: any = new Date(this.recipientDetails.dateOfBirth);
            this.dateOfBirthFormatted = date_dateOfBirth;
        }else{
            this.dateOfBirthFormatted = null;
        }
        if (this.recipientDetails.dateOfJoining != null) {
            let date_dateOfJoining: any = new Date(this.recipientDetails.dateOfJoining);
            this.dateOfJoiningFormatted = date_dateOfJoining;
        }else{
            this.dateOfJoiningFormatted = null;
        }
        this.recForm = this.fb.group({
            'recipientId': this.recipientDetails.recipientId,
            'clientId': this.recipientDetails.clientId,
            'firstName': [this.recipientDetails.firstName, Validators.required],
            'address1': [this.recipientDetails.address1, Validators.required],
            'address2': this.recipientDetails.address2,
            'city': [this.recipientDetails.city, Validators.required],
            'state': [this.recipientDetails.state, Validators.required],
            'zip': [this.recipientDetails.zip, Validators.required],
            'email': [this.recipientDetails.email, Validators.compose([
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])],
            'lastName': this.recipientDetails.lastName,
            'phone1': this.recipientDetails.phone1,
            'phone2': this.recipientDetails.phone2,
            'dateOfBirth': this.dateOfBirthFormatted,
            'dateOfJoining': this.dateOfJoiningFormatted,
            'status': 1,
            'country': ['US', Validators.required]
        });
    }

    ngOnInit() {
        this.spinnerService.show();
        this.OrganisationService.clientList().subscribe(data => {
            this.clients = data.data;
        });

    }

    addPost(post) {
        this.recForm.controls['firstName'].markAsTouched();
        this.recForm.controls['address1'].markAsTouched();
        this.recForm.controls['city'].markAsTouched();
        this.recForm.controls['state'].markAsTouched();
        this.recForm.controls['zip'].markAsTouched();
        this.recForm.controls['email'].markAsTouched();
        this.recForm.controls['phone1'].markAsTouched();
        this.recForm.controls['country'].markAsTouched();
        let dateOfBirth : any;
        let dateOfJoining : any;
        /*if(this.recForm.get('dateOfBirth').value != null && this.recForm.get('dateOfBirth').value != '' && this.recForm.valid){
            dateOfBirth = new Date(this.recForm.get('dateOfBirth').value);
            this.recForm.get('dateOfBirth').patchValue(this.datePipe.transform(dateOfBirth, 'yyyy-MM-dd'));
        }else{
            dateOfBirth = null;
            this.recForm.get('dateOfBirth').patchValue('');
        }
        if(this.recForm.get('dateOfJoining').value != null && this.recForm.get('dateOfJoining').value != '' && this.recForm.valid){
            dateOfJoining = new Date(this.recForm.get('dateOfJoining').value);
            this.recForm.get('dateOfJoining').patchValue(this.datePipe.transform(dateOfJoining, 'yyyy-MM-dd'));
        }else{
            dateOfJoining = null;
            this.recForm.get('dateOfJoining').patchValue('');
        }*/

        if (this.recForm.valid) {
            let dateOfBirth : any = new Date(this.recForm.get('dateOfBirth').value);
            this.recForm.get('dateOfBirth').patchValue(this.datePipe.transform(dateOfBirth, 'yyyy-MM-dd'));
            let dateOfJoining : any = new Date(this.recForm.get('dateOfJoining').value);
            this.recForm.get('dateOfJoining').patchValue(this.datePipe.transform(dateOfJoining, 'yyyy-MM-dd'));
            this.spinnerService.show();
            window.scrollTo(0,0);
            this.RecipientService.updateRecipient(this.recForm.value).subscribe(data => {
                if (data){
                     this.spinnerService.hide();
                }
                if (data.status == "Success"){
                    this.resetForm();
                    this.spinnerService.hide();
                    this.successMessageSaved = true;
                    this.errorExists = false;
                    this.route.params.subscribe(params => {
                        this.RecipientService.getRecipient(params.id).subscribe(data => {
                            this.setFormData(data);
                            this.spinnerService.hide();
                        });
                    });
                }else {
                    this.errorExists = true;
                    this.errorMessage = data.status;
                }
            });
        }
    }

    redirectPreviousPage(){
        this.router.navigate(["/recipientlist/" + this.clientId]);
    }

    closeMessage(){
        this.successMessageSaved = false;
        this.errorExists = false;
    }

}

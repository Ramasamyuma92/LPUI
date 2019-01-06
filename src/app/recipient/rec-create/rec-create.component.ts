import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RecipientService} from '../../service/recipient.service';
import {OrganisationService} from '../../service/organisation.service';
import {ActivatedRoute} from "@angular/router";
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
    selector: 'app-rec-create',
    templateUrl: './rec-create.component.html',
    styleUrls: ['./rec-create.component.css']
})
export class RecCreateComponent implements OnInit {

    recForm: FormGroup;
    post: any;                     // A property for our submitted form
    titleAlert: string = 'This field is required';
    clients: any;
    successMessageSaved: any = false;

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
    dateOfBirth: string;
    dateOfJoining: string;
    status: number;
    country: string;
    urlParams: any;
    errorMessage: string;
    errorExists: boolean = false;
    today:Date = new Date();
    maxDate:Date = new Date();



    constructor(private fb: FormBuilder, private RecipientService: RecipientService, private OrganisationService: OrganisationService, private route: ActivatedRoute, private router: Router, private datePipe: DatePipe, private spinnerService: Ng4LoadingSpinnerService) {
        
        this.maxDate=new Date(this.maxDate.setFullYear(this.today.getFullYear()- 13))
        this.route.params.subscribe(params => {
            this.urlParams = params;
            this.resetForm();
            this.clientId = parseInt(params.id);
        });

    }

    resetForm() {
        this.recForm = this.fb.group({
            'clientId': parseInt(this.urlParams.id),
            'firstName': ['', Validators.required],
            'address1': ['', Validators.required],
            'address2': '',
            'city': ['', Validators.required],
            'state': ['', Validators.required],
            'zip': ['', Validators.required],
            'email': '',
            'lastName': '',
            'phone1': '',
            'phone2': '',
            'dateOfBirth': null,
            'dateOfJoining': null,
            'status': 1,
            'country': 'US'
        });
    }

    ngOnInit() {
        this.spinnerService.show();
        this.OrganisationService.clientList().subscribe(data => {
            this.clients = data.data;
            this.spinnerService.hide();
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

        if (this.recForm.valid) {
        if(this.recForm.get('dateOfBirth').value!=''){
            let dateOfBirth : any = new Date(this.recForm.get('dateOfBirth').value);
            this.recForm.get('dateOfBirth').patchValue(this.datePipe.transform(dateOfBirth, 'yyyy-MM-dd'));
        }
        if(this.recForm.get('dateOfJoining').value != ''){
            let dateOfJoining : any = new Date(this.recForm.get('dateOfJoining').value);
            this.recForm.get('dateOfJoining').patchValue(this.datePipe.transform(dateOfJoining, 'yyyy-MM-dd'));
        }
            this.spinnerService.show();
            this.RecipientService.createRecipient(this.recForm.value).subscribe(data => {
                if (data) {
                    this.spinnerService.hide();
                }
                if (data.status == "Success"){
                    this.successMessageSaved = true;
                    this.errorExists = false;
                    this.resetForm();
                }else {
                    this.recForm.get('dateOfJoining').patchValue('');
                    this.recForm.get('dateOfBirth').patchValue('');
                    this.errorExists = true;
                    this.errorMessage = data.status;
                }
            });
        }
    }

    redirectToPreviousPage() {
        //this.resetForm();
        this.router.navigate(['/recipientlist/'+this.clientId]);
    }

    closeMessage(){
        this.successMessageSaved = false;
        this.errorExists = false;
    }

}

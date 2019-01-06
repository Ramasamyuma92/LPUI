import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OrganisationService} from '../../service/organisation.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

@Component({
    selector: 'app-org-edit',
    templateUrl: './org-edit.component.html',
    styleUrls: ['./org-edit.component.css']
})
export class OrgEditComponent implements OnInit {

    orgForm: FormGroup;
    post: any;                     // A property for our submitted form
    titleAlert: string = 'This field is required';
    clientDetails: any;
    successMessageSaved: any = false;
    taxRateError: string = '';
    clientId: number;
    clientName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    discount: number;
    primaryContactName: string;
    primaryContactEmail: string;
    primaryContactPhone1: string;
    primaryContactPhone2: string;
    secondaryContactName: string;
    secondaryContactEmail: string;
    secondaryContactPhone1: string;
    secondaryContactPhone2: string;
    status: number;
    brandingImage: string;

    constructor(private fb: FormBuilder, private OrganisationService: OrganisationService, private route: ActivatedRoute, private router: Router, private spinnerService: Ng4LoadingSpinnerService) {

        this.route.params.subscribe(params => {
            this.OrganisationService.getClient(params.id).subscribe(data => {
                this.clientDetails = data.data
                this.orgForm = fb.group({
                    'clientId': params.id,
                    'clientName': [this.clientDetails.clientName, Validators.required],
                    'address1': [this.clientDetails.address1, Validators.required],
                    'address2': this.clientDetails.address2,
                    'city': [this.clientDetails.city, Validators.required],
                    'state': [this.clientDetails.state, Validators.required],
                    'zip': [this.clientDetails.zip, Validators.required],
                    'country': [this.clientDetails.country, Validators.required],
                    'discount': this.clientDetails.discount,
                    'primaryContactFirstName': [this.clientDetails.primaryContactFirstName, Validators.required],
                    'primaryContactEmail': [this.clientDetails.primaryContactEmail, Validators.compose([
                        Validators.required,
                        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
                    ])],
                    'primaryContactPhone1': [this.clientDetails.primaryContactPhone1, Validators.required],
                    'primaryContactPhone2': this.clientDetails.primaryContactPhone2,
                    'secondaryContactFirstName': this.clientDetails.secondaryContactFirstName,
                    'secondaryContactEmail': this.clientDetails.secondaryContactEmail,
                    'secondaryContactPhone1': this.clientDetails.secondaryContactPhone1,
                    'secondaryContactPhone2': this.clientDetails.secondaryContactPhone2,
                    'status': '1',
                    'taxRate': this.clientDetails.taxRate,
                    'brandingImage': [this.clientDetails.brandingImage, Validators.required]
                });

            });
        });

        this.orgForm = fb.group({
            'clientName': ['', Validators.required],
            'address1': ['', Validators.required],
            'address2': '',
            'city': ['', Validators.required],
            'state': ['', Validators.required],
            'zip': ['', Validators.required],
            'country': ['US', Validators.required],
            'discount':'',
            'primaryContactFirstName': ['', Validators.required],
            'primaryContactEmail': ['', Validators.required],
            'primaryContactPhone1': ['', Validators.required],
            'primaryContactPhone2': '',
            'secondaryContactFirstName': '',
            'secondaryContactEmail': '',
            'secondaryContactPhone1': '',
            'secondaryContactPhone2': '',
            'taxRate' : 0,
            'status': '1',
            'brandingImage': ['', Validators.required]
        });

    }

    ngOnInit() {
        this.spinnerService.show();
    }

    addPost(post) {
        if(this.taxRateError == ''){
            this.orgForm.controls['clientName'].markAsTouched();
            this.orgForm.controls['address1'].markAsTouched();
            this.orgForm.controls['brandingImage'].markAsTouched();
            this.orgForm.controls['primaryContactPhone1'].markAsTouched();
            this.orgForm.controls['zip'].markAsTouched();
            this.orgForm.controls['city'].markAsTouched();
            this.orgForm.controls['state'].markAsTouched();
            this.orgForm.controls['country'].markAsTouched();
            this.orgForm.controls['primaryContactFirstName'].markAsTouched();
            this.orgForm.controls['primaryContactEmail'].markAsTouched();
            if (this.orgForm.valid) {
                this.spinnerService.show();
                window.scrollTo(0,0);                
                    this.OrganisationService.updateOrganisation(post).subscribe(data => {
                        this.successMessageSaved = true;
                        this.spinnerService.hide();
                    });
            }
        }
    }

    onChangeDiscount(discount) {
        if(discount >100){
            this.orgForm.patchValue({discount: 100});
        }else if(discount < 0){
            this.orgForm.patchValue({discount: 0});
        }
        else {
            this.orgForm.patchValue({discount: discount});
        }

    }

    redirectToPreviousPage() {
        this.router.navigate(['/organization']);
    }

    closeMessage(){
        this.successMessageSaved = false;
    }

    onChangeZipCode(zipCode){

        if(zipCode.length == 5 || zipCode.length == 6 ){
            this.OrganisationService.getTaxRate(zipCode).subscribe((data: any) =>{

                    this.orgForm.patchValue({taxRate:data.data.taxRate});

                    if(data.requestStatus == 'success'){
                        this.taxRateError = '';
                    }else{
                        this.taxRateError = data.requestStatus;
                    }
                
            });
        }else{
            this.orgForm.patchValue({taxRate:0});
            this.taxRateError = 'Enter a Valid ZipCode';
        }
    }
}

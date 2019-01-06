import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OrganisationService} from '../../service/organisation.service';
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";

@Component({
    selector: 'app-org-create',
    templateUrl: './org-create.component.html',
    styleUrls: ['./org-create.component.css']
})
export class OrgCreateComponent implements OnInit {

    orgForm: FormGroup;
    post: any;                     // A property for our submitted form
    titleAlert: string = 'This field is required';
    successMessageSaved: boolean = false;
    errorMessage: string;
    errorExists: boolean = false;
    taxRateError : string = '';
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

    constructor(private fb: FormBuilder, private OrganisationService: OrganisationService, private router: Router, private spinnerService: Ng4LoadingSpinnerService) {
        this.resetForm();
    }

    ngOnInit() {
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
            this.orgForm.controls['discount'].markAsTouched();
            this.orgForm.controls['primaryContactFirstName'].markAsTouched();
            this.orgForm.controls['primaryContactEmail'].markAsTouched();
            if (this.orgForm.valid) {
                this.errorExists  = false;
                this.spinnerService.show();
                
                    this.OrganisationService.createOrganisation(post).subscribe(data => {
                        if (data.status == "success"){
                            this.successMessageSaved = true;
                            this.errorExists = false;
                            this.resetForm();
                            this.spinnerService.hide();
                        }else {
                            this.errorExists = true;
                            this.errorMessage = data.status;
                            this.spinnerService.hide();
                        }
                    });
            }
        }
    }

    resetForm(){
        this.orgForm = this.fb.group({
            'clientName': ['', Validators.required],
            'address1': ['', Validators.required],
            'address2': '',
            'city': ['', Validators.required],
            'state': ['', Validators.required],
            'zip': ['', Validators.required],
            'country': ['US', Validators.required],
            'discount': 0,
            'primaryContactFirstName': ['', Validators.required],
            'primaryContactEmail': ['', Validators.compose([
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])],
            'primaryContactPhone1': ['', Validators.required],
            'primaryContactPhone2': '',
            'secondaryContactFirstName': '',
            'secondaryContactEmail': '',
            'secondaryContactPhone1': '',
            'secondaryContactPhone2': '',
            'taxRate' : 0,
            'status': 1,
            'brandingImage': ['', Validators.required]
        });
    }

    redirectToPreviousPage(){
        this.resetForm();
        this.router.navigate(['/organization']);
    }

    closeMessage(){
        this.successMessageSaved = false;
        this.errorExists = false;
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

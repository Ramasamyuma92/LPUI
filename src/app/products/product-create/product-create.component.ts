import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductlistService} from '../../service/productlist.service';
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";

@Component({
    selector: 'app-product-create',
    templateUrl: './product-create.component.html',
    styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

    productForm: FormGroup;
    post: any;                     // A property for our submitted form
    titleAlert: string = 'This field is required';
    successMessageSaved: boolean = false;
    errorMessage: string;
    errorExists: boolean = false;
    itemCode: string;
    name: string;
    description:string;
    file: File;
    cost: number;
    weight: number;
    price: number;
    discount: number;
    vendorCode: string;
    sellable:boolean;
    bom:boolean;
    parentItemCode:string;
    isBom:boolean=false;
    imageData:File;
    isInvalidImage:boolean=false;

    constructor(private fb: FormBuilder, private ProductlistService: ProductlistService, private router: Router, private spinnerService: Ng4LoadingSpinnerService) {
        this.resetForm();
    }

    ngOnInit() {
    }

    addPost(post) {
            this.post=post;
            this.productForm.controls['itemCode'].markAsTouched();
            this.productForm.controls['name'].markAsTouched();
            this.productForm.controls['vendorCode'].markAsTouched();
            this.productForm.controls['weight'].markAsTouched();
            this.productForm.controls['cost'].markAsTouched();
            this.productForm.controls['price'].markAsTouched();
            this.productForm.controls['file'].markAsTouched();
            if(this.post.sellable==true){
                this.post.sellable=1
            }
            else{
                this.post.sellable=0
            }
            this.post.file = null;
            if (this.productForm.valid && (!this.isInvalidImage)) {
                this.errorExists  = false;
                this.spinnerService.show();
                    
                    this.ProductlistService.createProduct(this.post , this.imageData).subscribe(data => {
                        if (data.requestStatus == "Success"){
                            this.successMessageSaved = true;
                            this.errorExists = false;
                            this.resetForm();
                            this.spinnerService.hide();
                        }else {
                            this.errorExists = true;
                            this.errorMessage = data.data.status;
                            this.spinnerService.hide();
                        }
                    });
            }
    }

    resetForm(){
        this.productForm = this.fb.group({
            'itemCode': ['', Validators.required],
            'name': ['', Validators.required],
            'file': [null, Validators.required],
            'cost': [null, Validators.compose([
                Validators.required,
                Validators.pattern('[0-9]*[/.]?[0-9]*')
            ])],
            'weight': [null, Validators.compose([
                Validators.required,
                Validators.pattern('^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$')
            ])],
            'price': [null, Validators.compose([
                Validators.required,
                Validators.pattern('^[0-9]*[/.]?[0-9]*')
            ])],
            'discount': 0,
            'sellable': true,
            'description': '',
            'vendorCode': ['', Validators.required]
        });
    }

    onFileChange(event:any) {
      if(event.target.files && event.target.files.length) {
        let selectedFiles:FileList = event.target.files;
        this.imageData =selectedFiles[0];
        if((event.target.files[0].type!=='image/gif') && (event.target.files[0].type!=='image/JPEG') && (event.target.files[0].type!=='image/jpg') && (event.target.files[0].type!=='image/JPG') && (event.target.files[0].type!=='image/jpeg')){
            this.isInvalidImage=true;
        }
        else{
            this.isInvalidImage=false;
        }   
      }
    }

    redirectToPreviousPage(){
        this.resetForm();
        this.router.navigate(['/product']);
    }

    onChangeDiscount(discount) {
        if(discount >100){
            this.productForm.patchValue({discount: 100});
        }else if(discount < 0){
            this.productForm.patchValue({discount: 0});
        }
        else {
            this.productForm.patchValue({discount: discount});
        }

    }

    closeMessage(){
        this.successMessageSaved = false;
        this.errorExists = false;
    }
}

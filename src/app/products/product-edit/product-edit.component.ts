import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductlistService} from '../../service/productlist.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import{ AppConstants} from '../../constants';

@Component({
    selector: 'app-product-edit',
    templateUrl: './product-edit.component.html',
    styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

    productForm: FormGroup;
    post: any;                     // A property for our submitted form
    titleAlert: string = 'This field is required';
    productDetails: any;
    successMessageSaved: any = false;
    itemCode: string;
    name: string;
    description:string;
    file: File;
    itemImage: string;
    cost: number;
    weight: number;
    price: number;
    discount: number;
    vendorCode: string;
    sellable:boolean;
    errorExists:boolean=false;
    errorMessage: string;
    imageData:File;
    isInvalidImage:boolean=false;
    _imageURL : string;
    timeStamp: any;

    constructor(private fb: FormBuilder, private ProductlistService: ProductlistService, private route: ActivatedRoute, private router: Router, private spinnerService: Ng4LoadingSpinnerService) {

        this._imageURL = AppConstants._imageURL;

        this.route.params.subscribe(params => {
            this.ProductlistService.getProduct(params.id).subscribe(data => {
                this.productDetails = data.data;
                this.itemImage = data.data.itemImage;
                this.productForm = fb.group({
                    'itemId': this.productDetails.itemId,
                    'itemCode':this.productDetails.itemCode,
                    'name': [this.productDetails.name, Validators.required],
                    'description':this.productDetails.description,
                    'cost': [this.productDetails.cost, Validators.compose([
                Validators.required,
                Validators.pattern('[0-9]*[/.]?[0-9]*')
            ])],
                    'weight': [this.productDetails.weight, Validators.compose([
                Validators.required,
                Validators.pattern('^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$')
            ])],
                    'price': [this.productDetails.price, Validators.compose([
                Validators.required,
                Validators.pattern('[0-9]*[/.]?[0-9]*')
            ])],
                    'discount': this.productDetails.discount,
                    'vendorCode': [this.productDetails.vendorCode,Validators.required],
                    'sellable':this.productDetails.sellable==1?true:false
                });

            });
        });

        this.productForm = fb.group({
            'itemCode':'',
            'name': ['', Validators.required],
            'file': null,
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
                Validators.pattern('[0-9]*[/.]?[0-9]*')
            ])],
            'discount': 0,
            'sellable': true,
            'description': '',
            'vendorCode': ['', Validators.required]
        });

    }
    ngOnInit() {
        this.spinnerService.show();
        let date = new Date()
        this.timeStamp = date.getTime();
    }

    addPost(post) {
            this.productForm.controls['name'].markAsTouched();
            this.productForm.controls['weight'].markAsTouched();
            this.productForm.controls['cost'].markAsTouched();
            this.productForm.controls['price'].markAsTouched();
            if(post.sellable==true){
                post.sellable=1
            }
            else{
                post.sellable=0
            }
            if(post.file==null || !post.file){
                this.isInvalidImage=false;
            }
            post.file = null;
            
            if (this.productForm.valid && (!this.isInvalidImage)) {
                this.errorExists  = false;
                this.spinnerService.show();
                window.scrollTo(0,0);                
                    this.ProductlistService.updateProduct(post,this.imageData).subscribe(data => {
                        if (data.requestStatus == "Success"){
                            this.successMessageSaved = true;
                            this.errorExists = false;
                            this.spinnerService.hide();
                        }else {
                            this.errorExists = true;
                            this.errorMessage = data.data.status;
                            this.spinnerService.hide();
                        }
                    });
            }
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

    redirectToPreviousPage() {
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
        this.router.navigate(['/product']);
    }
}

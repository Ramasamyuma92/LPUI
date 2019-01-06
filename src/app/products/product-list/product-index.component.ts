import { Component, OnInit } from '@angular/core';
import {ProductlistService} from '../../service/productlist.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-index',
  templateUrl: './product-index.component.html',
  styleUrls: ['./product-index.component.css']
})
export class ProductIndexComponent implements OnInit {

  products = []
  clientName: any = ""
  filterData = ""
  p: number = 1;
  deleteConfirm = -1;
  searchName: any = ""


  constructor(private ProductlistService : ProductlistService,private spinnerService : Ng4LoadingSpinnerService) {
  }

  ngOnInit() {
    this.reloadOrg()
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

  reloadOrg(){
     this.ProductlistService.productListWithSellable().subscribe(data => {
      this.products = data.data;
      this.spinnerService.hide();
    });
  }

  deletePopup(index){
        this.deleteConfirm = index
  }

  closeMessage(){
        this.deleteConfirm = -1
  }

  deleteProduct(index,itemId){
        this.ProductlistService.deleteProduct(itemId).subscribe(data => {
            this.deleteConfirm =-1
            this.reloadOrg()
        },
        (err : HttpErrorResponse)=>{
            console.log("Failed Deletion")
        });    
    }

}

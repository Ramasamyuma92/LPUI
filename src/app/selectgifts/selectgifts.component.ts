import { Component, OnInit } from '@angular/core';
import {ProductlistService} from '../service/productlist.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HeaderService } from '../service/header.service';
import{ AppConstants} from '../constants';

@Component({
  selector: 'app-selectgifts',
  templateUrl: './selectgifts.component.html',
  styleUrls: ['./selectgifts.component.css']
})
export class SelectgiftsComponent implements OnInit {
 products = ""
 isCart:boolean = false
 itemCount:number = 0;
 selected : boolean = false
 buttonDisabled =''
 p: number = 1;
 _imageURL : string;
 timeStamp: any;
 constructor(private productlistservice : ProductlistService,private headerservice : HeaderService, private spinnerService: Ng4LoadingSpinnerService) {
  this._imageURL = AppConstants._imageURL;
 }
  clientID = localStorage.getItem("clientID")
  orderId = localStorage.getItem("orderID");

  ngOnInit() {
    let date = new Date()
        this.timeStamp = date.getTime();
    this.spinnerService.show();
  	this.productlistservice.productList().subscribe(data => {
  		this.products = data.data;
  		this.spinnerService.hide();
    });
  }

  addToCart(productId) {
    this.selected = true
    this.spinnerService.show();
    this.buttonDisabled = "disabled";
    this.productlistservice.addToCart(this.clientID,productId,this.orderId).subscribe(data => {
      this.spinnerService.hide();
      this.headerservice.draftCart(this.clientID,this.orderId).subscribe(data => {
        if (data.data.orderStatus != null)
        {
          this.isCart = true;
          this.itemCount = data.data.orderItems.length;
        }
        else {
          this.isCart = false;
        }
  
      });
    });
    
  }

}

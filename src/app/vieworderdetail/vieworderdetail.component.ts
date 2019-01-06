import { Component, OnInit } from '@angular/core';
import {PlaceorderService} from '../service/placeorder.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {ActivatedRoute} from "@angular/router";
import {Router} from '@angular/router';
import{ AppConstants} from '../constants';


@Component({
  selector: 'app-vieworderdetail',
  templateUrl: './vieworderdetail.component.html',
  styleUrls: ['./vieworderdetail.component.css']
})
export class VieworderdetailComponent implements OnInit {
  clientID = localStorage.getItem("clientID");
  clientName = "";
  orderPrice:number = 0;
  orderStatus = "";
  recipientList = "";
  orderIdStored:number;
  shipmentCost:number = 0;
  discountedPrice:number = 0;
  isData:boolean;
  orders:any;
  taxRate :number=0;
  orderId:number;
  show = -1;
  orderPriceForShipping:number=0;
  Math: any;
  taxAmount:number=0;
  orderTotalAmount:number = 0;
  comments:string = null;
  notes:string = null;
  _imageURL : string;
  timeStamp:any;
  constructor( private placeorderservice: PlaceorderService, private spinnerService: Ng4LoadingSpinnerService,private route: ActivatedRoute, private router: Router) {
    this._imageURL = AppConstants._imageURL;
  }

  ngOnInit() {
      let date = new Date()
      this.timeStamp = date.getTime();
  	 this.spinnerService.show();
     this.Math = Math;
  	 this.route.params.subscribe(params => {
            let clientIdParam = params.clientId?params.clientId:this.clientID
            let orderIdParam = params.orderID?params.orderID:this.orderIdStored
            this.placeorderservice.orderList(clientIdParam,orderIdParam).subscribe(data => {
                if (data.data.orderItems == null) {
                    this.isData = false
                }
                this.orders = data.data.orderItems;
                this.orderId = data.data.orderId;
                this.clientName = data.data.clientName;
                this.orderPrice = data.data.orderPrice;
                this.taxAmount = data.data.taxAmount;
                this.taxRate = data.data.taxRate;
                this.orderStatus = data.data.orderStatus;
                this.shipmentCost = data.data.shipmentCost;
                this.discountedPrice = data.data.discountedPrice;
                this.comments = data.data.comments;
                this.notes = data.data.notes;
                this.recipientList = data.data.orderItems.orderRecipients;
                this.orderTotalAmount=parseFloat(this.toFixed((this.orderPrice - this.discountedPrice + this.shipmentCost+this.taxAmount),2))

                this.spinnerService.hide();
            });
        });
  }
  showModal(index){
    this.show=index;
  }
  hideModal(){
    this.show=-1;
  }
  toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
  }

}

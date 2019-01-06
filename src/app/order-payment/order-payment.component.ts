import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {PlaceorderService} from '../service/placeorder.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.css']
})
export class OrderPaymentComponent implements OnInit {

    orderForm = new FormGroup({
        orderShipping: new FormControl()
    });

    List:any="";

   clientID = localStorage.getItem("clientID");
   clientName = localStorage.getItem("clientName");
   orderId = localStorage.getItem("orderID")
   itemCount: number = 0;
   isCart: boolean = true;
   isData: boolean = true;
   orderPriceForShipping:number = 0;
   shippingOrderQuantity:number = 0;
   orders:any="";
   totalShippingCost:number = 0;
   nonFedexGround:boolean = false;
   shippingOrderQuantityTotal:number=0;
   recipientTotal:number=0;
   showloader : boolean = true;
   orderStatusId: number;
   successMessagePlaced: boolean = false
   successMessageSaved: boolean = false
   successMessageDelete: boolean = false;
   redirect:number = -1;
   changedShippingList:any = [];

   direction: number = 1;
   isDesc:boolean = false;
   column = "";

   p: number = 1;


  constructor(private router: Router,private placeorderservice: PlaceorderService,private spinnerService: Ng4LoadingSpinnerService,private fb: FormBuilder,private datePipe: DatePipe) {
  	this.createOrder();
  }

  ngOnInit() {
      this.changedShippingList = [];
      this.column = "firstName";
  	  this.refreshOrderList();

  }

  refreshOrderList() {
            this.placeorderservice.orderList(this.clientID,this.orderId).subscribe(data => {
                if (data.data.orderStatus != null)
                  {
                    this.itemCount = data.data.orderItems.length;
                    
                    if(this.itemCount != 0){
                        this.isCart = true
                        this.isData = true;
                    }
                    else {
                        this.isCart = false;
                        this.isData = false;
                    }
                  }
                  else {
                    this.isCart = false;
                    this.isData = false;
                  }
                this.orders = data.data;
                this.List = data.data.orderItems;
                this.orderStatusId = data.data.orderStatusId;

                this.List.forEach(x => {
                        x.orderRecipients.forEach(y => {
                            this.recipientTotal = this.recipientTotal + 1;
                         });
                });
                this.totalShippingCost = data.data.shipmentCost
                this.orderPriceForShipping = data.data.orderPrice + data.data.discountedPrice + data.data.taxAmount;
                this.changedShippingList = JSON.parse(localStorage.getItem('isChangedShipping'));
                
                this.shippingCostData(this.List);
            });
    }


  createOrder() {
        this.orderForm = this.fb.group({
            orderShipping: this.fb.array([])
        });
  }

  get orderShipping(): FormArray {
        return this.orderForm.get('orderShipping') as FormArray;
    };

    
  shippingCostData(List) {
        let newOrder1 = List;
        let shipmentRec=[];
        let retainShipment=[];
        let control =this.fb.array([]);
        let deliveryDateVal:Date;
        let reqDate:Date;
        let newOrderIndex;
        let requestedRecID;
        let reqOrderId;
        let shipRecMap = new Map();
        let shippingCostCall = new Map();
        let sumed = false;
        let shippingCostUpdated = 0.00; // shipping cost waiver
        let deliveryTypeChk = [];
        let deliveryTypeValue = '';
        let shippingRequestData = [];
        let changedShippingData = [];
        let isShippingCostCall:boolean = false;
        let shippingCostIndex = [];

        //Shipping cost waivre xxxx
        /*this.shippingOrderQuantityTotal = 0;
        this.shippingOrderQuantity.forEach((e:number) => {
            this.shippingOrderQuantityTotal = this.shippingOrderQuantityTotal + e;
        }); */
        //xxxx
        
        /*for(let m in newOrder1) {
            if(newOrder1[m].requestedDeliveryDate==null || newOrder1[m].quantity==0){
                this.shipButtonError= true;
            }
        }*/

        
        for(let i in newOrder1) {
            
            for(let j in newOrder1[i].orderRecipients) {
                let shipRec=newOrder1[i].orderRecipients[j];
                let dateWithoutTime = this.datePipe.transform(newOrder1[i].requestedDeliveryDate, 'yyyy-MM-dd');
                let key = shipRec.recipientId + dateWithoutTime;
                let calculatedQuan:number = shipRec.quantity;

                if( null != shipRecMap.get(key)){
                     let shippingDetails = shipRecMap.get(key);
                     calculatedQuan = shippingDetails.quantity + shipRec.quantity;
                     sumed = true;
                }

                //if(newOrder1[i].orderRecipients[j].checkStatus == true ) {
                    if(shipRec.deliveryType != 'fedex_ground'){
                        deliveryTypeChk[key] = shipRec.deliveryType;
                    }
                    if(deliveryTypeChk[key]){
                        deliveryTypeValue = deliveryTypeChk[key];
                    }
                    else{
                        deliveryTypeValue = shipRec.deliveryType;
                    }
                    shipRecMap.set(key ,{orderItemId:newOrder1[i].orderItemId,recipientId:shipRec.recipientId,firstName:shipRec.firstName,lastName:shipRec.LastName,address1:shipRec.address1,address2:shipRec.address2,deliveryDate:newOrder1[i].requestedDeliveryDate,shipmentCost:shipRec.shipmentCost,deliveryType:deliveryTypeValue,state:shipRec.state,city:shipRec.city,country:shipRec.country,zip:shipRec.zip,checkStatus:true,quantity:calculatedQuan,weight:newOrder1[i].weight,errorMessage:'',isSumedRecipients:sumed});  
                /*}
                else{
                    if(shipRec.deliveryType != 'fedex_ground'){
                        this.orderItems['controls'][i]['controls'].orderRecipients.at(j).patchValue({deliveryType: ''})
                    }
                }*/
                sumed = false;
            }
        }

        let count =0;
        let recipientQuantity =false;
            this.nonFedexGround = false;

        let shippingCalc:boolean = false ;
        if((this.orderPriceForShipping/this.recipientTotal) < 50 ){
            shippingCalc = true;
        }    
        shipRecMap.forEach((x,y) =>{
            if(x.deliveryType != 'fedex_ground'){
                 this.nonFedexGround = true;
            }
        });
        shipRecMap.forEach((x,y) => {
            // Shipping Cost Waiver
            shippingCostUpdated = 0;            

            let errorArray = this.orderForm.value.orderShipping[count];
                let error:String = '';
                if(null != errorArray){
                        error = errorArray.errorMessage;
                }

            
            if( shippingCalc || this.nonFedexGround){
                    shippingCostUpdated = x.shipmentCost;
                    isShippingCostCall = true;
            }
            else{
            	shippingCostUpdated=0;
            }

                if(x.deliveryType == ''){
                    x.deliveryType = 'fedex_ground';
                    shippingCostCall.set(count,x);
                }else if(x.quantity >= 1 && (error == '' || error == null)){
                    shippingCostCall.set(count,x);
                }                

                if(x.quantity >= 1){
                    recipientQuantity = true;
                }
                control.push(this.fb.group({
                firstName: x.firstName,
                lastName: x.LastName,
                address1: x.address1,
                address2: x.address2,
                shipmentCost: shippingCostUpdated,
                deliveryType: x.deliveryType,
                deliveryDate: x.deliveryDate,
                state:  x.state,
                city: x.city,
                country: x.country,
                zip: x.zip,
                orderItemId: x.orderItemId,
                recipientId: x.recipientId,
                checkStatus: true,
                quantity :x.quantity,
                errorMessage : error
                }))

        shippingRequestData.push({"recipientId": x.recipientId,"serviceCode": x.deliveryType,"packageCode": null,"toState": x.state,"toCountry": x.country,"toPostalCode": x.zip,"toCity": x.city,"itemId": x.orderItemId,"deliveryDate":x.deliveryDate,"weight": {"value": x.quantity * x.weight,"units": "lbs"}});
       
        for(let key in this.changedShippingList) {
            if(this.changedShippingList[key].recipientId ==  x.recipientId && this.changedShippingList[key].deliveryDate == x.deliveryDate ){
                changedShippingData.push({"recipientId": x.recipientId,"serviceCode": x.deliveryType,"packageCode": null,"toState": x.state,"toCountry": x.country,"toPostalCode": x.zip,"toCity": x.city,"itemId": x.orderItemId,"deliveryDate":x.deliveryDate,"weight": {"value": x.quantity * x.weight,"units": "lbs"}});
                shippingCostIndex.push({"recipientId": x.recipientId , "deliveryDate":x.deliveryDate , "index" :  count});
            }                        
        }

        count++;
        })

        //this.shippingcostforRecipient = shippingCostCall.size;

        this.orderForm.setControl('orderShipping', control);
        
        /*if(this.calculateShippingCost){
            if(shippingCostCall.size==0){
                this.showloader = false;
            }
            else{
           // shippingCostCall.forEach((x,y) =>{
            //    this.onChangeShippingMethod(x.deliveryType,x,y);
            //});
            
            }
        }*/
        if(shippingCostCall.size!=0 && isShippingCostCall && this.totalShippingCost == 0){
            this.onChangeShippingMethodBulk(shippingRequestData);
        }else if(shippingCostCall.size!=0 && isShippingCostCall && this.totalShippingCost > 0  ){
            if( !(changedShippingData == undefined || changedShippingData.length == 0)) {
                this.onChangeShippingPatch(changedShippingData,shippingCostIndex);
            }else{
                this.showloader = false;
            }
        }else{
            this.totalShippingCost = 0 ;
            this.showloader = false;
        }

        //if(this.orderPrice==0) this.totalShippingCost = 0 ;
        //this.calculateShippingCost = true;
    }


    onChangeShippingMethod(method,shippingData,indexVal) {
        this.changedShippingList = [];
        let serviceCode=method
        let packageCode=null
        let toState=shippingData.state
        let toCountry=shippingData.country
        let toPostalCode=shippingData.zip
        let toCity=shippingData.city
        let value=shippingData.quantity;
        let units="LB"; 
        this.nonFedexGround = false;  
        this.changedShippingList.push({
            recipientId : shippingData.recipientId,
            deliveryDate : this.datePipe.transform(shippingData.deliveryDate, 'yyyy-MM-dd'),
            orderItemId : shippingData.orderItemId
        });
        this.changeShippingCost(method,shippingData,indexVal,shippingData.orderItemId,0,'');
        this.showloader = true;
        
        /*this.placeorderservice.shippingCost(serviceCode,packageCode,toState,toCountry,toPostalCode,toCity,value,units).subscribe((data: any)=> {
        	
            if(data.requestStatus != ""){
            this.spinnerService.hide();
                //this.shipmentCosting = data.data.shipmentCost;
                let error ="";
                if(data.requestStatus != "success"){
                    error = data.requestStatus;
                }
                else{
                    if(method != 'fedex_ground' && method !=''){
                        this.nonFedexGround = true;
                    }
                }

                
            }
            //
        });*/
        this.shippingCostData(this.orders.orderItems);
        
    }

    onChangeShippingMethodBulk(shippingRequestData) {
    	/*let bulkShipment:any=[]
    	for(let i in shippingRequestData){
    		if(shippingRequestData[i].shipmentCost<=0){
    			bulkShipment.push({deliveryDate:shippingRequestData[i].deliveryDate,itemId:shippingRequestData[i].itemId,packageCode:shippingRequestData[i].packageCode,recipientId:shippingRequestData[i].recipientId,serviceCode:shippingRequestData[i].serviceCode,toCity:shippingRequestData[i].toCity,toCountry:shippingRequestData[i].toCountry,toPostalCode:shippingRequestData[i].toPostalcode,toState:shippingRequestData[i].toState,weight:{value:shippingRequestData[i].weight.value,units:shippingRequestData[i].weight.units}});
    		}

    	}*/
        this.placeorderservice.shippingCostBulk(shippingRequestData).subscribe((data: any)=> {
            data.data.shippingCostResponse.forEach((x,y) => {
            	
                this.changeShippingCost(x.serviceCode,x,y,x.itemId,x.shipmentCost,x.errorMessage);
            });
        });       
        
    }

    onChangeShippingPatch(shippingRequestData,shippingCostIndex){

        this.placeorderservice.shippingCostBulk(shippingRequestData).subscribe((data: any)=> {
            data.data.shippingCostResponse.forEach((x,y) => {
                let index ;
                for(let key in shippingCostIndex){
                    if(shippingCostIndex[key].recipientId ==  x.recipientId &&  shippingCostIndex[key].deliveryDate == x.deliveryDate ){
                        index = shippingCostIndex[key].index;
                    }
                }
            	
                this.changeShippingCost(x.serviceCode,x,index,x.itemId,x.shipmentCost,x.errorMessage);
            });
        });  
        
    }

   
    changeShippingCost(method,shippingData,indexVal,orderItemId,shipmentCost,error){

            if(this.orderShipping.length>0){
               /* if((this.orderPriceForShipping/this.shippingOrderQuantityTotal)<50 || this.nonFedexGround==true){
                    this.orderShipping.at(indexVal).patchValue({shipmentCost: shipmentCost});
                }
                else{
                    this.orderShipping.at(indexVal).patchValue({shipmentCost: 0.00});
                }*/

                this.orderShipping.at(indexVal).patchValue({shipmentCost: shipmentCost});

                
                this.orderShipping.at(indexVal).patchValue({deliveryType: method});
                this.orderShipping.at(indexVal).patchValue({errorMessage: error});

                //this.saveShippingCost();
                /*if(indexVal==(this.shippingcostforRecipient-1)){
                    this.showloader = false;
                    this.showloaderForCost = false;
                }*/            
            
                this.orderShipping.at(indexVal).patchValue({deliveryType: method});

                let shippingVal = this.orderShipping.value;
                this.showloader = false;
                this.totalShippingCost=0;
	            for(let i in shippingVal){
	                this.totalShippingCost = this.totalShippingCost + shippingVal[i].shipmentCost
	            }
        }

        for (let i in this.orders.orderItems){
            for(let j in this.orders.orderItems[i].orderRecipients){
	                let shipRec = this.orders.orderItems[i].orderRecipients[j]
	                let d=this.datePipe.transform(this.orders.orderItems[i].requestedDeliveryDate, 'yyyy-MM-dd');
	                let s=this.datePipe.transform(shippingData.deliveryDate, 'yyyy-MM-dd')
	                if(d==s){
	                    if(shippingData.recipientId == shipRec.recipientId &&                 this.orders.orderItems[i].orderItemId == orderItemId){

	                    this.orders.orderItems[i].orderRecipients[j].deliveryType=method;
	                    this.orders.orderItems[i].orderRecipients[j].shipmentCost=shipmentCost;
	                    /*if((this.orderPriceForShipping/this.shippingOrderQuantityTotal)<50 || this.nonFedexGround==true){
	                        this.orders.orderItems[i].orderRecipients[j].shipmentCost=shipmentCost;
	                    }
	                    else{
	                        this.orders.orderItems[i].orderRecipients[j].shipmentCost=0;
	                    }*/
	                   }
	                }
            	}

          }
        
         

    }

/*
  shippingModal(i) {
        this.showShippingModal=true;
        this.calculateShippingCost = false;
        this.isOrderPlaced = false;
        this.shippingCostData();
        
    }
    
    closeShippingModal(){
        this.showShippingModal=false;
        this.isOrderPlaced = false;
        this.saveShippingCost();
    }

    saveShippingCost(){
        this.totalShippingCost=0;
        this.shippingOrderQuantityTotal = 0;
        this.shippingOrderQuantity.forEach((e:number) => {
            this.shippingOrderQuantityTotal = this.shippingOrderQuantityTotal + e;
        }); 
        if((this.orderPriceForShipping/this.shippingOrderQuantityTotal)<50 || this.nonFedexGround==true){
            let shippingVal = this.orderShipping.value;
            for(let i in shippingVal){
                this.totalShippingCost = this.totalShippingCost + shippingVal[i].shipmentCost
            }
        }
    }*/


  placeorder(statusValue,redirect){
  this.redirect=redirect;
  console.log(this.orderShipping)
  this.showloader=false;
  var unmanipulatedvalue = this.orders;
  unmanipulatedvalue.shipmentCost = this.totalShippingCost;
  unmanipulatedvalue.orderStatusId = statusValue;
	  this.placeorderservice.updateOrder(unmanipulatedvalue).subscribe(data => {
	  	if(this.redirect==0){
                        localStorage.removeItem("orderID")
                        localStorage.removeItem("clientID")
                        localStorage.removeItem("clientName")

                    }
        if (statusValue == 2) {
                       
                        if(this.redirect==0){
                         this.successMessagePlaced = true
                         this.successMessageSaved = false
                        }
                        else {
                        	this.successMessageSaved = false
                        	this.successMessagePlaced = false
                            this.router.navigate(['/placeorder']);
                        }
                    }
                    else if (statusValue == 1){
                        if(this.redirect==0){
                        this.successMessageSaved = true
                        }
                        else{
                            this.successMessageSaved = false
                            this.router.navigate(['/placeorder']);
                        }
                        this.successMessagePlaced = false
                        
                    }


	  });

  }

  hideMessage(status){
        this.router.navigate(['/view']);
        this.successMessagePlaced = false;
        this.successMessageSaved = false;
    }

  back(){
  	this.router.navigate(['/placeorder']);
  }

  pageChanged(e){
        this.p=e;
    }

 sort(property){
        this.isDesc = !this.isDesc; //change the direction   
        this.column = property;
        this.direction = this.isDesc ? -1 : 1;
    }

}

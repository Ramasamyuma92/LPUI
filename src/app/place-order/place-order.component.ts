import {Component, OnInit,AfterContentChecked} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Router} from '@angular/router';
import {PlaceorderService} from '../service/placeorder.service';
import {HttpErrorResponse} from '@angular/common/http';
import {FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule} from '@angular/forms';
import {OrderList, Orders, OrderRecipients, orderItemRecipients,ShippingCost} from '../data-model';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {DatePipe} from '@angular/common';
import{ AppConstants} from '../constants';

@Component({
    selector: 'app-place-order',
    templateUrl: './place-order.component.html',
    styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {
    modalShow = -1;
    clientID = localStorage.getItem("clientID");
    clientName = localStorage.getItem("clientName");
    orderId = 0;
    isRecError:boolean = false;
    isError: boolean = false;
    checkedVal = -1;
    orderStatusId: number;
    discountTxt:boolean = false
    discountPercent = 0
    x = 1;
    recipientsList = ""
    isSelected:boolean = false; 
    searchFName: any = ""
    orderItemId = ""
    orderItemPrice = 0;
    orderitemRecipientId = [];
    orderItemRecipients = [];
    OrderList: any = [];
    orderDiscountedPrice:number = 0;
    isData: boolean = true
    checkAll= -1
    isChecked:boolean = false;
    orderPrice: number = 0;
    discountedPrice:number = 0;
    minDate: Date = new Date();
    maxRecDate: Date = new Date();
    orderIdStored = localStorage.getItem("orderID")
    recipientId = "";
    recQuantity:number = 1;
    error: boolean = false;
    isInValid: boolean = false;
    adminDiscount:number = 0;
    discount:number = 0;
    clientDiscount:number = 0;
    shipButtonError:boolean = false;
    calculateShippingCost = true;
    taxAmount:number =0;
    taxRate:number =0;
    orderPriceForShipping:number=0;

    itemCount: number = 0;
    totalShippingCost:number = 0
    discounted:number = 0;

    orderIdIndex: number = 0
    isCart: boolean = true;
    successMessagePlaced: boolean = false
    successMessageSaved: boolean = false
    successMessageDelete: boolean = false;

    customMessage: any = ""
    message: any = ""
    showShippingModal:boolean = false
    shipmentCostData:number = 0

    shipmentCostError:boolean=false;
    shipToClient:boolean=false;

    shipmentCosting:number = 0;
    showDeleteOrderModal:boolean =false;
    deleteOrderItemId:number ;

    totalOrderPrice:number=0;

    isOrderPlaced:any = false;

    arrayVal:any=[];

    shippingOrderQuantity:any = []; // shipping cost waiver

    shippingOrderQuantityTotal: number = 0; // shipping cost waiver

    comments : string ='';
    notes : string ='';

    showloader : boolean = false;

    showloaderForCost : boolean = false;

    shippingcostforRecipient : any = 0;

    redirect:number = -1;

    recipientListBk:any = [];
    recipientListBkQuantity:any = [];
    orderTotalAmount:number=0;

    nonFedexGround:any = false;
    Math: any;

    direction: number = 1;
    isDesc:boolean = false;
    column = "";

    p: number = 1;

    orderForm = new FormGroup({
        orderItems: new FormControl(),
        orderShipping: new FormControl()
    });

    public List: OrderList[];
    public recipients: OrderRecipients[];
    public selectedRecipients: any = [];
    orderItem: any = [];
    delivDate:Date = null;
    discountedPriceVal:number = 0;
    IndexOfOrder:number = -1;

    selectedIndex:number=-1;
    shippmentChangeMap=new Map();
    deliveryDateMap = new Map();

    _imageURL : string;
    timeStamp: any;

    constructor(private fb: FormBuilder, private placeorderservice: PlaceorderService, private spinnerService: Ng4LoadingSpinnerService,private route: ActivatedRoute, private router: Router,private datePipe: DatePipe) {
        this.Math = Math;
        this.spinnerService.show();
        this.minDate.setDate(this.minDate.getDate());
        this.createOrder();
        this._imageURL = AppConstants._imageURL;

    }

    closeDeleteOrdermodal() {
        this.showDeleteOrderModal = false;
    }
    
    onChangeMessage(message, indexVal) {
        this.orderItems.at(indexVal).patchValue({message: message});
    }

    onChangeRecMessage(message, indexVal,orderIndex,recId) {
    /*console.log(recId)
    console.log(this.orderItems['controls'][orderIndex]['controls'].orderRecipients['controls'].findIndex(control => console.log(control))*/
        this.orderItems['controls'][orderIndex]['controls'].orderRecipients.at(indexVal).patchValue({message: message})
    }

    onChangeShippmentCombination(recipientId,deliveryDate,itemId){
        
        this.shippmentChangeMap.set(this.datePipe.transform(deliveryDate, 'yyyy-MM-dd')+recipientId,{
            recipientId : recipientId,
            deliveryDate : this.datePipe.transform(deliveryDate, 'yyyy-MM-dd'),
            orderItemId : itemId
        });
        
    }

    setShippmentChangeMap(recipientId,deliveryDate,itemId){

        this.shippmentChangeMap.set(deliveryDate+recipientId,{
            recipientId : recipientId,
            deliveryDate : deliveryDate,
            orderItemId : itemId
        });
    }

    ngAfterContentChecked() {
        let orderList = this.orderForm.value.orderItems
        let itemWithDiscountTotal:number = 0;
        let itemWithoutDiscountTotal:number=0;
        let discountedPrice:number=0;
        let itemsWithDiscount=[];
        let itemsWithoutDiscount=[];
        let orderPrice:number=0;
        for(let i in orderList) {
            if(orderList[i].discount>0){
                itemsWithDiscount.push(orderList[i])
            }
            else {
                itemsWithoutDiscount.push(orderList[i])
            }
            orderPrice=orderPrice+(orderList[i].quantity*orderList[i].itemPrice)
                /*if(orderList[i].requestedDeliveryDate==null ||orderList[i].quantity==0){
                    this.shipButtonError= true;
                }*/
        }
        
        for(let j in itemsWithDiscount){
            itemWithDiscountTotal=parseFloat(this.toFixed((itemWithDiscountTotal+(itemsWithDiscount[j].quantity*itemsWithDiscount[j].itemPrice)-((itemsWithDiscount[j].quantity*itemsWithDiscount[j].itemPrice)*itemsWithDiscount[j].discount)/100),2));
        }
        for(let j in itemsWithoutDiscount){
            itemWithoutDiscountTotal=parseFloat(this.toFixed(itemWithoutDiscountTotal+(itemsWithoutDiscount[j].quantity*itemsWithoutDiscount[j].itemPrice),2));
        }

        if(this.clientDiscount!=0){
            discountedPrice=parseFloat(this.toFixed((itemWithoutDiscountTotal-(itemWithoutDiscountTotal*this.clientDiscount)/100),2))
        }
        else {
            discountedPrice=parseFloat(this.toFixed(this.getDiscount(itemWithoutDiscountTotal),2))
        }

        this.totalOrderPrice=parseFloat(this.toFixed((discountedPrice+itemWithDiscountTotal),2))


        if(this.orderForm.value.adminDiscount>0){
            this.totalOrderPrice=parseFloat(this.toFixed((this.totalOrderPrice-(this.totalOrderPrice*this.orderForm.value.adminDiscount)/100),2))
        }

        this.orderPrice=orderPrice;
        this.taxAmount = parseFloat(this.toFixed((this.orderPrice+(this.orderPrice-this.totalOrderPrice))*(this.taxRate/100),2));
        /*var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
        this.taxAmount = parseFloat(this.toFixed((this.orderPrice+(this.orderPrice-this.totalOrderPrice))*(this.taxRate/100),2));

        this.orderPriceForShipping = this.orderPrice + (this.orderPrice-this.totalOrderPrice) + this.taxAmount;
        this.discountedPriceVal =parseFloat(this.toFixed((this.orderPrice - this.totalOrderPrice),2));

        this.orderTotalAmount = this.orderPrice-this.discountedPriceVal)+this.totalShippingCost+this.taxAmount;
        */
    }

    getDiscount(orderTotal){
        if(orderTotal >= 1000 && orderTotal < 2500 ) {
                            orderTotal= (orderTotal) - ((orderTotal*5)/100);
                        }
                        if(orderTotal >=2500 && orderTotal < 5000) {
                            orderTotal= (orderTotal) - ((orderTotal*10)/100);
                        }
                        if(orderTotal >=5000){
                            orderTotal= (orderTotal) - ((orderTotal*15)/100);
                        }
        return orderTotal;
    }

    toFixed(num, fixed) {
        var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
        return num.toString().match(re)[0];
    }
    
    /*
    onChangeShippingMethod(method,shippingData,indexVal) {
        this.showloaderForCost = true;
        let serviceCode=method
        let packageCode=null
        let toState=shippingData.state
        let toCountry=shippingData.country
        let toPostalCode=shippingData.zip
        let toCity=shippingData.city
        let value=shippingData.quantity;
        let units="LB"; 
            this.nonFedexGround = false;  

        this.placeorderservice.shippingCost(serviceCode,packageCode,toState,toCountry,toPostalCode,toCity,value,units).subscribe((data: any)=> {
            if(data.requestStatus != ""){
                this.shipmentCosting = data.data.shipmentCost;
                let error ="";
                if(data.requestStatus != "success"){
                    error = data.requestStatus;
                }
                else{
                    if(method != 'fedex_ground' && method !=''){
                        this.nonFedexGround = true;
                    }
                }

                //this.changeShippingCost(method,shippingData,indexVal,shippingData.orderItemId,data.data.shipmentCost,error);
            }
            //this.shippingCostData();
        });
        
    }

    onChangeShippingMethodBulk(shippingRequestData) {

        this.placeorderservice.shippingCostBulk(shippingRequestData).subscribe((data: any)=> {
            data.data.shippingCostResponse.forEach((x,y) =>{
                this.changeShippingCost(x.serviceCode,x,y,x.itemId,x.shipmentCost,x.errorMessage);
            });
        });
        
        
    }

    changeShippingCost(method,shippingData,indexVal,orderItemId,shipmentCost,error){
         for (let i in this.orderForm.value.orderItems){
            for(let j in this.orderForm.value.orderItems[i].orderRecipients){
                let shipRec = this.orderForm.value.orderItems[i].orderRecipients[j]
                let d=this.datePipe.transform(this.orderForm.value.orderItems[i].requestedDeliveryDate, 'yyyy-MM-dd');
                let s=this.datePipe.transform(shippingData.deliveryDate, 'yyyy-MM-dd')
                if(d==s){
                    if(shippingData.recipientId == shipRec.recipientId &&                 this.orderForm.value.orderItems[i].orderItemId == orderItemId){
                    this.orderItems['controls'][i]['controls'].orderRecipients.at(j).patchValue({deliveryType: method})
                    if((this.orderPriceForShipping/this.shippingOrderQuantityTotal)<50 || this.nonFedexGround==true){
                        this.orderItems['controls'][i]['controls'].orderRecipients.at(j).patchValue({shipmentCost: shipmentCost})
                    }
                    else{
                        this.orderItems['controls'][i]['controls'].orderRecipients.at(j).patchValue({shipmentCost: 0.00})
                    }
                    this.orderItems['controls'][i]['controls'].orderRecipients.at(j).patchValue({deliveryDate: this.orderForm.value.orderItems[i].deliveryDate})
                   }
                }
            }

            }

            if(this.orderShipping.length>0){
                if((this.orderPriceForShipping/this.shippingOrderQuantityTotal)<50 || this.nonFedexGround==true){
                    this.orderShipping.at(indexVal).patchValue({shipmentCost: shipmentCost});
                }
                else{
                    this.orderShipping.at(indexVal).patchValue({shipmentCost: 0.00});
                }

                
                this.orderShipping.at(indexVal).patchValue({deliveryType: method});
                this.orderShipping.at(indexVal).patchValue({errorMessage: error});

                this.saveShippingCost();
                if(indexVal==(this.shippingcostforRecipient-1)){
                    this.showloader = false;
                    this.showloaderForCost = false;
                }            
            
                this.orderShipping.at(indexVal).patchValue({deliveryType: method});
        }

    }
    */

    /*onChangeDate(indexVal, deliveryDate: Date){
        
        if(deliveryDate){
        this.datePipe.transform((this.maxRecDate.setDate(deliveryDate.getDate() + 10)), 'MM/dd/yyyy');
        this.orderItems.at(indexVal).patchValue({requestedDeliveryDate: deliveryDate});
        console.log(this.orderForm.value.orderItems[indexVal].orderRecipients)
        for(let j in this.orderForm.value.orderItems[indexVal].orderRecipients){
            if(this.orderForm.value.orderItems[indexVal].requestedDeliveryDate == null){
                this.orderItems['controls'][indexVal]['controls'].orderRecipients.at(j).patchValue({deliveryDate: this.maxRecDate})
            }
        }
        //this.shippingCostData()
        }
    }*/

   /* shippingCostData() {
        let newOrder1 = this.orderForm.value.orderItems;
        let shipmentRec=[];
        let retainShipment=[];
        let control =this.fb.array([]);
        let deliveryDateVal:Date;
        let reqDate:Date;
        let newOrderIndex;
        let requestedRecID;
        let reqOrderId;
        this.shipButtonError= false;
        let shipRecMap = new Map();
        let shippingCostCall = new Map();
        let sumed = false;
        let shippingCostUpdated = 0.00; // shipping cost waiver
        let deliveryTypeChk = [];
        let deliveryTypeValue = '';
        let shippingRequestData = [];

        //Shipping cost waivre xxxx
        this.shippingOrderQuantityTotal = 0;
        this.shippingOrderQuantity.forEach((e:number) => {
            this.shippingOrderQuantityTotal = this.shippingOrderQuantityTotal + e;
        }); 
        //xxxx
        
        for(let m in newOrder1) {
            if(newOrder1[m].requestedDeliveryDate==null || newOrder1[m].quantity==0){
                this.shipButtonError= true;
            }
        }

        
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

                if(newOrder1[i].orderRecipients[j].checkStatus == true ) {
                    if(shipRec.deliveryType != 'fedex_ground')
                        deliveryTypeChk[key] = shipRec.deliveryType;
                    if(deliveryTypeChk[key]){
                        deliveryTypeValue = deliveryTypeChk[key];
                    }
                    else{
                        deliveryTypeValue = shipRec.deliveryType;
                    }
                    shipRecMap.set(key ,{orderItemId:newOrder1[i].orderItemId,recipientId:shipRec.recipientId,firstName:shipRec.firstName,lastName:shipRec.LastName,address1:shipRec.address1,address2:shipRec.address2,deliveryDate:newOrder1[i].requestedDeliveryDate,shipmentCost:shipRec.shipmentCost,deliveryType:deliveryTypeValue,state:shipRec.state,city:shipRec.city,country:shipRec.country,zip:shipRec.zip,checkStatus:true,quantity:calculatedQuan,errorMessage:'',isSumedRecipients:sumed});  
                }
                else{
                    if(shipRec.deliveryType != 'fedex_ground'){
                        this.orderItems['controls'][i]['controls'].orderRecipients.at(j).patchValue({deliveryType: ''})
                    }
                }
                sumed = false;
            }
        }

        let count =0;
        let recipientQuantity =false;
            this.nonFedexGround = false;
        
        shipRecMap.forEach((x,y) => {
            // Shipping Cost Waiver
            shippingCostUpdated = 0;            

            let errorArray = this.orderForm.value.orderShipping[count];
                let error:String = '';
                if(null != errorArray){
                        error = errorArray.errorMessage;
                }

            if(x.deliveryType != 'fedex_ground' && x.deliveryType != '' && (error == '' || error == null)){
                this.nonFedexGround = true;
            }
            if((this.orderPriceForShipping/this.shippingOrderQuantityTotal)<50 || this.nonFedexGround==true){
                    shippingCostUpdated = x.shipmentCost;
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

        shippingRequestData.push({"recipientId": x.recipientId,"serviceCode": x.deliveryType,"packageCode": null,"toState": x.state,"toCountry": x.country,"toPostalCode": x.zip,"toCity": x.city,"itemId": x.orderItemId,"deliveryDate":x.deliveryDate,"weight": {"value": x.quantity,"units": "lbs"}});

            count++;
        })

        this.shippingcostforRecipient = shippingCostCall.size;

        this.orderForm.setControl('orderShipping', control);
        if(this.calculateShippingCost){
            if(shippingCostCall.size==0){
                this.showloader = false;
            }
            else{
           // shippingCostCall.forEach((x,y) =>{
            //    this.onChangeShippingMethod(x.deliveryType,x,y);
            //});
            this.onChangeShippingMethodBulk(shippingRequestData);
            }
        }

        if(this.orderPrice==0) this.totalShippingCost = 0 ;
        this.calculateShippingCost = true;
    }
    */

    onChangeDiscount(discount, indexVal) {
        if(discount >100){
            this.orderForm.patchValue({adminDiscount: 100});
        }
        else {
            this.orderForm.patchValue({adminDiscount: parseFloat(this.toFixed(discount,2))});
        }

        this.discountPercent=this.orderForm.value.adminDiscount
        this.orderDiscountedPrice=(this.discountedPrice*this.discountPercent)/100
    }

    refreshOrderList() {
        this.route.params.subscribe(params => {
            let clientIdParam = params.clientId?params.clientId:this.clientID
            let orderIdParam = params.orderID?params.orderID:this.orderIdStored
            this.placeorderservice.orderList(clientIdParam,orderIdParam).subscribe(data => {
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

                this.adminDiscount = data.data.adminDiscount
                this.orderItem = data.data.orderItems;
                this.List = data.data.orderItems;
                for (var i in this.List) {
                    this.List[i].requestedDeliveryDate=this.datePipe.transform(this.List[i].requestedDeliveryDate, 'MM/dd/yyyy')
                }
                this.orderId = data.data.orderId;
                this.orderStatusId = data.data.orderStatusId;
                this.discount = data.data.discount
                this.clientDiscount = data.data.clientDiscount
                this.totalShippingCost = data.data.shipmentCost 
                this.taxAmount = data.data.taxAmount;
                this.taxRate = data.data.taxRate;
                //this.orderPrice = data.data.orderPrice
                //this.discountedPrice= data.data.discountedPrice
                this.comments = data.data.comments;
                this.notes = data.data.notes;

                this.setOrder(this.List);
                this.createDeliveryDateMap();
                this.spinnerService.hide();

            });
        });
    }

    refreshRecipientList() {
        this.placeorderservice.recipientList(this.clientID).subscribe(data => {
            this.recipients = data.data;
            this.recipientsList = data.data
            this.spinnerService.hide();
        });
    }

    createDeliveryDateMap(){
        this.orderItem.forEach(x =>{
            this.deliveryDateMap.set(x.orderItemId , this.datePipe.transform(x.requestedDeliveryDate,'yyyy-MM-dd'));
        });
    }


    public setOrder(List: OrderList[]) {
        this.spinnerService.show();
        let control = this.fb.array([]);
        let controlShip = this.fb.array([]);
            this.nonFedexGround = false;
        if (List) {
        // Remove this after get value backend
            /*List.forEach(x => {
                this.placeorderservice.recipientList(this.clientID).subscribe(data => {
                        this.recipients = data.data;
                        let recipientTotal:number = 0;
                        this.recipients.forEach(y => {
                            x.orderRecipients.forEach(z => {
                                if(y.recipientId==z.recipientId){
                                    recipientTotal = recipientTotal + 1;  
                                }
                            });
                        });
                    this.shippingOrderQuantity[x.itemId]=recipientTotal;
                });
            });*/
            List.forEach(x => {
                let requestedDeliveryDate: Date = new Date();
                if(x.requestedDeliveryDate==null){
                    requestedDeliveryDate=new Date();
                    this.datePipe.transform((requestedDeliveryDate.setDate(requestedDeliveryDate.getDate()+10)), 'MM/dd/yyyy');
                }
                else{
                    requestedDeliveryDate=new Date(x.requestedDeliveryDate);
                    this.datePipe.transform((requestedDeliveryDate.setDate(requestedDeliveryDate.getDate())), 'MM/dd/yyyy');
                }
                control.push(this.fb.group({
                  orderItemId : x.orderItemId,
                  orderId : x.orderId,
                  itemId : x.itemId,
                  itemName : x.itemName,
                  itemImage : x.itemImage,
                  quantity : x.quantity,
                  message : x.message,
                  discount: x.discount,
                  itemPrice : x.itemPrice,
                  orderItemPrice:x.orderItemPrice,
                  orderDiscountedItemPrice:x.orderDiscountedItemPrice,
                  orderItemStatus : x.orderItemStatus,
                  requestedDeliveryDate : requestedDeliveryDate,
                  senderName : x.senderName,
                  orderRecipients: this.setRecipient(x) 
        }))
    })
    this.orderForm.patchValue({adminDiscount: this.adminDiscount});
    this.orderForm.patchValue({comments: this.comments});
    this.orderForm.patchValue({notes: this.notes});
    this.orderForm.setControl('orderItems', control);
    this.orderForm.setControl('orderShipping', controlShip);
            this.spinnerService.hide();
        }
    }

    public setRecipient(x) {
        let arr = new FormArray([]);
        let checkStatus:any ='';
        let shipToClient:boolean =false;
        let quantityval:any ='';
        let orderRecipientId:any = '';
        let orderItemIdVal:number = 0;
        let addressVal1 = "";
        let addressVal2 = "";
        let firstNameVal = "";
        let lastNameVal = "";
        let shippingMethodVal = "";
        let shippingCostVal:number = 0;
        let recloadArr = [];
        let shipmentDate:Date = new Date();
        let defaultDate:Date = new Date();
        this.datePipe.transform((shipmentDate.setDate(defaultDate.getDate()+3)), 'MM/dd/yyyy');
        
        this.placeorderservice.recipientList(this.clientID).subscribe(data => {
            this.recipients = data.data;
            //Shipping cost waivre xxxx
            this.shippingOrderQuantityTotal = 0;
            defaultDate=new Date();
            this.shippingOrderQuantity.forEach((e:number) => {
                this.shippingOrderQuantityTotal = this.shippingOrderQuantityTotal + e;
            });
            
            //xxxx
            this.recipients.forEach(y => {
                checkStatus = false;
                shipToClient=false;
                quantityval = '';
                orderItemIdVal = 0
                orderRecipientId = 0
                shippingMethodVal = "";
                shippingCostVal = 0;
                defaultDate=new Date();
                shipmentDate=new Date();
                this.datePipe.transform((shipmentDate.setDate(defaultDate.getDate()+3)), 'MM/dd/yyyy');
                let  recipientMessage = '';
                x.orderRecipients.forEach(z => {
                    if(y.recipientId==z.recipientId){
                        if(x.deliveryType != 'fedex_ground' && x.deliveryType !=''){
                            this.nonFedexGround = true;
                        }                      
                        
                        checkStatus = true;
                        shipToClient=z.shipToClient?z.shipToClient:false;
                        quantityval = z.quantity;
                        orderItemIdVal = z.orderItemId
                        orderRecipientId =  z.orderRecipientId
                        shippingMethodVal = z.deliveryType
                        shipmentDate=new Date(z.shipmentDate);
                        this.datePipe.transform(shipmentDate.setDate(shipmentDate.getDate()), 'MM/dd/yyyy');
                        recipientMessage = z.message
                        if(z.shipmentDate == null || z.shipmentDate == ""){
                            this.datePipe.transform(shipmentDate.setDate(shipmentDate.getDate()+3), 'MM/dd/yyyy');
                        }
                        else{

                            let storedDate:Date=new Date(z.shipmentDate);
                            this.datePipe.transform(shipmentDate.setDate(storedDate.getDate()), 'MM/dd/yyyy');
                        }                        
                        if((this.orderPriceForShipping/this.shippingOrderQuantityTotal)<50 || this.nonFedexGround==true){
                            shippingCostVal = z.shipmentCost
                        }
                    }
                });
                arr.push(this.fb.group({ 
                    recipientId : y.recipientId,
                    quantity : quantityval?quantityval:1,
                    orderItemId: orderItemIdVal,
                    deliveryDate:x.requestedDeliveryDate,
                    shipmentDate:shipmentDate,
                    message: recipientMessage,
                    deliveryTypeId: 1,
                    trackingNumber:1,
                    requestedDate:'',
                    firstName : y.firstName,
                    lastName : y.lastName,
                    address1 : y.address1,
                    address2: y.address2,
                    checkStatus: checkStatus,
                    shipToClient: shipToClient,
                    deliveryType: shippingMethodVal,
                    shipmentCost: shippingCostVal,
                    orderRecipientId: orderRecipientId,
                    city:   y.city,
                    state: y.state,
                    zip: y.zip,
                    country: y.country
                }))
                recloadArr.push({ recipientId : y.recipientId, message:recipientMessage, quantity : quantityval?quantityval:1,orderItemId: orderItemIdVal,deliveryDate: x.requestedDeliveryDate,shipmentDate: shipmentDate,deliveryTypeId: 1,trackingNumber:1,requestedDate:'',firstName : y.firstName,lastName : y.lastName,address1 : y.address1,address2: y.address2,checkStatus: checkStatus,shipToClient: shipToClient,deliveryType: shippingMethodVal,shipmentCost: shippingCostVal,orderRecipientId: orderRecipientId,city:   y.city,state: y.state,zip: y.zip,country: y.country
                })
            });
        });
        this.recipientListBk[x.itemId] = recloadArr;
        this.recipientListBkQuantity[x.itemId] = x.quantity;
    return arr;
    } 


    ngOnInit() {
        let date = new Date()
        this.timeStamp = date.getTime();
        this.shippmentChangeMap=new Map();
        localStorage.removeItem("isChangedShipping");
        this.refreshOrderList()
        this.refreshRecipientList()
        // this.setOrder(this.List);
        this.column = "firstName";
        this.customMessage = [{
            'messageTitle': 'Custom Message',
            'message': ''
        },
            {
                'messageTitle': 'Thank you',
                'message': 'Hi, I can never thank you enough. But this is a start.'
            },
            {
                'messageTitle': 'Get Well',
                'message': 'Hi, Hoping you find strength with each new day. You are in our thoughts.'
            },
            {
                'messageTitle': 'Congratulations',
                'message': 'Hi, Congratulations Im only surprised at the fact that youre still able to surprise me with your accomplishments.'
            },
            {
                'messageTitle': 'Birthday',
                'message': 'Hi, I am grateful that you are a part of my life. All the best on your birthday!'
            }
        ]
    }

    createOrder() {
        this.orderForm = this.fb.group({
            adminDiscount: this.adminDiscount,
            comments : this.comments,
            notes   : this.notes,
            orderItems: this.fb.array([]),
            orderShipping: this.fb.array([])
        });
    }

    get orderItems(): FormArray {
        return this.orderForm.get('orderItems') as FormArray;
    };
    get orderShipping(): FormArray {
        return this.orderForm.get('orderShipping') as FormArray;
    };

    get orderRecipients(): FormArray {
        return this.orderItems.get('ordeRecipients') as FormArray;
    };

    viewRecipient(orderId, orderItemId, indexVal) {
        this.modalShow = indexVal;
        this.IndexOfOrder = indexVal;
        let recipients = this.orderForm.value.orderItems[indexVal].orderRecipients
        this.orderItems.at(indexVal).patchValue({orderRecipients:recipients});
    }

    saveModal(indexVal) {
        this.modalShow = -1;
        this.p=1;
        this.isOrderPlaced = false;
        let recipients = this.orderForm.value.orderItems[indexVal].orderRecipients
        let orders = this.orderForm.value.orderItems
        let orderTotal:number = 0
        let quantityTotal:number = 0;
        let orderItemPrice:number = 0;
        let orderDiscountedItemPrice:number = 0;
        let recipientTotal:number = 0;

        //this.showloader = true;

        for (let rec in recipients){
            if (recipients[rec].checkStatus==true){
                quantityTotal=quantityTotal + recipients[rec].quantity
                recipientTotal = recipientTotal + 1;
            }
        }
        let orderFormItemPrice:number = 0
        let orderInitialItemPrice:number = 0
        if(this.orderForm.value.orderItems[indexVal].discount>0){
            orderFormItemPrice=this.orderForm.value.orderItems[indexVal].itemPrice - (this.orderForm.value.orderItems[indexVal].itemPrice*this.orderForm.value.orderItems[indexVal].discount/100)
            
        }
        else {
            orderFormItemPrice=this.orderForm.value.orderItems[indexVal].itemPrice
        }

        orderItemPrice = quantityTotal*this.orderForm.value.orderItems[indexVal].itemPrice
        if(this.orderForm.value.orderItems[indexVal].discount>0){
            orderDiscountedItemPrice = quantityTotal*orderFormItemPrice;
        }
        else {
            orderDiscountedItemPrice=quantityTotal*this.orderForm.value.orderItems[indexVal].itemPrice;
        }
        if (this.isInValid == true) {
            this.orderItems.at(indexVal).patchValue({'orderItemPrice':0});
            this.orderItems.at(indexVal).patchValue({'quantity':0});
            this.isInValid = false
            this.isRecError = true;
        }
        this.orderItems.at(indexVal).patchValue({'orderItemPrice':orderItemPrice});
        this.orderItems.at(indexVal).patchValue({'quantity':quantityTotal});
        this.shippingOrderQuantity[this.orderForm.value.orderItems[indexVal].orderItemId]=recipientTotal;

        this.recipientListBk[this.orderForm.value.orderItems[indexVal].itemId] = recipients;
        this.recipientListBkQuantity[this.orderForm.value.orderItems[indexVal].itemId] = quantityTotal;

        //this.shippingCostData()

    }


    addAllRecipients(indexVal) {
        this.searchFName = "";
        let recipients = this.orderForm.value.orderItems[indexVal].orderRecipients
        for (let rec in recipients){
            recipients[rec].checkStatus = true
            if (recipients[rec].quantity==0){
                recipients[rec].quantity = 1              

            }
            this.onChangeShippmentCombination(recipients[rec].recipientId,recipients[rec].deliveryDate,this.orderForm.value.orderItems[indexVal].orderItemId)
        }
        this.orderItems.at(indexVal).patchValue({orderRecipients:recipients});

    }

    deleteAllRecipients(indexVal) {
        this.searchFName = "";
        let recipients = this.orderForm.value.orderItems[indexVal].orderRecipients
        for (let rec in recipients){
            recipients[rec].checkStatus = false
        }
        this.isInValid = true;
        this.orderItems.at(indexVal).patchValue({orderRecipients:recipients});
        this.orderItems.at(indexVal).patchValue({quantity:0});
    }

    deleteOrderModal(){
        delete this.shippingOrderQuantity[this.deleteOrderItemId];
        this.orderItems.removeAt(0);
        this.itemCount = this.orderItems.length;
        if (this.itemCount == 0){
            this.isCart = false;
            this.isData = false;
        }
        this.showDeleteOrderModal = false;
        this.cancelOrder();
        
    }

    deleteOrder(indexVal, orderItemId) {
                let newOrder = this.orderForm.value.orderItems;
                if(newOrder.length == 1){ 
                    this.deleteOrderItemId = orderItemId;
                    this.showDeleteOrderModal = true;

                }else{
                    this.spinnerService.show();
                    this.deleteOrderItem(indexVal, orderItemId);
                    this.showDeleteOrderModal = false;
                }
    }
    
    deleteOrderItem(indexVal, orderItemId){
        delete this.shippingOrderQuantity[orderItemId];
        this.placeorderservice.deleteOrder(orderItemId).subscribe(data => {
                this.orderItems.removeAt(indexVal);
                this.itemCount = this.orderItems.length;
                if (this.itemCount == 0){
                    this.isCart = false;
                    this.isData = false;
                    }
                //this.shippingCostData();
                //this.saveShippingCost();
            });
    }

    cancelOrder(){
        this.modalShow = -1;
        this.orderForm.removeControl('orderShipping');
        
        this.orderForm.value.orderStatusId = 6;
        this.orderForm.value.orderId = this.orderId;
        this.orderForm.value.clientId = this.clientID;
        this.orderForm.value.clientName = this.clientName;
        this.orderForm.value.discountedPrice = 0;
        this.orderForm.value.orderPrice = 0;
        this.orderForm.value.shipmentCost = 0;
        this.orderForm.value.taxAmount = 0;
        this.orderForm.value.adminDiscount = 0;
        this.orderForm.value.orderItems = [];
        this.isError = false;
        this.isRecError = false;
        this.shipmentCostError=false;
        var unmanipulatedvalue = this.orderForm.value;

        this.placeorderservice.updateOrder(unmanipulatedvalue).subscribe(data => {
            this.successMessageDelete = true;
            this.successMessagePlaced = false;
            this.successMessageSaved = false;
            this.isData = false;
            this.itemCount = 0;
            this.isCart = false;
            //localStorage.removeItem("orderID");
            this.refreshOrderList();

        },
        (err: HttpErrorResponse) => {
            console.log('error')
        });

    }

    checkForDeliverydateChange(){
        let orderItemArry = this.orderForm.value.orderItems;
        for(let i in orderItemArry){
            if( null != this.deliveryDateMap.get(orderItemArry[i].orderItemId)  
                && '' != this.deliveryDateMap.get(orderItemArry[i].orderItemId) 
                && undefined != this.deliveryDateMap.get(orderItemArry[i].orderItemId) ){
                if(this.deliveryDateMap.get(orderItemArry[i].orderItemId) !=  this.datePipe.transform(orderItemArry[i].requestedDeliveryDate ,'yyyy-MM-dd') ){
                    this.setChangedShippingRecipients(orderItemArry[i]);
                    this.findOrdersWithSameDeliveryDate(orderItemArry[i].orderItemId,this.datePipe.transform(orderItemArry[i].requestedDeliveryDate ,'yyyy-MM-dd'));
                    this.findOrdersWithSameDeliveryDate(orderItemArry[i].orderItemId,this.deliveryDateMap.get(orderItemArry[i].orderItemId));
                }
            }
        }

    }

    findOrdersWithSameDeliveryDate(orderItemId , delieryDate ){
        
            
                let orderItemArry = this.orderForm.value.orderItems;
                for(let i in orderItemArry){
                    if(this.datePipe.transform(orderItemArry[i].requestedDeliveryDate ,'yyyy-MM-dd') ==  delieryDate && orderItemArry[i].orderItemId != orderItemId){
                            this.setChangedShippingRecipients(orderItemArry[i]);
                    }
                }
            
        
    }

    setChangedShippingRecipients(orderItemArry){
        let recipientList = orderItemArry.orderRecipients;
        for(let ind in recipientList){
            if(recipientList[ind].checkStatus == true){
                this.onChangeShippmentCombination(recipientList[ind].recipientId , this.datePipe.transform(orderItemArry.requestedDeliveryDate ,'yyyy-MM-dd'),orderItemArry.orderItemId);
            }
        }
    }

    placeOrder(statusValue,redirect) {
        this.checkForDeliverydateChange();
        this.shippmentChangeMap.forEach((x,y)=>{
            this.arrayVal.push(x)
        });
        console.log("arrayVal " , this.arrayVal);
        localStorage.setItem('isChangedShipping',JSON.stringify(this.arrayVal));
        this.redirect=redirect;
        this.modalShow = -1;
        this.orderForm.removeControl('orderShipping');
        this.isOrderPlaced = true;
        
        this.orderForm.value.orderStatusId = statusValue;
        this.orderForm.value.orderId = this.orderId;
        this.orderForm.value.clientId = this.clientID;
        this.orderForm.value.clientName = this.clientName;
        this.orderForm.value.discountedPrice = this.discountedPrice;
        this.orderForm.value.orderPrice = this.orderPrice;
        this.orderForm.value.shipmentCost = this.totalShippingCost;
        this.orderForm.value.taxAmount = this.taxAmount;
        //this.totalShippingCost = this.totalShippingCost;
        this.isError = false;
        this.isRecError = false;
        //this.shipmentCostError=false;
        if(this.orderForm.value.adminDiscount == null){
            this.orderForm.patchValue({adminDiscount: 0});
        }

        var unmanipulatedvalue = this.orderForm.value;
        var itemsArray = unmanipulatedvalue.orderItems;
        for (var i = 0; i < itemsArray.length; i++) {
            unmanipulatedvalue.orderItems[i].requestedDeliveryDate=this.datePipe.transform(unmanipulatedvalue.orderItems[i].requestedDeliveryDate, 'yyyy-MM-dd')
                for(let j in unmanipulatedvalue.orderItems[i].orderRecipients) {
                    unmanipulatedvalue.orderItems[i].orderRecipients[j].shipmentDate=this.datePipe.transform(unmanipulatedvalue.orderItems[i].orderRecipients[j].shipmentDate, 'yyyy-MM-dd')
                    /*if(unmanipulatedvalue.orderItems[i].orderRecipients[j].deliveryType=="" && unmanipulatedvalue.orderItems[i].orderRecipients[j].checkStatus==true) {


                        //this.shipmentCostError=true;
                        this.isError = true;
                        this.error=false;
                        this.isRecError=false;
                    }*/
                }
           
            if (statusValue == 2 || statusValue == 1) {
                 if(itemsArray[i].orderItemPrice == 0) {
                        this.isError = true;                        
                        this.isRecError=true;
                        this.successMessagePlaced = false;
                        this.successMessageSaved = false;
                  }
                  if(!itemsArray[i].requestedDeliveryDate){
                        this.isError = true;
                        this.error = true;
                        this.successMessagePlaced = false;
                        this.successMessageSaved = false;
                  }
              }
        }

        if (!(this.isError)) {
            this.placeorderservice.updateOrder(unmanipulatedvalue).subscribe(data => {
                    //this.refreshOrderList()
                    //window.scrollTo(0, 0);
                    this.isRecError = false;
                    this.error = false;
                    this.isError=false;
                    //this.shipmentCostError=false;
                    if(this.redirect==0){
                        localStorage.removeItem("orderID")
                        localStorage.removeItem("clientID")
                        localStorage.removeItem("clientName")

                    }
                    if (statusValue == 2) {
                        if(this.redirect==0) {
                        this.successMessageSaved = false
                        this.successMessagePlaced = true
                        }
                        else{
                            this.successMessagePlaced = false
                            this.router.navigate(['/order-payment']);
                        }
                        this.successMessageDelete = false;
                        this.isData = false;
                        this.itemCount = 0;
                        this.isCart = false;
                    }
                    else if (statusValue == 1){
                        if(this.redirect==0){
                        this.successMessageSaved = true
                        }
                        else{
                            this.successMessageSaved = false
                            this.router.navigate(['/order-payment']);
                        }
                        this.successMessagePlaced = false
                        this.successMessageDelete = false;
                        
                    }
                    this.refreshOrderList()
                },
                (err: HttpErrorResponse) => {
                    console.log('error')
                });
        }
    }

    hideMessage(status){
    if(!(this.isError)) {
            this.router.navigate(['/view']);
    }
        this.successMessagePlaced = false;
        this.isError = false;
        this.successMessageSaved = false;
        //this.showShippingModal = false;
    }

    removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
    }

    /*shippingModal(i) {
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



    hideModal(indexVal) {
        this.p=1;

        /*if(this.recipientListBk.length!=0){

            let recipients = this.recipientListBk[this.orderForm.value.orderItems[indexVal].itemId];
            this.orderItems.at(indexVal).patchValue({orderRecipients:recipients});
            this.orderItems.at(indexVal).patchValue({quantity:this.recipientListBkQuantity[this.orderForm.value.orderItems[indexVal].itemId]});
        }*/

        this.modalShow = -1;
    }


    sort(property){
        this.isDesc = !this.isDesc; //change the direction   
        this.column = property;
        this.direction = this.isDesc ? -1 : 1;
    }

    pageChanged(e){
        this.p=e;
    }

    next(){
        this.router.navigate(['/order-payment']);
    }

}




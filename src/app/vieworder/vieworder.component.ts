import {Component, OnInit, OnChanges, SimpleChanges, Input} from '@angular/core';
import {VieworderService} from '../service/vieworder.service';
import {ClientService} from '../service/client.service';
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";
import { Router } from '@angular/router';
import{ AppConstants} from '../constants';

@Component({
    selector: 'app-vieworder',
    templateUrl: './vieworder.component.html',
    styleUrls: ['./vieworder.component.css']
})
export class VieworderComponent implements OnInit {
    orders = []
    clients = ""
    clientName: any = ""
    filterData = ""
    orderStatus: any = ""
    selectedIndex = -1
    orderStatuses = ""
    selectedOrderStatus = ""
    fromDate = ""
    toDate = ""
    createdDate = ""
    p: number = 1;
    error = -1
    _baseURL =""

    errorStatus:any = ""
    isDeleteOrder:boolean=false;
    isDeleteOrderConfirm=false;
    orderIdForDelete:number = -1;
    isDeletedTrue:boolean=false;

    // Declare local variable
    direction: number = -1;
    isDesc:boolean = true;
    column = "";

    constructor(private VieworderService: VieworderService, private clientservice: ClientService, private spinnerService: Ng4LoadingSpinnerService,private router : Router) {
        this._baseURL = AppConstants.baseURL; 
    }

    ngOnInit() {
        this.spinnerService.show();
        this.VieworderService.orderStatus().subscribe(data => {
            this.orderStatuses = data.data;
            this.spinnerService.hide();
        });
        this.clientservice.clientList().subscribe(data => {
            this.clients = data.data
        });
        this.refreshStatus()
        this.column="orderId"
       }

    refreshStatus(){
        this.spinnerService.show();
        this.VieworderService.viewOrder().subscribe(data => {
            this.orders = data.data;
            this.spinnerService.hide();
        });
    }

    showStatus(evt, index) {
        this.selectedIndex = index;
    }

    downloadPdf(orderId){
      window.location.href =  this._baseURL+"order/downloadGiftTemplate?orderId="+orderId+"&token="+localStorage.getItem("Auth_Token");
    }

    
    // Change sort function to this: 
    sort(property){
        this.isDesc = !this.isDesc; //change the direction    
        this.column = property;
        this.direction = this.isDesc ? -1 : 1;
    }

    redirectPlaceOrder(orderID,clientId,orderStatusId,clientName) {
        if (orderStatusId ==2 || orderStatusId==1) {
            localStorage.setItem("orderID",orderID)
            localStorage.setItem("clientID", clientId)
            localStorage.setItem("clientName",clientName);
            this.router.navigate(['/placeorder/'+clientId+'/'+orderID]);
        }
    }
    redirectViewOrderDetail(orderID,clientId,orderStatusId,clientName){
        this.router.navigate(['/vieworderdetail/'+clientId+'/'+orderID]);
    }

    updateStatus(index,orderId,statusId, orderStatusId,orderPrice) {
        localStorage.removeItem("orderID")
        this.selectedIndex = -1
        if(statusId == "DRAFT"){
            if(orderStatusId==3 || orderStatusId==4 || orderStatusId==5){
                this.errorStatus = "Draft Status can only be changed to new, closed or cancelled";
            }
            if(orderPrice==0 && orderStatusId==2){
                this.errorStatus = "Status cannot be changed if order Item Price is 0"
            }

        }
        if(statusId == "NEW"){
            if(orderStatusId==1 || orderStatusId==4 || orderStatusId==5){
                this.errorStatus = "New Status can only be changed to approved closed or cancelled";
            }            
        }
        if(statusId == "APPROVED"){
            if(orderStatusId==1 || orderStatusId==2 || orderStatusId==4 || orderStatusId==5){
                this.errorStatus = "Approved Status can only be changed to closed or cancelled";
            }
            
        }
        if(statusId == "AWAITING_SHIPMENT"){
            if(orderStatusId==1 || orderStatusId==2 || orderStatusId==3 || orderStatusId==5){
                this.errorStatus = "Awaiting shipment can only be changed to closed and cancelled";
            }
            
        }
        if(statusId == "SHIPPED"){
            if(orderStatusId!=6){
                this.errorStatus = "Status can only be changed to closed";
            }
            
        }
        if(this.errorStatus==""){
        this.spinnerService.show();
            this.VieworderService.updateOrderStatus(orderId, orderStatusId).subscribe(data => {
                this.VieworderService.viewOrder().subscribe(data => {
                    this.orders = data.data;
                    this.spinnerService.hide();
                });
            });
        }

    }

    hideMessage(){
        this.errorStatus="";
        this.refreshStatus();
    }

    resetIndex(){
        this.selectedIndex = -1;
    }

    deleteOrder(orderId){
        this.isDeleteOrder=true;
        this.orderIdForDelete=orderId;
    }

    deleteOrderModal(isConfirm){
        this.isDeleteOrder=false;
        if(isConfirm){
            this.isDeleteOrderConfirm==true;
            //this.spinnerService.show();
            this.VieworderService.deleteOrder(this.orderIdForDelete).subscribe((data:any) => {
                if(data){
                           this.deleteSuccessMessage(true);
                            //this.spinnerService.hide();
                }
            });
            
        }
        else
        {
            this.isDeleteOrderConfirm==false;
        }

    }
    deleteSuccessMessage(isPopup){
        if(isPopup){
            this.isDeletedTrue=true;

        }
        else{
            this.isDeletedTrue=false;
        }
        
    }
}

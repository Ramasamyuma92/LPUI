import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse} from '@angular/common/http';
import { HeaderService } from '../service/header.service';
import{ AppConstants} from '../constants';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import { UserIdleService } from 'angular-user-idle';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  host: {'(document:click)': 'functionClick($event)',}
})
export class HeaderComponent implements OnInit {
 userName =''
 clientID = localStorage.getItem("clientID")
 orderId = localStorage.getItem("orderID")
 @Input() isCart:boolean;
 @Input() itemCount:number = 0;
 isDisable:string = "disabled"

  _baseURL : string;

 show:boolean = false;
 showExport:boolean = false;
 showOrder:boolean = false;
 showUser:boolean = false;
 showProduct:boolean=false;

 functionClick() {
    this.show = false 
    this.showExport= false
    this.showOrder = false;
    this.showUser=false
    this.showProduct=false;
 }

  today: number = Date.now();
  constructor(private headerservice : HeaderService,private router:Router,private spinnerService: Ng4LoadingSpinnerService,private userIdle: UserIdleService) {
    this._baseURL = AppConstants.baseURL;  
   }
  ngOnInit() {

    //Start watching for user inactivity.
    this.userIdle.startWatching();
    
    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => console.log(count));
    
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() =>{ 
    this.headerservice.logout().subscribe((data:any) => {
      if(data.requestStatus=="success"){
        localStorage.clear();
        this.spinnerService.hide();
        window.location.reload();        
        this.router.navigate(['/index']);
      }
   });
   });
    
    if(this.clientID){
      this.isDisable='';

    this.headerservice.draftCart(this.clientID,this.orderId).subscribe(data => {
    if(data.data!=null){
      if (data.data.orderStatus != null)
      {
        this.itemCount = data.data.orderItems.length;
        console.log('/placeorder/'+this.clientID+'/'+this.orderId)
        if(!(this.router.url=='/placeorder/'+this.clientID+'/'+this.orderId || this.router.url=='/placeorder' || this.router.url=='/selectgifts')){
          this.isCart=false;
          this.isDisable="disabled";
        }
        else{
          if(this.itemCount != 0){
                        this.isCart = true;
                        this.isDisable='';
                    }
                    else {
                        this.isCart = false;
                    }
        }

      }
      else {
        this.isCart = false;
      }
      }

    });
    }
    this.userName=localStorage.getItem("userName");

    if ((!localStorage.getItem('Auth_Token')) && (!(this.router.url === '/forgot-password')) && (!(this.router.url === '/reset-password'))) {
          console.log(this.router.url)
          this.router.navigate(['/']);
      }
  }

  stop() {
    this.userIdle.stopTimer();
  }
 
  stopWatching() {
    this.userIdle.stopWatching();
  }
 
  startWatching() {
    this.userIdle.startWatching();
  }
 
  restart() {
    this.userIdle.resetTimer();
  }

logout(){
   this.spinnerService.show();
   this.headerservice.logout().subscribe((data:any) => {
      if(data.requestStatus=="success"){
        localStorage.clear();
        this.spinnerService.hide();
        window.location.reload();        
        this.router.navigate(['/index']);
      }
   });

}
exportData(title){
  window.location.href =  this._baseURL+"/export/dataExport/"+title+"/"+localStorage.getItem("Auth_Token")
}
toggle(e,val) {
    e.preventDefault();
    e.stopPropagation();
    if (val=='org'){
    this.showExport=false
    this.showOrder=false
    this.show = !this.show;
    this.showUser=false
    this.showProduct=false;
    }
    if (val=='export'){
    this.show=false
    this.showOrder=false
    this.showExport=!this.showExport
    this.showUser=false
    this.showProduct=false;
    }
    if (val=='order'){
        this.show=false
        this.showExport=false
        this.showOrder=!this.showOrder
        this.showUser=false
        this.showProduct=false;
    }
    if (val=='user'){
        this.show=false
        this.showExport=false
        this.showOrder=false
        this.showUser=!this.showUser
        this.showProduct=false;
    }
    if (val=='product'){
        this.show=false
        this.showExport=false
        this.showOrder=false
        this.showUser=false
        this.showProduct=!this.showProduct
    }
}

}
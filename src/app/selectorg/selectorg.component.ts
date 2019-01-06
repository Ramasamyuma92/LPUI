import { Component, OnInit, Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ClientService } from '../service/client.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-selectorg',
  templateUrl: './selectorg.component.html',
  styleUrls: ['./selectorg.component.css']
})
export class SelectorgComponent implements OnInit {
  clientDivData="";
  testmodel : any;
  count = 1;
  clientdiv=''
  clients = ""
  divData =[];
  testcheck= "";
  selected : boolean = false
  sIndex: number = null;
  p: number = 1;
  constructor(private clientservice : ClientService, private spinnerService: Ng4LoadingSpinnerService, private router : Router, private sanitizer: DomSanitizer) {}
//  @Input('clientdiv') this.clientDivData:any

  ngOnInit() {
    this.spinnerService.show();
  	this.clientservice.clientList().subscribe(data => {
  		this.clients = data.data
      for(let client of this.clients){
        this.count++;
        this.spinnerService.hide();
      }
    });
  }
  
  
  onClick(clientId,clientName) {  
    this.selected = true
   	localStorage.setItem("clientID", clientId)
    localStorage.setItem("clientName", clientName)
    localStorage.removeItem("orderID")
    this.router.navigate(['/selectgifts']);
  }
}
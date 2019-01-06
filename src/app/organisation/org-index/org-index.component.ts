import { Component, OnInit } from '@angular/core';
import {OrganisationService} from '../../service/organisation.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-org-index',
  templateUrl: './org-index.component.html',
  styleUrls: ['./org-index.component.css']
})
export class OrgIndexComponent implements OnInit {

  clients = []
  clientName: any = ""
  filterData = ""
  p: number = 1;
  deleteConfirm = -1;


  constructor(private OrganisationService : OrganisationService,private spinnerService : Ng4LoadingSpinnerService) {
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
     this.OrganisationService.clientList().subscribe(data => {
      this.clients = data.data;
      this.spinnerService.hide();
    });
  }

  deletePopup(index){
        this.deleteConfirm = index
  }

  closeMessage(){
        this.deleteConfirm = -1
  }

  deleteOrganisation(index,clientId){
        this.OrganisationService.deleteOrganisation(clientId).subscribe(data => {
            this.deleteConfirm =-1
            this.reloadOrg()
        },
        (err : HttpErrorResponse)=>{
            console.log("Failed Deletion")
        });    
    }

}

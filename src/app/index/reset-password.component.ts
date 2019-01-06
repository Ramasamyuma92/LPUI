import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {ActivatedRoute} from "@angular/router";
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-index',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  isLoginError : boolean = false;
  token = ""

  constructor(private loginservice : LoginService,private route: ActivatedRoute, private router: Router,) {
	this.route.queryParams.subscribe(params => {
		this.token = params.token
		
	}); 
  }

  ngOnInit() {
    localStorage.clear();
  }

  OnSubmit(email,password) {
     this.loginservice.resetPassword(email,password,this.token).subscribe((data : any)=>{
		 
     if (data.requestStatus == "success") {
      	this.router.navigate(['/']);     
        }
     else {
     	  this.isLoginError = true;        
        }
    },
    (err : HttpErrorResponse)=>{
      this.isLoginError = true;      
    });
  }


  
}

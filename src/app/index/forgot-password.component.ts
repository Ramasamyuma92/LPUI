import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-index',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {
  isLoginError : boolean = false;
  constructor(private loginservice : LoginService,private router : Router) {}

  ngOnInit() {
    localStorage.clear();

  }

  OnSubmit(email) {
     this.loginservice.forgotPassword(email).subscribe((data : any)=>{
		 
     if (data.requestStatus == "success") {
		console.log(data.requestStatus)
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

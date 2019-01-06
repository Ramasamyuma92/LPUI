import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from '../service/login.service';
import { HeaderService } from '../service/header.service';

@Component({
  selector: 'app-index',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit {
  isLoginError : boolean = false;
  isPasswordError : boolean = false;
  isPasswordSameError : boolean = false;
  constructor(private loginservice : LoginService,private router : Router,private headerservice : HeaderService) {}

  ngOnInit() {
   

  }

  OnSubmit(email,password,newPassword,confirmPassword) {
    this.isPasswordError  =false;
    this.isLoginError  =false;
    this.isPasswordSameError  =false;
    if(newPassword != confirmPassword){
      this.isPasswordError  =true;
      return ;
    }
    if(newPassword == password){
      this.isPasswordSameError  =true;
      return ;
    }


     this.loginservice.changePassword(email,password,newPassword).subscribe((data : any)=>{
		 
     if (data.requestStatus == "success") {
      	this.headerservice.logout().subscribe((data:any) => {
          if(data.requestStatus=="success") {
            localStorage.clear();
            window.location.reload();        
            this.router.navigate(['/index']);
          }
       });    
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

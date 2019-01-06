import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse,HttpResponse} from '@angular/common/http';
import { LoginService } from '../service/login.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  isLoginError : boolean = false;
  token="";

  constructor(private loginservice : LoginService,private router : Router,private spinnerService: Ng4LoadingSpinnerService) {}

  ngOnInit() {
    if (localStorage.getItem('Auth_Token')) {
      this.router.navigate(['/selectorg']);
    }
    else {
      this.router.navigate(['/']);
    }

  }

  OnSubmit(userName,password) {
    this.spinnerService.show()
     this.loginservice.userAuthentication(userName,password).subscribe((data: HttpResponse<any>)=>{
        
     if (data.body.requestStatus == "success") {
        this.token = data.headers.get('token');
        localStorage.setItem("Auth_Token", this.token);
        localStorage.setItem("userName", data.body.data.firstName);
        this.spinnerService.hide()
        this.router.navigate(['/selectorg']);
        }
     else {
     	  this.isLoginError = true;
        localStorage.clear();
        this.spinnerService.hide()
        }
    },
    (err : HttpErrorResponse)=>{
      this.isLoginError = true;
      localStorage.clear();
      this.spinnerService.hide()
    });
  }


  
}

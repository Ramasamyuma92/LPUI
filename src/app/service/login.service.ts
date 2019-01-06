import { Injectable } from '@angular/core';
import{ AppConstants} from '../constants';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService {
 _baseURL : string;
  _token:any;
 constructor(private http: HttpClient) {
 	this._baseURL = AppConstants.baseURL;
 	this._token=AppConstants.Auth_Token;
 }
 public userAuthentication(email,password): Observable<any> {
        return this.http.post(this._baseURL+"user/login",{
			email:email,
			password:password
			},
			{observe: 'response' as 'body'}
		)
 }
 
   public changePassword(email,password,newPassword): Observable<any> {
        return this.http.post(this._baseURL+"user/changePassword",{
			email:email,
			password:password,
			newPassword:newPassword
			},this._token
		)
 }
 
  public resetPassword(email,password,token): Observable<any> {
        return this.http.post(this._baseURL+"user/resetPassword",{
			email:email,
			password:password,
			token: token
			}
		)
 }
 
 public forgotPassword(email): Observable<any> {
        return this.http.post(this._baseURL+"user/forgotPassword",{
			email:email			
			}
		)
 }

}

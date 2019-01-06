import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http'; 
import { Observable } from 'rxjs/Observable';
import{ AppConstants} from '../constants';

@Injectable()
export class HeaderService {
 _baseURL : string;
 _token:any;
 constructor(private http: HttpClient) {
 	this._baseURL = AppConstants.baseURL;
 	this._token=AppConstants.Auth_Token;
 }
 public draftCart(clientID,orderId): Observable<any> {
        return this.http.get(this._baseURL+"order/draftOrder/"+clientID+"/"+orderId,this._token)
 }

 public logout(): Observable<any> {
        return this.http.get(this._baseURL+"user/logout",this._token)
 }

}

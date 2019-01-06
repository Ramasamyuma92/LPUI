import { Injectable } from '@angular/core';
import { Headers } from '@angular/http'
import { HttpClient,HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs/Observable';
import{ AppConstants} from '../constants';


@Injectable()
export class ClientService {
 _baseURL : string;
 _token:any;
 constructor(private http: HttpClient) {
 	this._baseURL = AppConstants.baseURL;
 	this._token=AppConstants.Auth_Token;
 }
 public clientList(): Observable<any> {
        return this.http.get(this._baseURL+"client/clientList",this._token)
 }


}

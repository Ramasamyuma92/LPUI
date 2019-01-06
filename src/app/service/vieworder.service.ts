import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs/Observable';
import{ AppConstants} from '../constants';

@Injectable()
export class VieworderService {
 _baseURL : string;
 _token:any;
 constructor(private http: HttpClient) {
 	this._baseURL = AppConstants.baseURL;
 	this._token=AppConstants.Auth_Token;
 }
 public viewOrder(): Observable<any> {
        return this.http.get(this._baseURL+"order/viewOrders",this._token)
 }
  
 public orderStatus(): Observable<any> {
        return this.http.get(this._baseURL+"order/orderStatus",this._token)
 }

 public getClients(): Observable<any> {
        return this.http.get(this._baseURL+"client/clientList",this._token)
 }

 public updateOrderStatus(orderId,orderStatusId): Observable<any> {
        return this.http.post(this._baseURL+"order/updateOrderStatus",{
        	data: {"orderId":orderId, "orderStatusId":+orderStatusId}
        },this._token)
 }

 public deleteOrder(orderId): Observable<any> {
        return this.http.post(this._baseURL+"order/deleteOrder",{
        	data: {"orderId":orderId}
        },this._token)
 }

}

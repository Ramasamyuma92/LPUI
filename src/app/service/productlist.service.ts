import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs/Observable';
import{ AppConstants} from '../constants';

@Injectable()
export class ProductlistService {
 _baseURL : string;
  _token:any;
 constructor(private http: HttpClient) {
 	this._baseURL = AppConstants.baseURL;
 	this._token=AppConstants.Auth_Token;
 }

 public createProduct(data , file): Observable<any> {
       let formdata: FormData = new FormData();
       formdata.append('file' ,file);
       formdata.append('data' ,JSON.stringify(data));
       return this.http.post(this._baseURL+"item/createItem",formdata,this._token)
   }

   public deleteProduct(itemCode): Observable<any> {
      return this.http.delete(this._baseURL+"item/deleteItem/"+itemCode,this._token
    )
   }

   public updateProduct(data, file): Observable<any> {
      let formdata: FormData = new FormData();
       formdata.append('file' ,file);
       formdata.append('data' ,JSON.stringify(data));
      return this.http.post(this._baseURL+"item/updateItem",formdata,this._token)
   }

   public getProduct(id): Observable<any> {
        return this.http.get(this._baseURL+"item/getItem/"+id,this._token)
  }

 public productList(): Observable<any> {
        return this.http.get(this._baseURL+"item/itemList",this._token)
 }

  public productListWithSellable(): Observable<any> {
        return this.http.get(this._baseURL+"item/itemListWithOutSellable",this._token)
 }

 public addToCart(clientId,itemId,orderId): Observable<any> {
        return this.http.post(this._baseURL+"order/create",{
        	clientId: +clientId,
        	itemId: +itemId,
        	orderId: +orderId
        },this._token)
 }

 public upload(fileToUpload: any) {
    let input = new FormData();
    input.append("file", fileToUpload);

    return this.http.post("/api/uploadFile", input);
 }

}

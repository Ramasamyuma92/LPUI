import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs/Observable';
import{ AppConstants} from '../constants';

@Injectable()
export class RecipientService {

  _baseURL : string;
  _token:any;

  constructor(private http: HttpClient) { 
  	this._baseURL = AppConstants.baseURL;
    this._token=AppConstants.Auth_Token;
  }

   public createRecipient(data): Observable<any> {
        return this.http.post(this._baseURL+"recipient/create",{
  			data:data,
  			},
      this._token
		)
   }

   public deleteRecipient(clientId,recipientId): Observable<any> {
        return this.http.post(this._baseURL+"recipient/delete",{
        clientId:clientId,
        recipientId:recipientId
      },
      this._token
    )
   }

   public recipientList(id): Observable<any> {
        return this.http.get(this._baseURL+"recipient/recipientList/"+id,this._token)
  }

  public updateRecipient(data): Observable<any> {
        return this.http.post(this._baseURL+"recipient/update",{
			data:data,
			},
      this._token
		)
   }

  public getRecipient(id): Observable<any> {
        return this.http.get(this._baseURL+"recipient/getRecipient/"+id,this._token)
  }

}

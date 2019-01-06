import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs/Observable';
import{ AppConstants} from '../constants';

@Injectable()
export class OrganisationService {
  _baseURL : string;
  _token:any;

  constructor(private http: HttpClient) { 
  	this._baseURL = AppConstants.baseURL;
    this._token=AppConstants.Auth_Token;
  }

   public createOrganisation(data): Observable<any> {
        return this.http.post(this._baseURL+"client/create",{
			data:data,
			},
      this._token
		)
   }

   public deleteOrganisation(clientId): Observable<any> {
      return this.http.post(this._baseURL+"client/delete",{
        clientId:clientId
      },
      this._token
    )
   }

   public updateOrganisation(data): Observable<any> {
      return this.http.post(this._baseURL+"client/update",{
			data:data,
			},
      this._token
		)
   }

   public clientList(): Observable<any> {
        return this.http.get(this._baseURL+"client/clientList",this._token)
  }

  public getClient(id): Observable<any> {
        return this.http.get(this._baseURL+"client/getClient/"+id,this._token)
  }

  public getTaxRate(zipCode) : Observable<any>{
    return this.http.get(this._baseURL+"user/taxRate/"+zipCode,this._token)
  }

}

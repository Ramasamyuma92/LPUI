import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs/Observable';
import{ AppConstants} from '../constants';

@Injectable()
export class CsvImportService {
_baseURL : string;
apiURL : string;
 _token:any;

  constructor(private http: HttpClient) { 
  	this._baseURL = AppConstants.baseURL;
    this._token=AppConstants.Auth_Token;
  }

  public importClientCSV(data,headers): Observable<any> {
  		if(typeof headers.find(x => x=="branding_image_url") !== 'undefined')
  			this.apiURL = "import/client";
  		else if(typeof headers.find(x => x=="recipient_state") !== 'undefined')
  			this.apiURL = "import/recipient";
  		else if(typeof headers.find(x => x=="item_image") !== 'undefined')
  			this.apiURL = "import/item";
  		else if(typeof headers.find(x => x=="order_id") !== 'undefined')
  			this.apiURL = "import/order";
  		else
  			this.apiURL = "";
        return this.http.post(this._baseURL+this.apiURL,{
			data:JSON.parse(data),
			},
      this._token
		)
   }

}

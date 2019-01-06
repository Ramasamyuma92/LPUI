
import {Injectable} from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import{ AppConstants} from '../constants';

@Injectable()

export class PlaceorderService {
  _baseURL : string;
  _token:any;
  constructor(private http: HttpClient) {
    this._baseURL = AppConstants.baseURL;
    this._token=AppConstants.Auth_Token;
  }

  public orderList(clientID,orderId): Observable<any> {
    return this.http.get(this._baseURL+"order/draftOrder/" + clientID + "/" + orderId,this._token);
  }
  public recipientList(clientID): Observable<any> {
    return this.http.get(this._baseURL+"recipient/recipientList/" + clientID,this._token)
  }

  public addOrderRecipient(recipientId, orderItemId): Observable<any> {
    return this.http.post(this._baseURL+"order/addOrderRecipient/", {
      recipient: recipientId,
      orderItemId: orderItemId
    },
    this._token
    )

  }

  public addAllOrderRecipient(recipientData, orderItemId): Observable<any> {
    return this.http.post(this._baseURL+"order/addAllRecipients", {
      data: {'orderRecipients':recipientData, 'orderItemId':orderItemId} 
      
    },
    this._token
    )

  }
  public deleteAllOrderRecipient(orderItemId): Observable<any> {
    return this.http.get(this._baseURL+"order/deleteAllRecipients/" + orderItemId,this._token)

  }
  public deleteOrderRecipient(recipientId, orderItemId): Observable<any> {
    return this.http.post(this._baseURL+"order/deleteOrderRecipient/", {
      recipient: recipientId,
      orderItemId: orderItemId
    },
    this._token
    )

  }

  public saveOrder(message) {
    return this.http.post(this._baseURL+"order/create/", {
      message: message,

    },
    this._token
    )

  }
  
  public updateOrder(orderData) {
    return this.http.post(this._baseURL+"order/updateOrder", {
      data: orderData

    },
    this._token
    )

  }

  public deleteOrder(orderItemId) {
    return this.http.post(this._baseURL+"order/deleteOrderItem/", {
      orderItemId: orderItemId
    },
    this._token
    )
  }

  public shippingCost(serviceCode,packageCode,toState,toCountry,toPostalCode,toCity,value,units) {
    return this.http.post(this._baseURL+"/user/shippingCost/", {
      "serviceCode": serviceCode,
      "packageCode": null,
      "toState": toState,
      "toCountry": toCountry,
      "toPostalCode": toPostalCode,
      "toCity": toCity,
      "weight": {
        "value": value,
        "units": units
      }

    },
    this._token
    )
  }
  

  public shippingCostBulk(shippingRequestData) {
    return this.http.post(this._baseURL+"/user/fetchAllShippingCost/", {"shippingCostRequest":shippingRequestData},this._token)
  }

}

import { HttpHeaders } from '@angular/common/http';
export class AppConstants {
    public static get baseURL(): string {
        //return "http://giftingqa.mylolliandpops.com:8080/gifting/";
       // return "http://lolliandpops.encoress.com/lolliandpopweb/";
      return "http://localhost:8080/gifting/";
    }

    public static get _imageURL(): string {
        //return "http://giftingqa.mylolliandpops.com:8080";
        //return "http://lolliandpops.encoress.com";
      return "http://localhost:8080";
    }

    public static get Auth_Token(): string {
	    const httpOptions:any = {
		   headers: new HttpHeaders({
		    'token': localStorage.getItem('Auth_Token')
		   })
	    }
	    return httpOptions;
    }
}

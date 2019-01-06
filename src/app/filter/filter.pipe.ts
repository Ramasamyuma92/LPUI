import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {

   transform(orders: any, filters: any): any {
   if (filters && orders){
    return orders.filter(item => {
    return (item.clientName.indexOf(filters.clientName) >= 0 && item.orderStatus.indexOf(filters.orderStatus) >= 0);
    });
    }
    else {
    	return orders
    }
}
}
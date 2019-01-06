import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchFilter',
    pure: false
})
export class SearchFilterPipe implements PipeTransform {

   transform(orders: any[], filters?: any): any {
   if (filters && orders){
    return orders.filter(item => {
    return (item.value.firstName.toLowerCase().includes(filters.firstName.toLowerCase()));
    });
    }
    else {
    	return orders
    }
}
}
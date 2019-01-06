import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchOrgFilter',
    pure: false
})
export class SearchOrgFilter implements PipeTransform {

   transform(orders: any, filters: any): any {
   if (filters && orders){
        return orders.filter(item => {
            if (filters.clientName) {
                if (item.clientName == filters.clientName){ 
                    return item;
                }
            }
            else {
                return item;
            }
        });
    }
    else {
        return orders
    }
}
}
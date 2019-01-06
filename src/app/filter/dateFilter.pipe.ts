import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateFilter',
    pure: false
})
export class DateFilterPipe implements PipeTransform {

   transform(orders: any, filters: any): any {
   if (filters && orders){
        return orders.filter(item => {
            if (filters.fromDate && filters.toDate) {
                if (item.createdDate >= filters.fromDate && item.createdDate <= filters.toDate){ 
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
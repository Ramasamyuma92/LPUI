import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'productFilter',
    pure: false
})
export class ProductFilterPipe implements PipeTransform {

   transform(products: any[], filters?: any): any {
   if (filters && products){
    return products.filter(item => {
    return (item.name.toLowerCase().includes(filters.name.toLowerCase()));
    });
    }
    else {
    	return products
    }
}
}
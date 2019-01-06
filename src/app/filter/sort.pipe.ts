import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderBy',
    pure: false
})

export class OrderrByPipe implements PipeTransform {
    transform(orders: Array<any>, args?: any): any {
        return orders.sort(function(a:any, b:any){
            if(a.value){
                if(a.controls[args.property].value < b.controls[args.property].value){
                    return -1 * args.direction;
                }
                else if(a.controls[args.property].value > b.controls[args.property].value){
                    return 1 * args.direction;
                }
                else{
                    return 0;
                }
            }
            else{
                if(a[args.property] < b[args.property]){
                    return -1 * args.direction;
                }
                else if( a[args.property] > b[args.property]){
                    return 1 * args.direction;
                }
                else{
                    return 0;
                }
            }
        });
    };
}
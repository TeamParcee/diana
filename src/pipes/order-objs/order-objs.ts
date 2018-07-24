import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the OrderObjsPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'orderObjs',
})
export class OrderObjsPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(objs: any[]){
    return objs;
    
  }
  
}

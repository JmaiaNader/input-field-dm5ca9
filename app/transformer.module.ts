import { NgModule } from '@angular/core';
import { InputTransformerDirective } from './number-transformer.directive';

@NgModule({
  declarations: [InputTransformerDirective],
  exports: [InputTransformerDirective]
})
export class TransformerModule { }
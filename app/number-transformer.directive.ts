import { NgControl } from '@angular/forms';
import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Directive({
  selector: '[transform]',
  providers: [CurrencyPipe, DecimalPipe]
})
export class InputTransformerDirective implements OnInit {

  constructor(private el: ElementRef, private control: NgControl, private currencyPipe: CurrencyPipe, private decimalPipe: DecimalPipe) {
  }

  pipe;
  formattedAmount;
  value;

  @Input('conversion') conversionType = 'currency';
  @Input('pipeArgs') pipeArgs = null;

  @Input('transform') set transform(pipe: string) {
    switch (pipe) {
      case 'currency':
        this.pipe = this.currencyPipe;
        break;
      case 'decimal':
        this.pipe = this.decimalPipe;
        break;
      default:
        this.pipe = this.decimalPipe;
        break;
    }
  };

  ngOnInit() {
    let savedValue = this.el.nativeElement.value;
    if (savedValue) {
      this.transformValue(savedValue);
      this.setFormValues();
    }

  }

  @HostListener('blur', ['$event']) onBlur(event) {
    this.transformValue(event.target.value);
    this.setFormValues();
  }

  @HostListener('focus', ['$event']) onFocus($event) {
    this.untransformValue($event);
  }

  transformValue(value) {
    let inputValue = value.replace(/[$,]/g, '');
    inputValue = parseFloat(inputValue);

    if (isNaN(inputValue)) {
      this.value = null;
      this.formattedAmount = null;
      return;
    }

    this.formattedAmount = this.pipe.transform(inputValue, ...this.pipeArgs);
    this.value = inputValue;
  }

  untransformValue(event) {
    if (this.value != null) {
      event.target.value = this.value;
    }
  }

  setFormValues() {
    if (this.value === null) {
      this.control.control.setValue(undefined);
      this.control.valueAccessor.writeValue(null);
      return;
    }

    this.control.control.setValue(this.value);

    if (this.formattedAmount) {
      this.control.valueAccessor.writeValue(this.formattedAmount);
    }
  }
}

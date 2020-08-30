import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent implements OnInit {

  constructor() { }

  @Input('inputId') inputId;
  @Input('labelText') labelText;

  ngOnInit() {
  }

}

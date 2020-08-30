import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { TransformerModule } from './transformer.module';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, TransformerModule],
  declarations: [AppComponent, InputFieldComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

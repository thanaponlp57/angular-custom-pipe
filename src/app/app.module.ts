import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SumPipeModule } from './pipe/math/sum.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, SumPipeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { AppRoutingModule } from '../app-routing.module';


@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports: [
    NotFoundComponent
  ]
})
export class SharedModule { }

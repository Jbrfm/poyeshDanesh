import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { IconsProviderModule } from '../icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AppRoutingModule } from '../app-routing.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzSpinModule
  ],
  exports: [
    LayoutComponent
  ]
})
export class LayoutModule { }

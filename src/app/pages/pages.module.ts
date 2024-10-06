import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestComponent } from './request/request.component';
import { Page2Component } from './page2/page2.component';
import { Page3Component } from './page3/page3.component';
import { Page4Component } from './page4/page4.component';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgPersianDatepickerModule } from 'ng-persian-datepicker';
import { AddTagComponent } from './add-tag/add-tag.component';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';
import { SettingComponent } from './setting/setting.component';
import { AddReporterComponent } from './add-reporter/add-reporter.component';
import { KnowledgeComponent } from './knowledge/knowledge.component';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { KnowledgeListComponent } from './knowledge-list/knowledge-list.component';

@NgModule({
  declarations: [
    RequestComponent,
    Page2Component,
    Page3Component,
    Page4Component,
    AddTagComponent,
    SettingComponent,
    AddReporterComponent,
    KnowledgeComponent,
    ReportsListComponent,
    KnowledgeListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzPageHeaderModule,
    NzInputModule,
    NzDatePickerModule,
    NzSelectModule,
    NzTreeSelectModule,
    NzCheckboxModule,
    NzButtonModule,
    NzUploadModule,
    NzTimePickerModule,
    NzIconModule,
    NzRadioModule,
    NzTableModule,
    NzMessageModule,
    NzSpinModule,
    NgPersianDatepickerModule,
    AngularEditorModule
  ]
})
export class PagesModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page2Component } from './page2/page2.component';
import { Page3Component } from './page3/page3.component';
import { Page4Component } from './page4/page4.component';
import { RequestComponent } from './request/request.component';
import { AddTagComponent } from './add-tag/add-tag.component';
import { SettingComponent } from './setting/setting.component';
import { AddReporterComponent } from './add-reporter/add-reporter.component';
import { KnowledgeComponent } from './knowledge/knowledge.component';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { KnowledgeListComponent } from './knowledge-list/knowledge-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'experience', pathMatch: 'full' },
  { path: 'experience', component: RequestComponent },
  { path: 'tags', component: AddTagComponent },
  { path: 'report', component: Page2Component },
  { path: 'knowledge', component: KnowledgeComponent },
  { path: 'addReporter', component: AddReporterComponent },
  { path: 'experienceList', component: Page4Component },
  { path: 'reportsList', component: ReportsListComponent},
  { path: 'knowledgeList', component: KnowledgeListComponent},
  { path: 'setting', component: SettingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }

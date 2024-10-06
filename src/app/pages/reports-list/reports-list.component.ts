import { Component } from '@angular/core';
import { RequestService } from '../services/request.service';
import { TreeService, treeNode } from '../services/tree.service';
import { UsersService } from '../services/users.service';

import * as moment from 'jalali-moment';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent {
  isLoading = false;

  tree: treeNode[] = [];

  reporters: { value: number, label: string }[] = [];

  reports: any;

  constructor(
    private requestService: RequestService,
    private userService: UsersService,
    private treeService: TreeService
  ) { }

  ngOnInit(): void {
    this.getTree();
    this.getReporters();

    this.isLoading = true;
    setTimeout(() => {
      this.getReports();
    }, 500)
  }

  getReports() {
    this.isLoading = true;
    this.requestService.getReports()
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          for (var i = 0; i < res.length; i++) {
            // var m = moment(res[i].interview_date);

            // res[i].interview_date = m.format('jYYYY/jMM/jDD');

            res[i].reporter = this.findReporter(res[i].reporter);
            res[i].tree = this.findTreeTitle(res[i].tree);
          }

          this.reports = res;
        },
        () => {
          this.isLoading = false;
        });
  }

  getReporters() {
    this.userService.getReporters()
      .subscribe(res => {
        for (let i = 0; i < res.length; i++) {
          var tempTitle = res[i].first_name + ' ' + res[i].last_name + ' ' + '(' + res[i].position + ')';
          this.reporters.push({ value: res[i].id, label: tempTitle })
        }
      });
  }

  getTree() {
    this.treeService.getTree()
      .subscribe(
        res => {
          this.tree = res;
        }
      )
  }

  private findTreeTitle(id: number) {
    for (var i = 0; i < this.tree.length; i++) {
      if (this.tree[i].id === id) return this.tree[i].title;
    }

    return this.tree[i].id;
  }

  private findReporter(id: number) {
    for (var i = 0; i < this.reporters.length; i++) {
      if (this.reporters[i].value == id) return this.reporters[i].label
    }

    return -1;
  }

}

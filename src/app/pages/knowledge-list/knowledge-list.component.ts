import { Component } from '@angular/core';
import { Knowledge, KnowledgeService } from '../services/knowledge.service';
import { UsersService } from '../services/users.service';
import { TreeService, treeNode } from '../services/tree.service';

import * as moment from 'jalali-moment';

@Component({
  selector: 'app-knowledge-list',
  templateUrl: './knowledge-list.component.html',
  styleUrls: ['./knowledge-list.component.scss']
})
export class KnowledgeListComponent {
  isLoading = false;

  tree: treeNode[] = [];

  reporters: { value: number, label: string }[] = [];

  knowledges: Knowledge[];

  constructor(
    private knowledgeService: KnowledgeService,
    private userService: UsersService,
    private treeService: TreeService
  ) { }

  ngOnInit(): void {
    this.getTree();
    this.getReporters();

    this.isLoading = true;
    setTimeout(() => {
      this.getKnowlodeges();
    }, 500)
  }

  getKnowlodeges() {
    this.isLoading = true;
    this.knowledgeService.getKnowledges()
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          for (var i = 0; i < res.length; i++) {
            var m = moment(res[i].interview_date);

            res[i].interview_date = m.format('jYYYY/jMM/jDD');
            res[i].reporter = this.findReporter(res[i].reporter);
            res[i].tree = this.findTreeTitle(res[i].tree);
          }

          this.knowledges = res;
        },
        () => {
          this.isLoading = false;
        })
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

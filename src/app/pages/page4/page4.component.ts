import { Component, OnInit } from '@angular/core';
import { RequestService } from '../services/request.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UsersService } from '../services/users.service';
import { TreeService, treeNode } from '../services/tree.service';

import * as moment from 'jalali-moment';

interface experience {
  title: string,
  subject: string,
  experience_date: string,
  reporter: string,
  tree: string,
  reason: string
}

@Component({
  selector: 'app-page4',
  templateUrl: './page4.component.html',
  styleUrls: ['./page4.component.scss']
})
export class Page4Component implements OnInit {
  isloading = false;

  tree: treeNode[] = [];

  reporters: { value: number, label: string }[] = [];

  listOfData: experience[] = [];

  constructor(
    private requestService: RequestService,
    private userService: UsersService,
    private treeService: TreeService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.getTree();
    this.getReporters();

    this.isloading = true;
    setTimeout(() => {
      this.getRequests();
    }, 500)
  }

  getRequests() {
    this.isloading = true
    this.requestService.getExperience()
      .subscribe(
        (res: any) => {
          this.isloading = false;
          for (var i = 0; i < res.length; i++) {
            var m = moment(res[i].experience_date);

            res[i].experience_date = m.format('jYYYY/jMM/jDD');
            res[i].reporter = this.findReporter(res[i].reporter);
            res[i].tree = this.findTreeTitle(res[i].tree);
          }

          this.listOfData = res;
        },
        () => {
          this.isloading = false;
          this.message.error(' مشکلی در گرفتن اطلاعات به وجود آمد ')
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

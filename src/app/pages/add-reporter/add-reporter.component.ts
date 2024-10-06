import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-add-reporter',
  templateUrl: './add-reporter.component.html',
  styleUrls: ['./add-reporter.component.scss']
})
export class AddReporterComponent implements OnInit {
  isLoading = false;
  reportersLoading = false;

  reporters: { value: number, label: string }[] = [];

  evidenceList = ['دیپلم', 'فوق دیپلم', 'لیسانس', 'فوق لیسانس', 'دکترا', 'فوق دکترا']

  reporterForm = new FormGroup({
    first_name: new FormControl('', [
      Validators.required
    ]),
    last_name: new FormControl('', [
      Validators.required
    ]),
    position: new FormControl(),
    national_code: new FormControl(),
    evidence: new FormControl(),
    phone: new FormControl(),
    email: new FormControl()
  })

  removeReporterForm = new FormGroup({
    reporterId: new FormControl(null, [
      Validators.required
    ])
  })

  constructor(
    private userService: UsersService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.getReporters();
  }

  onAddReporter() {
    if (!this.reporterForm.valid) {
      this.message.error(' فیلد نام و نام خانوادگی را پر کنید')
      return
    }

    if (this.reporterForm.controls['email'].value === "") this.reporterForm.controls['email'].setValue(null);

    this.isLoading = true;

    this.userService.addReporter(this.reporterForm.value)
      .subscribe(
        () => {
          this.isLoading = false;
          this.message.success("گزارش دهنده اضافه شد");
          this.getReporters();
          this.reporterForm.reset();
        },
        () => {
          this.message.error("مشکلی در اضافه کردن کاربر به وجود آمد");
          this.isLoading = false;
        }
      );
  }

  onDeleteUser() {
    if (this.removeReporterForm.invalid) {
      this.message.error('کاربری را جهت حذف انتخاب کنید ');
      return
    }

    this.userService.deleteReporter(this.removeReporterForm.controls['reporterId'].value)
      .subscribe(
        () => {
          this.isLoading = false;
          this.message.success("کاربر حذف شد");
          this.getReporters();
          this.removeReporterForm.reset();
        },
        () => {
          this.isLoading = false;
          this.message.error('مشکلی در حذف کاربر به وجود آمد');
        }
      );
  }

  getReporters() {
    this.reportersLoading = true;

    this.userService.getReporters()
      .subscribe(
        res => {
          this.reportersLoading = false;
          for (let i = 0; i < res.length; i++) {
            var tempTitle = res[i].first_name + ' ' + res[i].last_name + ' ' + '(' + res[i].position + ')';
            this.reporters.push({ value: res[i].id, label: tempTitle })
          }
        },
        error => {
          this.reportersLoading = false;
          console.log(error);
        }
      );
  }
}

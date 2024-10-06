import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UsersService } from '../services/users.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent {
  isLoading = false;

  form = new FormGroup({
    new_password1: new FormControl('', [
      Validators.required
    ]),
    new_password2: new FormControl('', [
      Validators.required
    ])
  })

  constructor(
    private userService: UsersService,
    private message: NzMessageService
  ) {

  }

  onSubmit() {
    if (!this.form.valid) {
      this.message.error(' فیلدها را پر کنید ');
      return
    }

    if (this.form.value.new_password1 !== this.form.value.new_password2) {
      this.message.error("رمز و تایید رمز یکسان نیستند");
      return
    }

    this.isLoading = true;

    this.userService.changePassword(this.form.value)
      .subscribe(
        res => {
          this.isLoading = false;
          this.message.success("رمز با موفقیت تغییر یافت");
          this.form.reset();
        },
        () => {
          this.isLoading = false;
          this.message.error("مشکلی در تغییر رمز به وجود آمد");
        })
  }

  onReset() {
    this.form.reset();
  }
}

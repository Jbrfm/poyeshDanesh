import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent {
  isLoading = false;

  form = new FormGroup({
    username: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  })

  constructor(
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  onSubmit(): void {
    if (!this.form.valid) return

    this.isLoading = true;    

    this.authService.login(this.form.value)
      .subscribe(
        res => {
          this.isLoading = false;
          this.message.success(" وارد شدید ");
          this.router.navigateByUrl("/dashboard/experience");
        },
        err => {
          this.isLoading = false;
          if (err.status === 400) this.message.error(" کاربری با این مشخصات وجود ندارد ");
          else this.message.error(" مشکلی در ورود پیش آمده ")
        }
      )
  }
}

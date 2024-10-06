import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TagsService } from '../services/tags.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent {
  isloading = false;
  isSubmited = false;

  tags: { value: number, label: string }[] = [];

  addFrom = new FormGroup({
    title: new FormControl('', [
      Validators.required
    ])
  })

  deleteForm = new FormGroup({
    id: new FormControl([], [
      Validators.required
    ])
  })

  ngOnInit(): void {
    this.getTags();
  }

  constructor(
    private tagsService: TagsService,
    private message: NzMessageService
  ) { }

  onSubmit() {
    if (!this.addFrom.valid) {
      this.isSubmited = true
      this.message.error(' فیلد برچسب را پر کنید ')
      return
    }

    this.isloading = true;
    this.tagsService.addTag(this.addFrom.value)
      .subscribe(
        () => {
          this.isloading = false;
          this.message.success(' برچشسب اضافه شد ')
          this.addFrom.reset();

          this.getTags();
        },
        () => {
          this.isloading = false;
          this.message.error(' مشکلی در اضافه کردن برچشسب به وجود آمد ')
        }
      )
  }

  onDelete() {
    if (this.deleteForm.invalid) {
      this.message.error(' لطفا برچسب مورد نظر جهت حذف را انتخاب کنید ')
      return
    }

    var id = this.deleteForm.controls['id'].value;

    this.isloading = true;
    this.tagsService.deleteTag(id)
      .subscribe(
        () => {
          this.deleteForm.reset();
          this.message.success(' برچسب حذف شد ');
          this.isloading = false;

          this.getTags();
        },
        () => {
          this.message.error(' مشکلی در حذف برچسب به وجود آمد ');
          this.isloading = false;
        }
      );
  }

  getTags() {
    this.tags = [];
    this.tagsService.getTags()
      .subscribe(res => {
        for (let i = 0; i < res.length; i++) {
          this.tags.push({ value: res[i].id, label: res[i].title });
        }
      })
  }

}

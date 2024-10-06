import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { RequestService } from '../services/request.service'
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-page3',
  templateUrl: './page3.component.html',
  styleUrls: ['./page3.component.scss']
})
export class Page3Component implements OnInit {
  isloading = false;

  requests: { id: number, title: string }[] = []

  form = new FormGroup({
    title: new FormControl('', [
      Validators.required
    ])
  })

  constructor(
    private message: NzMessageService,
    public requestService: RequestService
  ) { }

  ngOnInit() {
    this.requestService.getExperience()
      .subscribe(res => {
        for (var i = 0; i < res.length; i++) {
          this.requests.push({id: res[i].id, title: res[i].title})
        }
      })
  }

  customUpload = (item: any) => {
    const formData = new FormData();
    formData.append('main', this.form.controls['title'].value);
    formData.append('file', item.file);

    return this.requestService.uploadFile(formData)
      .subscribe(
        res => {
          console.log(res);
          item.onSuccess(res)
        },
        err => {
          console.log(err);
        });
  }

  // files
  movieFileList: NzUploadFile[] = [];
  soundFileList: NzUploadFile[] = [];
  imageFileList: NzUploadFile[] = [];
  documentFileList: NzUploadFile[] = [];
}

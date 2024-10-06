import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TreeService, ngTreeNodes, treeNode } from '../services/tree.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UsersService } from '../services/users.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { RequestService } from '../services/request.service';
import { TagsService } from '../services/tags.service';

import * as moment from 'jalali-moment';
import { Observable, of } from 'rxjs';

interface treeNodes {
  id: number,
  title: string,
  root_code: number
}

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.scss']
})
export class Page2Component implements OnInit {
  isLoading = false;
  isSubmited = false;
  isValid = false;

  tree: treeNode[] = [];
  expandKeys = ['1'];
  nodes: ngTreeNodes[];
  titleOptions: { value: number, label: string }[] = [];
  subjectOptions: { value: number, label: string }[] = [];

  tags: { value: number, label: string }[] = [];

  reporters: { value: number, label: string }[] = [];

  requests: { id: number, title: string }[] = []

  selectedTags: string[] = [];
  reportId: number;

  reportForm = new FormGroup({
    title: new FormControl('', [
      Validators.required
    ]),
    subject: new FormControl('', [
      Validators.required
    ]),
    report_text: new FormControl('', [
      Validators.required
    ]),
    abstract: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl(''),
    reporter: new FormControl(''),
    user: new FormControl(''),
    selectedTags: new FormControl(),
    tree: new FormControl('')
  })

  constructor(
    private treeService: TreeService,
    private userService: UsersService,
    private message: NzMessageService,
    private tagService: TagsService,
    private requestService: RequestService
  ) { }

  ngOnInit(): void {
    this.getTree()
    this.getReporters();
    this.getReports();
    this.getTags()

    this.reportForm.controls['title'].valueChanges.subscribe((res) => {
      this.reportForm.controls['subject'].setValue("");
      this.subjectOptions = this.makeSubjectOptions(parseInt(res));
    })
  }

  onReportSubmit() {
    if (this.reportForm.invalid) {
      this.message.error(' فیلدها را پر کنید ')
      return
    }

    var title = this.titleOptions.find(item => item.value == parseInt(this.reportForm.controls['title'].value))

    this.reportForm.patchValue({
      title: title.label,
      tree: this.reportForm.controls['subject'].value,
      reporter: this.reportForm.controls['user'].value
    })
    this.reportForm.removeControl('subject');
    this.reportForm.removeControl('user');

    this.selectedTags = this.reportForm.controls['selectedTags'].value;

    if (!this.reportForm.valid) {
      this.message.error(' فیلدها را پر کنید ');
      return
    }

    this.isLoading = true;
    this.requestService.addReport(this.reportForm.value)
      .subscribe(
        (res: any) => {
          this.message.success('گزارش اضافه شد');

          this.tempTags(res.id);

          this.uploadFiles(res.id);

          this.isLoading = false;
          this.reportForm.reset();

          this.getReports();
        },
        () => {
          this.isLoading = false;
          this.message.error(' مشکلی در ثبت تجریه ایجاد شد ');
        }
      )
  }

  tempTags(id: number) {
    for (var i = 0; i < this.selectedTags.length; i++) {
      this.requestService.addExperienceTag({ tag: this.selectedTags[i], report: id, experience: null })
        .subscribe();
    }
  }

  onReset() {
    this.reportForm.reset();
    this.imageFileList = [];
    this.movieFileList = [];
    this.soundFileList = [];
    this.documentFileList = [];
  }

  fileList: NzUploadFile[] = [];

  onPrint() {
    window.print()
  }

  getTree() {
    this.treeService.getTree().subscribe(res => {
      this.tree = res;
      this.nodes = this.treeService.makeNgTreeNodes(res, 0);
      this.titleOptions = this.makeTitleOptions();
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

  getReports() {
    this.requestService.getReports()
      .subscribe((res: any) => {
        for (var i = 0; i < res.length; i++) {
          var m = moment(res[i].created_at)
          var title = res[i].title + ' ' + m.format('jYYYY/jMM/jDD HH:mm')

          this.requests.push({ id: res[i].id, title: title })
        }
      })
  }

  getTags() {
    this.tagService.getTags()
      .subscribe(res => {
        for (let i = 0; i < res.length; i++) {
          this.tags.push({ value: res[i].id, label: res[i].title });
        }
      })
  }

  private makeTitleOptions() {
    var result = [];
    for (let i = 0; i < this.tree.length; i++) {
      if (this.tree[i].root_code === 1) result.push({ value: this.tree[i].id, label: this.tree[i].title })
    }
    return result
  }
  private makeSubjectOptions(selectedTitle: number) {
    var result = [];

    for (let i = 0; i < this.tree.length; i++) {
      if (this.tree[i].root_code == selectedTitle) result.push({ value: this.tree[i].id, label: this.tree[i].title })
    }
    return result;
  }

  /// upload

  beforeUploadImage = (file: NzUploadFile): Observable<boolean> => {
    this.imageFileList.push(file);

    this.message.info(`فایلی با نام ${file.name} به لیست آپلود اضافه شد`)

    return of(false);
  };

  beforeUploadMovie = (file: NzUploadFile): Observable<boolean> => {
    this.movieFileList.push(file);

    this.message.info(`فایلی با نام ${file.name} به لیست آپلود اضافه شد`)

    return of(false);
  };

  beforeUploadSound = (file: NzUploadFile): Observable<boolean> => {
    this.soundFileList.push(file);

    this.message.info(`فایلی با نام ${file.name} به لیست آپلود اضافه شد`)

    return of(false);
  };

  beforeUploadDocument = (file: NzUploadFile): Observable<boolean> => {
    this.documentFileList.push(file);

    this.message.info(`فایلی با نام ${file.name} به لیست آپلود اضافه شد`)

    return of(false);
  };

  imageFileList: NzUploadFile[] = [];
  movieFileList: NzUploadFile[] = [];
  soundFileList: NzUploadFile[] = [];
  documentFileList: NzUploadFile[] = [];

  uploadFiles(id: number) {
    var uploadList = this.imageFileList.concat(this.movieFileList, this.soundFileList, this.documentFileList);

    for (var i = 0; i < uploadList.length; i++) {
      console.log(uploadList[i]);

      var formData: any = new FormData();
      formData.append('report', id);
      formData.append('name', uploadList[i].name)
      formData.append('file', uploadList[i]);

      this.requestService.uploadFile(formData)
        .subscribe(
          (res: any) => {
            this.message.success(`فایل ${res.name} آپلود شد`)
          },
          error => {
            this.message.error(`مشکلی در آپلود به وجود آمد`)
          });
    }
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '100px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    enableToolbar: true,
    placeholder: 'متن خود را وارد کنید',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '4',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadWithCredentials: false,
    sanitize: true,
    toolbarHiddenButtons: [
      ['undo', 'redo', 'strikeThrough', 'fontName'],
      ['textColor', 'fontSize', 'backgroundColor', 'customClasses', 'link', 'unlink', 'insertImage', 'insertVideo', 'insertHorizontalRule', 'removeFormat', 'toggleEditorMode']
    ]
  };
}

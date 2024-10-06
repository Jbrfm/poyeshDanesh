import { Component } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { TreeService, ngTreeNodes, treeNode } from '../services/tree.service';
import { UsersService } from '../services/users.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '../services/request.service';
import { TagsService } from '../services/tags.service';
import * as moment from 'jalali-moment';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent {
  treeLoaded = false;
  reporterLoaded = false;
  isLoading = false;

  isSubmited = false;

  tree: treeNode[] = [];
  expandKeys = ['1'];
  nodes: ngTreeNodes[];
  titleOptions: { value: number, label: string }[] = [];
  subjectOptions: { value: number, label: string }[] = [];

  requests: { id: number, title: string }[] = []

  reporters: { value: number, label: string }[] = [];

  tags: { value: number, label: string }[] = [];

  experienceId: number;

  selectedTags: string[] = [];

  form = new FormGroup({
    title: new FormControl('', [
      Validators.required
    ]),
    subject: new FormControl('', [
      Validators.required
    ]),
    experience_date: new FormControl('', [
      Validators.required
    ]),
    reason: new FormControl('', [
      Validators.required
    ]),
    decision: new FormControl('', [
      Validators.required
    ]),
    achievement: new FormControl('', [
      Validators.required
    ]),
    is_success: new FormControl(true),
    description: new FormControl('', [
      Validators.required
    ]),
    reporter: new FormControl(''),
    tree: new FormControl(''),
    user: new FormControl('', [
      Validators.required
    ]),
    selectedTags: new FormControl([])
  })

  uploadForm = new FormGroup({
    title: new FormControl('', [
      Validators.required
    ])
  })

  constructor(
    private treeService: TreeService,
    private userService: UsersService,
    private requestService: RequestService,
    private tagServices: TagsService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.getTree();
    this.getReporters();
    this.getExperience();
    this.tagServices.getTags()
      .subscribe(res => {
        for (let i = 0; i < res.length; i++) {
          this.tags.push({ value: res[i].id, label: res[i].title });
        }
      })

    this.form.controls['title'].valueChanges.subscribe((res) => {
      this.form.controls['subject'].setValue("");
      this.subjectOptions = this.makeSubjectOptions(parseInt(res));
    })
  }

  onReset() {
    this.form.reset();
  }

  onPrint() {
    window.print()
  }

  onUploadReset() {
    this.uploadForm.reset()
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmited = true;
      this.message.error(' اطلاعات وارد شده صحیح نیست ');
      return
    }

    var m = moment(this.form.controls['experience_date'].value, 'jYYYY-jM-jD')

    this.form.patchValue({
      reporter: this.form.controls['user'].value,
      tree: this.form.controls['subject'].value,
      experience_date: m.format('YYYY-MM-DD'),
      title: this.tree.find(node => node.id === parseInt(this.form.controls['title'].value)).title,
      subject: this.tree.find(node => node.id === parseInt(this.form.controls['subject'].value)).title
    })

    this.isLoading = true;
    this.requestService.addExperience(this.form.value)
      .subscribe(
        (result) => {
          this.message.success(' تجربه اضافه شد ');

          this.tempTags(result.id);

          this.uploadFiles(result.id);

          this.isLoading = false;
          this.form.reset();
          this.selectedTags = [];

          setTimeout(() => {
            this.getExperience();
          }, 200)

        },
        err => {
          this.isLoading = false;
          this.message.error(' مشکلی در ثبت تجریه ایجاد شد ');
        })
  }

  //////

  /////upload

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
      var formData: any = new FormData();
      formData.append('experience', id);
      formData.append('name', uploadList[i].name);
      formData.append('file', uploadList[i]);

      this.requestService.uploadFile(formData)
        .subscribe(
          (res: any) => {
            console.log(res);
            this.message.success(`فایل ${res.name} آپلود شد`);
          },
          error => {
            console.log(error);
            this.message.error(`مشکلی در آپلود به وجود آمد`)
          });
    }
  }

  //upload File
  fileList: NzUploadFile[] = [];

  customUpload = (item: any) => {
    const formData = new FormData();
    formData.append('experience', this.uploadForm.controls['title'].value);
    formData.append('file', item.file);

    return this.requestService.uploadFile(formData)
      .subscribe(
        res => {
          item.onSuccess(res)
        },
        err => {
          console.log(err);
        });
  }

  tempTags(id: number) {
    for (var i = 0; i < this.selectedTags.length; i++) {
      this.requestService.addExperienceTag({ tag: this.selectedTags[i], experience: id, report: null })
        .subscribe();
    }
  }

  getExperience() {
    this.requestService.getExperience()
      .subscribe(res => {
        for (var i = 0; i < res.length; i++) {
          var m = moment(res[i].created_at)
          var title = res[i].subject + ' ' + m.format('jYYYY/jMM/jDD HH:mm')

          this.requests.push({ id: res[i].id, title: title })
        }
      })
  }

  getReporters() {
    this.userService.getReporters()
      .subscribe(res => {
        for (let i = 0; i < res.length; i++) {
          var tempTitle = res[i].first_name + ' ' + res[i].last_name + ' ' + '(' + res[i].position + ')';
          this.reporters.push({ value: res[i].id, label: tempTitle })
        }
        this.reporterLoaded = true;
      });
  }

  getTree() {
    this.treeService.getTree().subscribe(res => {
      this.tree = res;
      this.nodes = this.treeService.makeNgTreeNodes(res, 0);
      this.treeLoaded = true;
      this.titleOptions = this.makeTitleOptions();
    });
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

  editorConfigReason: AngularEditorConfig = {
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

  editorConfigDecision: AngularEditorConfig = {
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

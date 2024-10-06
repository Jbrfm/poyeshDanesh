import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { TreeService, ngTreeNodes, treeNode } from '../services/tree.service';
import { KnowledgeService } from '../services/knowledge.service';
import { NzUploadChangeParam, NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EMPTY, Observable, concat, of, timeInterval } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrls: ['./knowledge.component.scss']
})
export class KnowledgeComponent {
  isLoading = false;
  reporterLoading = false;

  reporters: { value: number, label: string }[] = [];

  tree: treeNode[] = [];
  titleOptions: { value: number, label: string }[] = [];
  subjectOptions: { value: number, label: string }[] = [];

  knowledgeForm = new FormGroup({
    title: new FormControl('', [
      Validators.required
    ]),
    start: new FormControl(),
    end: new FormControl(),
    interview_date: new FormControl(),
    interview_text: new FormControl(),
    subject: new FormControl('', [
      Validators.required
    ]),
    reporter: new FormControl(),
    tree: new FormControl(),
    startTime: new FormControl(),
    endTime: new FormControl()
  })

  constructor(
    private userService: UsersService,
    private knowledgeService: KnowledgeService,
    private treeService: TreeService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.getReporters();
    this.getTree();

    this.knowledgeForm.controls['title'].valueChanges.subscribe((res) => {
      this.knowledgeForm.controls['subject'].setValue("");
      this.subjectOptions = this.makeSubjectOptions(parseInt(res));
    })
  }

  onSubmit() {
    if (!this.knowledgeForm.valid) {
      this.message.error(' فیلدها را پر کنید ');
      return
    }

    var m = moment(this.knowledgeForm.controls['interview_date'].value, 'jYYYY-jM-jD')

    var tempStart = this.knowledgeForm.controls['startTime'].value;
    var tempEnd = this.knowledgeForm.controls['endTime'].value;

    this.knowledgeForm.patchValue({
      tree: this.knowledgeForm.controls['subject'].value,
      title: this.tree.find(node => node.id === parseInt(this.knowledgeForm.controls['title'].value)).title,
      subject: this.tree.find(node => node.id === parseInt(this.knowledgeForm.controls['subject'].value)).title,
      interview_date: m.format('YYYY-MM-DD'),
      start: this.makeTimeFormat(tempStart),
      end: this.makeTimeFormat(tempEnd)
    })

    this.knowledgeForm.removeControl('startTime');
    this.knowledgeForm.removeControl('endTime');

    this.knowledgeService.addKnowledge(this.knowledgeForm.value)
      .subscribe(
        (res: any) => {
          this.uploadFiles(res.id);

          setTimeout(() => {
            this.onReset();
          }, 500);

          this.message.success(`اطلاعات با موفقیت ثبت شد`);
        },
        () => {
          this.message.error("مشکلی در وارد کردن اطلاعت به وجود آمد")
        }
      );
  }

  onReset() {
    this.knowledgeForm.reset();
    this.imageFileList = [];
    this.movieFileList = [];
    this.soundFileList = [];
    this.documentFileList = [];
  }

  onPrint() {
    window.print()
  }

  getReporters() {
    this.reporterLoading = true;
    this.userService.getReporters()
      .subscribe(res => {
        for (let i = 0; i < res.length; i++) {
          var tempTitle = res[i].first_name + ' ' + res[i].last_name + ' ' + '(' + res[i].position + ')';
          this.reporters.push({ value: res[i].id, label: tempTitle })
        }
        this.reporterLoading = true;
      });
  }

  getTree() {
    this.treeService.getTree().subscribe(res => {
      this.tree = res;
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

  private makeTimeFormat(time: Date) {
    var hour = time.getHours()
    var min = time.getMinutes();

    var res = hour + ':' + min;

    return res;
  }

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
      formData.append('interview', id);
      formData.append('name', uploadList[i].name)
      formData.append('file', uploadList[i]);

      this.knowledgeService.uploadFile(formData)
        .subscribe(
          (res: any) => {
            this.message.success(`فایل ${res.name} آپلود شد`)
          },
          error => {
            this.message.error(`مشکلی در آپلود به وجود آمد`)
          }
        );
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

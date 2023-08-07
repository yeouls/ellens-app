import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { DefaultData } from '../model/default-data';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { IUploadList } from '../model';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements AfterViewInit {
  acceptedFileFormats: string[] = ['.xlsx'];
  
  mainFileList: NzUploadFile[] = [];
  teacherFileList: NzUploadFile[] = [];
  studentFileList: NzUploadFile[] = [];

  infoActive: boolean = true;
  mainActive: boolean = false;
  teacherActive: boolean = false;
  studentActive: boolean = false;

  readonly nzModalData: IUploadList = inject(NZ_MODAL_DATA);

  constructor(private defaultData : DefaultData, private message: NzMessageService) {
  }

  ngAfterViewInit() {
    this.mainFileList = this.nzModalData.mainFileList;
    this.teacherFileList = this.nzModalData.teacherFileList;
    this.studentFileList = this.nzModalData.studentFileList;
  }

  addFileList(info: NzUploadChangeParam, type: string) {
    if(info.type == 'start' && info.file.status == 'uploading') {
      const file = {...info.file};
      if(type == 'MAIN') {
        file.status = 'done';
        this.mainFileList = [];
        this.mainFileList.push(file);
        this.mainActive = this.mainFileList.length > 0;
      } else if (type == 'TEACHER') {
        file.status = 'done';
        if(this.teacherFileList.length < this.defaultData.teacherFileOrder.length) {
          this.teacherFileList.push(file);
        } else {
          this.message.error('파일을 추가할수 없습니다');
        }  
        this.teacherActive = this.teacherFileList.length > 0;     
      } else if (type == 'STUDENT') {
        file.status = 'done';
        if(this.studentFileList.length < this.defaultData.studentResponseOrder.length) {
          this.studentFileList.push(file);
        } else {
          this.message.error('파일을 추가할수 없습니다');
        } 

        this.studentActive = this.studentFileList.length > 0;
      }
    }
  }

  removeFile(file: NzUploadFile, type: string) {
    if(type == 'MAIN') {
      this.mainFileList = this.mainFileList.filter(f => f !== file);
    } else if (type == 'TEACHER') {
      this.teacherFileList = this.teacherFileList.filter(f => f !== file);
    } else if (type == 'STUDENT') {
      this.studentFileList = this.studentFileList.filter(f => f !== file);
    }
  }
}

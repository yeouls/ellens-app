import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import * as XLSX from 'xlsx';
import { AttendanceSheet, GymSheet, MainInfo, PersonalSheet, ProblemSheet, RabSheet, SubjectSheet, TeacherSheetName } from './model';
import { DefaultData } from './model/default-data';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UploadFileComponent } from './upload-file/upload-file.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  current_module: string = '2023_M2';
  columns: string[] = []
  columnDefs: ColDef[] = [];

  // DefaultColDef sets props common to all Columns
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  mainfileList: NzUploadFile[] = [];
  teacherfileList: NzUploadFile[] = [];
  studentFileList: NzUploadFile[] = [];

  teacherSheetNames: string[] = [];
  teacherData: any = {};
  mainData: any[] = [];
  studentData: any = {};
  
  studentResponse: string[] = [];
  teacherFile: string[] = [];
  
  public rowData: any[] = [];

  constructor(private defaultData : DefaultData, private modal: NzModalService) {}

  ngOnInit() {
    this.columns = this.defaultData.columns;
    this.studentResponse = this.defaultData.studentResponseOrder;
    this.teacherFile = this.defaultData.teacherFileOrder;

    this.teacherSheetNames = Object.keys(TeacherSheetName).filter(key => isNaN(Number(key)));
    this.teacherSheetNames.forEach(key => {
      this.teacherData[key] = [];
    });

    this.columns.forEach(x =>  {
      this.columnDefs.push({field: x});
    })
  }

  createModal() {
    const tempModal: any = this.modal.create({
      nzTitle: 'update file', 
      nzContent: UploadFileComponent,
      nzWidth: '700px',
      nzData: {
        mainFileList: this.mainfileList,
        teacherFileList: this.teacherfileList,
        studentFileList: this.studentFileList
      },
      nzFooter: [
        {
          label: '취소',
          onClick: () => tempModal.destroy()
        }, 
        {
          label: '적용',
          onClick: (component: UploadFileComponent) => {
            this.mainfileList = component.mainFileList;
            this.teacherfileList = component.teacherFileList;
            this.studentFileList = component.studentFileList;
            this.uploadFileList();
            tempModal.destroy();
          }
        }
      ]
    })
  }

  disableCreate() {
    return this.mainfileList.length > 0 && this.teacherfileList.length > 0 && this.studentFileList.length > 0;
  }

  uploadFileList() {
    this.mainfileList.forEach(f => this.fileReader(f, 'MAIN'));
    this.teacherfileList.forEach(f => this.fileReader(f, 'TEACHER'));
    this.studentFileList.forEach(f => this.fileReader(f, 'STUDENT'));
  }

  fileReader(files: any, type: string) {
    let fileName ='';
    if(type == 'TEACHER') {
      const index = parseInt(files.name.substring(1,3));
      fileName = this.teacherFile[index-1];
    } else if(type == 'STUDENT'){
      const index = parseInt(files.name.substring(1,3));
      fileName = this.studentResponse[index-1];
    }
    const file = {...files};

    const reader = new FileReader;
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      this.workbookToJsonArray(workbook, type, fileName);
    }
    reader.readAsArrayBuffer(file.originFileObj as any);

    file.status = 'done';
  }

  workbookToJsonArray(workbook: XLSX.WorkBook, type: string, fileName: string) {
    workbook.SheetNames.forEach(name => {
      if (type == 'TEACHER') {
        if (this.teacherSheetNames.includes(name)) {
          const roa = XLSX.utils.sheet_to_json(workbook.Sheets[name], {});
          if (roa.length > 0) {
            let data: any[] = roa.filter((x: any) => Object.keys(x).length > 6);
            if (name.includes('혜화')) {
              data = data.map(x => {
                return {...x, '작성교사' : fileName };
              })
            }
            
            console.log(fileName, name, data);
            this.teacherData[name] = [...this.teacherData[name], ...data];
          }
        }
      } else if (type == 'MAIN') {
        if (name.includes(this.current_module)) {
          const roa = XLSX.utils.sheet_to_json(workbook.Sheets[name], {});
          if (roa.length > 0) {
            this.mainData = roa.filter((x: any) => x['코칭 교사'] != '휴학');
          }
        }
      } else if (type == 'STUDENT') {
        const roa = XLSX.utils.sheet_to_json(workbook.Sheets[name], {});
        if (roa.length > 0) {
          this.studentData[fileName] = roa;
        }
      }
    });
  }

  changeEvent() {
    const resultData: MainInfo[] = [];
    //main data 
    for (let index = 0; index < this.mainData.length; index++) {
      const element = this.mainData[index];
      const data: any = {};
      const name = element['이름'];
      const nickname = element['닉네임'];
      data['NO'] = index +1;
      data['입학 구분'] = element['입학 구분'];
      data['이름'] = name;
      data['닉네임'] = nickname;
      data['코칭 교사'] = element['코칭 교사'];
      data['오전교육과정'] = element['오전'];
      data['오후교육과정'] = element['오후'];

      //teacher
      for (let j = 0; j < this.teacherSheetNames.length; j++) {
        const sheetName = this.teacherSheetNames[j];
        switch (sheetName) {
          case TeacherSheetName['출석 기록']:
            const sheet1: AttendanceSheet[] = this.teacherData[sheetName];
            const sheet1Data = sheet1.filter(x => x['닉네임'] == nickname && x['이름'] == name).shift();
            if(sheet1Data) {
              data['수업일수'] = sheet1Data['전체수업일수']? sheet1Data['전체수업일수'] : 46 ;
              data['결석'] = sheet1Data['결석'];
              data['지각'] = sheet1Data['지각'];
              data['조퇴'] = sheet1Data['조퇴'];
              data['공결'] = sheet1Data['공결'];
              data['병결'] = sheet1Data['병결'];
              data['병지각'] = sheet1Data['병지각'];
              data['병조퇴'] = sheet1Data['병조퇴'];
            }
            break;
          case TeacherSheetName['혜화랩 교과']:
            const sheet2: RabSheet[] = this.teacherData[sheetName];
            const sheet2Data = sheet2.filter(x => x['닉네임'] == nickname && x['이름'] == name);
            for (let k = 0; k < sheet2Data.length; k++) {
              const temp = sheet2Data[k];
              if(temp['작성교사'] == '수선') {
                data['국어이수'] = temp['이수여부']? temp['이수여부'] : '이수';
                data['수선개요'] = temp['교과 수업 개요'];
                data['수선교사'] = temp['교과 교사 측정'];
              } else if (temp['작성교사'] == '히치'){
                data['영어이수'] = temp['이수여부'];
                data['히치개요'] = temp['교과 수업 개요'];
                data['히치교사'] = temp['교과 교사 측정'];
              } else if (temp['작성교사'] == '예티'){
                data['영어이수'] = temp['이수여부'];
                data['예티개요'] = temp['교과 수업 개요'];
                data['예티교사'] = temp['교과 교사 측정'];
              } else if (temp['작성교사'] == '단테'){
                data['수학이수'] = temp['이수여부'];
                data['단테개요'] = temp['교과 수업 개요'];
                data['단테교사'] = temp['교과 교사 측정'];
              } else if (temp['작성교사'] == '몰라'){
                data['수학이수'] = temp['이수여부'];
                data['몰라개요'] = temp['교과 수업 개요'];
                data['몰라교사'] = temp['교과 교사 측정'];
              } else if (temp['작성교사'] == '도령'){
                data['사회이수'] = temp['이수여부'];
                data['도령개요'] = temp['교과 수업 개요'];
                data['도령교사'] = temp['교과 교사 측정'];
              } else if (temp['작성교사'] == '은열'){
                data['역사이수'] = temp['이수여부'];
                data['은열개요'] = temp['교과 수업 개요'];
                data['은열교사'] = temp['교과 교사 측정'];
              } else if (temp['작성교사'] == '라라'){
                data['과학이수'] = temp['이수여부'];
                data['라라개요'] = temp['교과 수업 개요'];
                data['라라교사'] = temp['교과 교사 측정'];
              } 
            }

            break;
          case TeacherSheetName['마케팅랩']:
            const sheet3: RabSheet[] = this.teacherData[sheetName];
            const sheet3Data = sheet3.filter(x => x['닉네임'] == nickname && x['이름'] == name).shift();
            if(sheet3Data) {
              data['1랩개요'] = sheet3Data['교과 수업 개요'];
              data['1랩교사'] = sheet3Data['교과 교사 측정'];
              data['2랩이수'] = sheet3Data['이수여부'];
            }
            break;
          case TeacherSheetName['코딩랩']:
            const sheet4: RabSheet[] = this.teacherData[sheetName];
            const sheet4Data = sheet4.filter(x => x['닉네임'] == nickname && x['이름'] == name).shift();
            if(sheet4Data) {
              data['2랩개요'] = sheet4Data['교과 수업 개요'];
              data['2랩교사'] = sheet4Data['교과 교사 측정'];
              data['2랩이수'] = sheet4Data['이수여부'];
            }
            break;
          case TeacherSheetName['체육']:
            const sheet5: GymSheet[] = this.teacherData[sheetName];
            const sheet5Data = sheet5.filter(x => x['닉네임'] == nickname && x['이름'] == name).shift();
            if(sheet5Data) {
              data['체육개요'] = sheet5Data['체육 수업 개요'];
              data['체육이수'] = sheet5Data['이수여부'];
            }
            break;
          case TeacherSheetName['주제중심']:
            const sheet6: SubjectSheet[] = this.teacherData[sheetName];
            const sheet6Data = sheet6.filter(x => x['닉네임'] == nickname && x['이름'] == name).shift();
            if(sheet6Data) {
              data['주제이수'] = sheet6Data['이수여부'];
              data['주제교사'] = sheet6Data['교사 총평'];
            }
            break;
          case TeacherSheetName['개인주제']:
            const sheet7: PersonalSheet[] = this.teacherData[sheetName];
            const sheet7Data = sheet7.filter(x => x['닉네임'] == nickname && x['이름'] == name).shift();
            if(sheet7Data) {
              data['개인주제이수'] = sheet7Data['이수여부'];
              data['개인교사'] = sheet7Data['개인주제 교사 측정'];
            }
            break;
          case TeacherSheetName['문제정의']:
            const sheet8: ProblemSheet[] = this.teacherData[sheetName];
            const sheet8Data = sheet8.filter(x => x['닉네임'] == nickname && x['이름'] == name).shift();
            if(sheet8Data) {
              data['자율이수'] = sheet8Data['이수여부'];
              data['문제교사'] = sheet8Data['교사 측정'];
            }
            break;
          default:
            break;
        }
      }

      //student
      for (let m = 0; m < this.studentResponse.length; m++) {
        const sheet = this.studentResponse[m];
        if(sheet == '개인') {
          const sheet1: any[] = this.studentData[sheet];
          const sheet1Data = sheet1.filter(x => x['닉네임'] == nickname && x['이름'] == name).shift();
          if(sheet1Data) {
            data['개인개요'] = sheet1Data['개인개요'];
            data['개인학생'] = sheet1Data['개인학생'];
          }
        } else if (sheet == '문제') {
          const sheet1: any[] = this.studentData[sheet];
          const sheet1Data = sheet1.filter(x => x['닉네임'] == nickname && x['이름'] == name).shift();
          if(sheet1Data) {
            data['문제개요'] = sheet1Data['문제개요'];
            data['문제학생'] = sheet1Data['문제학생'];
          }
        } else if (sheet == '알파') {
          const sheet1: any[] = this.studentData[sheet];
          const sheet1Data = sheet1.filter(x => x['닉네임'] == nickname && x['이름'] == name).shift();
          if(sheet1Data) {
            if(sheet1Data['알파랩'] == '마케팅랩') {
              data['1랩학생'] = sheet1Data['알파랩학생1'];
            } else {
              data['2랩학생'] = sheet1Data['알파랩학생2'];
            }
          }
        } else {
          const sheet1: any[] = this.studentData[sheet];
          const sheet1Data = sheet1.filter(x => x['닉네임'] == nickname && x['이름'] == name).shift();
          if(sheet1Data) {
            data['라라학생'] = sheet1Data['라라'];
            data['수선학생'] = sheet1Data['수선'];
            data['도령학생'] = sheet1Data['도령'];
            data['단테학생'] = sheet1Data['단테'];
            data['은열학생'] = sheet1Data['은열'];
            data['히치학생'] = sheet1Data['히치'];
            data['예티학생'] = sheet1Data['예티'];
            data['몰라학생'] = sheet1Data['몰라'];
            data['주제개요'] = sheet1Data['주제개요'];
            data['주제학생'] = sheet1Data['주제학생'];
          }
        }
      }


      resultData.push(data);
    }

    this.rowData = resultData;
  }

  exportexcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rowData,{header: this.columns});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'resultExcel.xlsx');
  }

}

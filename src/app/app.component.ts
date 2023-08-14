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
export class AppComponent implements OnInit {
  private gridApi!: GridApi;

  moduleList: string[] = [];
  current_module: string = '2023_M1,2023_M2';
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
  mainData: any = {};
  studentData: any = {};

  studentResponse: string[] = [];
  teacherFile: string[] = [];

  public rowData: any[] = [];

  constructor(private defaultData: DefaultData, private modal: NzModalService) { }

  ngOnInit() {
    this.moduleList = this.current_module.split(',');
    this.setDefault();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  setDefault() {
    this.teacherData = {};
    this.mainData = {};
    this.studentData = {};
    this.columnDefs = [];

    this.columns = this.defaultData.keyColumns;
    for (let index = 1; index < this.moduleList.length + 1; index++) {
      this.columns = [...this.columns, ...this.defaultData.columns.map(x => index + x)];
      this.studentResponse = [...this.studentResponse, ...this.defaultData.studentResponseOrder.map(x => index + x)];
      this.teacherFile = [...this.teacherFile, ...this.defaultData.teacherFileOrder.map(x => index + x)];
    }

    this.teacherSheetNames = Object.keys(TeacherSheetName).filter(key => isNaN(Number(key)));
    this.teacherSheetNames.forEach(key => {
      this.teacherData[key] = [];
    });

    this.columns.forEach(x => {
      this.columnDefs.push({ field: x });
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
    this.moduleList = this.current_module.split(',');
    this.setDefault();

    this.mainfileList.forEach(f => this.fileReader(f, 'MAIN'));
    this.teacherfileList.forEach(f => this.fileReader(f, 'TEACHER'));
    this.studentFileList.forEach(f => this.fileReader(f, 'STUDENT'));
  }

  fileReader(files: any, type: string) {
    let fileName = '';
    if (type == 'TEACHER') {
      const index = parseInt(files.name.substring(1, 3));
      fileName = this.teacherFile[index - 1];
    } else if (type == 'STUDENT') {
      const index = parseInt(files.name.substring(1, 3));
      fileName = this.studentResponse[index - 1];
    }
    const file = { ...files };

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
            let data: any[] = [];
            if (name.includes('혜화')) {
              data = roa.filter((x: any) => x['교과 교사 측정'] != null);
              data = data.map(x => {
                return { ...x, '작성교사': fileName, moduleIndex: fileName.substring(0, 1) };
              });
            } else {
              data = roa.filter((x: any) => Object.keys(x).length > 6);
              data = data.map(x => {
                return { ...x, moduleIndex: fileName.substring(0, 1) };
              })
            }

            console.log(fileName, name, data);
            this.teacherData[name] = [...this.teacherData[name], ...data];
          }
        }
      } else if (type == 'MAIN') {
        const moduleIndex = this.current_module.split(',').find(x => name.includes(x));
        if (moduleIndex) {
          const roa = XLSX.utils.sheet_to_json(workbook.Sheets[name], {});
          if (roa.length > 0) {
            this.mainData[moduleIndex] = roa.filter((x: any) => !x['코칭 교사']?.includes('휴학'));
          }
        }
      } else if (type == 'STUDENT') {
        const roa: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[name], {});
        if (roa.length > 0) {
          this.studentData[fileName] = roa.map(x => {
            return { ...x, moduleIndex: fileName.substring(0, 1) };
          });
        }
      }
    });
  }

  changeEvent() {
    const resultData: MainInfo[] = [];
    const baseDataList = this.mainData[this.moduleList[0]];
    //main data 
    for (let index = 0; index < baseDataList.length; index++) {
      const element = baseDataList[index];
      const data: any = {};
      const name = element['이름'].replace('\b', '');
      const nickname = element['닉네임'].replace('\b', '');
      data['NO'] = index + 1;
      data['입학 구분'] = element['입학 구분'];
      data['이름'] = name;
      data['닉네임'] = nickname;

      for (let p = 0; p < this.moduleList.length; p++) {
        const moduleName = this.moduleList[p];
        const elementList: any[] = this.mainData[moduleName];
        const pData = elementList.filter(x => x['닉네임'] == nickname && x['이름'] == name).shift();
        if (pData) {
          data[(p + 1) + '코칭 교사'] = pData['코칭 교사'].replace('\b', '');
          data[(p + 1) + '오전교육과정'] = pData['오전'].replace('\b', '');
          data[(p + 1) + '오후교육과정'] = pData['오후'].replace('\b', '');
          continue;
        }
      }

      //teacher
      for (let j = 0; j < this.teacherSheetNames.length; j++) {
        const sheetName = this.teacherSheetNames[j];
        if (sheetName == TeacherSheetName['출석 기록']) {
          const sheet1: AttendanceSheet[] = this.teacherData[sheetName];
          const sheet1Data = sheet1.filter(x => x['닉네임'] == nickname && x['이름'] == name);
          if (sheet1Data.length > 0) {
            for (let p = 0; p < sheet1Data.length; p++) {
              const element = sheet1Data[p];
              const moduleIndex = element.moduleIndex;
              data[moduleIndex + '수업일수'] = element['전체수업일수'];
              data[moduleIndex + '결석'] = element['결석'];
              data[moduleIndex + '지각'] = element['지각'];
              data[moduleIndex + '조퇴'] = element['조퇴'];
              data[moduleIndex + '공결'] = element['공결'];
              data[moduleIndex + '병결'] = element['병결'];
              data[moduleIndex + '병지각'] = element['병지각'];
              data[moduleIndex + '병조퇴'] = element['병조퇴'];
            }
          }
        } else if (sheetName == TeacherSheetName['혜화랩 교과']) {
          const sheet2: RabSheet[] = this.teacherData[sheetName];
          const sheet2Data = sheet2.filter(x => x['닉네임'] == nickname && x['이름'] == name);
          for (let k = 0; k < sheet2Data.length; k++) {
            const temp = sheet2Data[k];
            const moduleIndex = temp.moduleIndex;
            if (temp['작성교사']?.includes('수선')) {
              data[moduleIndex + '국어이수'] = temp['이수여부'] ? temp['이수여부'] : '이수';
              data[moduleIndex + '수선개요'] = temp['교과 수업 개요'];
              data[moduleIndex + '수선교사'] = temp['교과 교사 측정'];
            } else if (temp['작성교사']?.includes('히치')) {
              data[moduleIndex + '영어이수'] = temp['이수여부'];
              data[moduleIndex + '히치개요'] = temp['교과 수업 개요'];
              data[moduleIndex + '히치교사'] = temp['교과 교사 측정'];
            } else if (temp['작성교사']?.includes('예티')) {
              data[moduleIndex + '영어이수'] = temp['이수여부'];
              data[moduleIndex + '예티개요'] = temp['교과 수업 개요'];
              data[moduleIndex + '예티교사'] = temp['교과 교사 측정'];
            } else if (temp['작성교사']?.includes('단테')) {
              data[moduleIndex + '수학이수'] = temp['이수여부'];
              data[moduleIndex + '단테개요'] = temp['교과 수업 개요'];
              data[moduleIndex + '단테교사'] = temp['교과 교사 측정'];
            } else if (temp['작성교사']?.includes('몰라')) {
              data[moduleIndex + '수학이수'] = temp['이수여부'];
              data[moduleIndex + '몰라개요'] = temp['교과 수업 개요'];
              data[moduleIndex + '몰라교사'] = temp['교과 교사 측정'];
            } else if (temp['작성교사']?.includes('도령')) {
              data[moduleIndex + '사회이수'] = temp['이수여부'];
              data[moduleIndex + '도령개요'] = temp['교과 수업 개요'];
              data[moduleIndex + '도령교사'] = temp['교과 교사 측정'];
            } else if (temp['작성교사']?.includes('은열')) {
              data[moduleIndex + '역사이수'] = temp['이수여부'];
              data[moduleIndex + '은열개요'] = temp['교과 수업 개요'];
              data[moduleIndex + '은열교사'] = temp['교과 교사 측정'];
            } else if (temp['작성교사']?.includes('라라')) {
              data[moduleIndex + '과학이수'] = temp['이수여부'];
              data[moduleIndex + '라라개요'] = temp['교과 수업 개요'];
              data[moduleIndex + '라라교사'] = temp['교과 교사 측정'];
            }
          }

        } else if (sheetName == TeacherSheetName['V.lab']) {
          const sheet3: RabSheet[] = this.teacherData[sheetName];
          const sheet3Data = sheet3.filter(x => x['닉네임'] == nickname && x['이름'] == name).shift();
          if (sheet3Data) {
            data['V.lab개요'] = sheet3Data['교과 수업 개요'];
            data['V.lab교사'] = sheet3Data['교과 교사 측정'];
            data['V.lab이수'] = sheet3Data['이수여부'];
          }
        } else if (sheetName == TeacherSheetName['M.lab']) {
          const sheet4: RabSheet[] = this.teacherData[sheetName];
          const sheet4Data = sheet4.filter(x => x['닉네임'] == nickname && x['이름'] == name).shift();
          if (sheet4Data) {
            data['M.lab개요'] = sheet4Data['교과 수업 개요'];
            data['M.lab교사'] = sheet4Data['교과 교사 측정'];
            data['M.lab이수'] = sheet4Data['이수여부'];
          }
        } else if (sheetName == TeacherSheetName['마케팅랩']) {
          const sheet9: RabSheet[] = this.teacherData[sheetName];
          const sheet9Data = sheet9.filter(x => x['닉네임'] == nickname && x['이름'] == name).shift();
          if (sheet9Data) {
            data['마케팅랩개요'] = sheet9Data['교과 수업 개요'];
            data['마케팅랩교사'] = sheet9Data['교과 교사 측정'];
            data['마케팅랩이수'] = sheet9Data['이수여부'];
          }
        } else if (sheetName == TeacherSheetName['코딩랩']) {
          const sheet10: RabSheet[] = this.teacherData[sheetName];
          const sheet10Data = sheet10.filter(x => x['닉네임'] == nickname && x['이름'] == name).shift();
          if (sheet10Data) {
            data['코딩랩개요'] = sheet10Data['교과 수업 개요'];
            data['코딩랩교사'] = sheet10Data['교과 교사 측정'];
            data['코딩랩이수'] = sheet10Data['이수여부'];
          }
        } else if (sheetName == TeacherSheetName['체육']) {
          const sheet5: GymSheet[] = this.teacherData[sheetName];
          const sheet5Data = sheet5.filter(x => x['닉네임'] == nickname && x['이름'] == name);
          if (sheet5Data.length > 0) {
            for (let p = 0; p < sheet5Data.length; p++) {
              const element = sheet5Data[p];
              const moduleIndex = element.moduleIndex;
              data[moduleIndex + '체육개요'] = element['체육 수업 개요'];
              data[moduleIndex + '체육이수'] = element['이수여부'];
            }
          }
        } else if (sheetName == TeacherSheetName['주제중심']) {
          const sheet6: SubjectSheet[] = this.teacherData[sheetName];
          const sheet6Data = sheet6.filter(x => x['닉네임'] == nickname && x['이름'] == name);
          if (sheet6Data.length > 0) {
            for (let p = 0; p < sheet6Data.length; p++) {
              const element = sheet6Data[p];
              const moduleIndex = element.moduleIndex;
              data[moduleIndex + '주제이수'] = element['이수여부'];
              data[moduleIndex + '주제교사'] = element['교사 총평'];
            }
          }
        } else if (sheetName == TeacherSheetName['개인주제']) {
          const sheet7: PersonalSheet[] = this.teacherData[sheetName];
          const sheet7Data = sheet7.filter(x => x['닉네임'] == nickname && x['이름'] == name);
          if (sheet7Data.length > 0) {
            for (let p = 0; p < sheet7Data.length; p++) {
              const element = sheet7Data[p];
              const moduleIndex = element.moduleIndex;
              data[moduleIndex + '개인주제이수'] = element['이수여부'];
              data[moduleIndex + '개인교사'] = element['개인주제 교사 측정'];
            }
          }
        } else if (sheetName == TeacherSheetName['문제정의']) {
          const sheet8: ProblemSheet[] = this.teacherData[sheetName];
          const sheet8Data = sheet8.filter(x => x['닉네임'] == nickname && x['이름'] == name);
          if (sheet8Data.length > 0) {
            for (let p = 0; p < sheet8Data.length; p++) {
              const element = sheet8Data[p];
              const moduleIndex = element.moduleIndex;
              data[moduleIndex + '문제정의이수'] = element['이수여부'];
              data[moduleIndex + '문제교사'] = element['교사 측정'];
            }
          }
        }
      }

      //student
      for (let m = 0; m < this.studentResponse.length; m++) {
        const sheet = this.studentResponse[m];
        if (sheet.includes('개인')) {
          const sheet1: any[] = this.studentData[sheet];
          const sheet1Data = sheet1.filter(x => x['닉네임'] == nickname && x['이름'] == name);
          if (sheet1Data.length > 0) {
            for (let p = 0; p < sheet1Data.length; p++) {
              const element = sheet1Data[p];
              const moduleIndex = element.moduleIndex;
              data[moduleIndex+'개인개요'] = element['개인개요'];
              data[moduleIndex+'개인학생'] = element['개인학생'];
            }
          }
        } else if (sheet.includes('문제')) {
          const sheet1: any[] = this.studentData[sheet];
          const sheet1Data = sheet1.filter(x => x['닉네임'] == nickname && x['이름'] == name);
          if (sheet1Data.length > 0) {
            for (let p = 0; p < sheet1Data.length; p++) {
              const element = sheet1Data[p];
              const moduleIndex = element.moduleIndex;
              data[moduleIndex+'문제개요'] = element['문제개요'];
              data[moduleIndex+'문제학생'] = element['문제학생'];
            }
          }
        } else if (sheet.includes('알파')) {
          const sheet1: any[] = this.studentData[sheet];
          const sheet1Data = sheet1.filter(x => x['닉네임'] == nickname && x['이름'] == name);
          if (sheet1Data.length > 0) {
            for (let p = 0; p < sheet1Data.length; p++) {
              const element = sheet1Data[p];
              const moduleIndex = element.moduleIndex;
              if (element['알파랩'] == '마케팅랩') {
                data['마케팅랩학생'] = element['알파랩학생1'];
              } else if (element['알파랩'] == '코딩랩') {
                data['코딩랩학생'] = element['알파랩학생2'];
              } else if (element['알파랩'] == 'V.lab') {
                data['V.lab학생'] = element['알파랩학생1'];
              } else if (element['알파랩'] == 'M.lab') {
                data['M.lab학생'] = element['알파랩학생2'];
              }
            }
          }
        } else {
          const sheet1: any[] = this.studentData[sheet];
          const sheet1Data = sheet1.filter(x => x['닉네임'] == nickname && x['이름'] == name);
          if (sheet1Data.length > 0) {
            for (let p = 0; p < sheet1Data.length; p++) {
              const element = sheet1Data[p];
              const moduleIndex = element.moduleIndex;
              data[moduleIndex + '라라학생'] = element['라라'];
              data[moduleIndex + '수선학생'] = element['수선'];
              data[moduleIndex + '도령학생'] = element['도령'];
              data[moduleIndex + '단테학생'] = element['단테'];
              data[moduleIndex + '은열학생'] = element['은열'];
              data[moduleIndex + '히치학생'] = element['히치'];
              data[moduleIndex + '예티학생'] = element['예티'];
              data[moduleIndex + '몰라학생'] = element['몰라'];
              data[moduleIndex + '주제개요'] = element['주제개요'];
              data[moduleIndex + '주제학생'] = element['주제학생'];
            }
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

  exportcsv(): void {
    this.gridApi.exportDataAsCsv();
  }
}

import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { MainInfo, TeacherSheetName } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  columnDefs: ColDef[] = [
    { field: '구분'},
    { field: '입학기준'},
    { field: '이름' },
    { field: '닉네임' }
  ];
  acceptedFileFormats: string[] = ['.xlsx'];
  // selectedTearchFileList: NzUploadFile[] = [];

  // DefaultColDef sets props common to all Columns
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  teacherSheetNames: string[] = [];
  teacherData: any = {};
  
  public rowData: any[] = [];

  constructor() {}

  ngOnInit() {
    this.teacherSheetNames = Object.keys(TeacherSheetName).filter(key => isNaN(Number(key)));
    this.teacherSheetNames.forEach(key => {
      this.teacherData[key] = [];
    })
  }

  // Example load data from server
  onGridReady(params: GridReadyEvent) {
    // this.#gridApi = params.api;
  }

  addFileList(event: NzUploadChangeParam, type: string) {
    if(event.type == 'start' && event.file.status == 'uploading') {
      this.fileReader(event.file, type);
    }
  }

  fileReader(files: any, type: string) {
    const file = {...files};

    const reader = new FileReader;
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      this.workbookToJsonArray(workbook, type);
    }
    reader.readAsArrayBuffer(file.originFileObj as any);

    file.status = 'done';
  }

  workbookToJsonArray(workbook: XLSX.WorkBook, type: string) {
    workbook.SheetNames.forEach(name => {
      if (type == 'TEACHER') {
        if (this.teacherSheetNames.includes(name)) {
          const roa = XLSX.utils.sheet_to_json(workbook.Sheets[name], {});
          if (roa.length > 0) {
            this.teacherData[name].push(roa.filter((x: any) => Object.keys(x).length > 5));
          }
        }
      } else if (type == 'MAIN') {
        
      }
    });
  }

  changeEvent() {


  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { AppComponent } from './app.component';

import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { HttpClientModule } from '@angular/common/http';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { ResultPageComponent } from './result-page/result-page.component';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { 
  MenuFoldOutline, 
  MenuUnfoldOutline, 
  AccountBookFill, 
  AlertFill, 
  AlertOutline,
  FileOutline,
  SettingOutline,
  AlibabaOutline
} from '@ant-design/icons-angular/icons';
import { CommonfileSettingComponent } from './commonfile-setting/commonfile-setting.component';
const icons: IconDefinition[] = [ 
  MenuFoldOutline, 
  MenuUnfoldOutline, 
  AccountBookFill, 
  AlertOutline, 
  AlertFill,
  FileOutline,
  SettingOutline,
  AlibabaOutline
];

@NgModule({
  declarations: [
    AppComponent,
    UploadFileComponent,
    ResultPageComponent,
    CommonfileSettingComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AgGridModule,
    NzUploadModule,
    NzLayoutModule,
    NzModalModule,
    NzIconModule,
    NzMessageModule,
    NzCollapseModule,
    NzInputModule, 
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzBreadCrumbModule,
    NzIconModule.forRoot(icons),
    NzMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

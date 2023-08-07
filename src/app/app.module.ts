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


@NgModule({
  declarations: [
    AppComponent,
    UploadFileComponent,
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
    NzButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

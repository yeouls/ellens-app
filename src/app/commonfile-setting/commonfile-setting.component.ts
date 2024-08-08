import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-commonfile-setting',
  templateUrl: './commonfile-setting.component.html',
  styleUrls: ['./commonfile-setting.component.css']
})
export class CommonfileSettingComponent implements OnInit  {
  moduleList: string[] = [];
  current_module: string = 'M3,M4';

  ngOnInit(): void {
    this.moduleList = this.current_module.split(",");
  }

  
}

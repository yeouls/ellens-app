import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isCollapsed = true;
  isSetting = false;
  isResult = true;

  ngOnInit() {
  }

  onMenuClick(event:any) {
    if(event.target.innerText.includes("설정")) {
      this.isSetting = true;
      this.isResult = false;
    } else {
      this.isResult = true;
      this.isSetting = false;
    }
  }
}

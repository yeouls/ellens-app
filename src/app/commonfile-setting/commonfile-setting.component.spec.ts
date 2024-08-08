import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonfileSettingComponent } from './commonfile-setting.component';

describe('CommonfileSettingComponent', () => {
  let component: CommonfileSettingComponent;
  let fixture: ComponentFixture<CommonfileSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonfileSettingComponent]
    });
    fixture = TestBed.createComponent(CommonfileSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

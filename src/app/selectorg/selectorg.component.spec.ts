import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorgComponent } from './selectorg.component';

describe('SelectorgComponent', () => {
  let component: SelectorgComponent;
  let fixture: ComponentFixture<SelectorgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectorgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectgiftsComponent } from './selectgifts.component';

describe('SelectgiftsComponent', () => {
  let component: SelectgiftsComponent;
  let fixture: ComponentFixture<SelectgiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectgiftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectgiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

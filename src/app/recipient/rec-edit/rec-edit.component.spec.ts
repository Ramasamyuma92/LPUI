import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecEditComponent } from './rec-edit.component';

describe('RecEditComponent', () => {
  let component: RecEditComponent;
  let fixture: ComponentFixture<RecEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

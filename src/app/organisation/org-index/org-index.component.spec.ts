import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgIndexComponent } from './org-index.component';

describe('OrgIndexComponent', () => {
  let component: OrgIndexComponent;
  let fixture: ComponentFixture<OrgIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

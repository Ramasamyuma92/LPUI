import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecCreateComponent } from './rec-create.component';

describe('RecCreateComponent', () => {
  let component: RecCreateComponent;
  let fixture: ComponentFixture<RecCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

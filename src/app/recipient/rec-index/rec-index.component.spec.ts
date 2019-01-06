import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecIndexComponent } from './rec-index.component';

describe('RecIndexComponent', () => {
  let component: RecIndexComponent;
  let fixture: ComponentFixture<RecIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

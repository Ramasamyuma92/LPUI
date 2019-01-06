import { TestBed, inject } from '@angular/core/testing';

import { VieworderService } from './vieworder.service';

describe('VieworderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VieworderService]
    });
  });

  it('should be created', inject([VieworderService], (service: VieworderService) => {
    expect(service).toBeTruthy();
  }));
});

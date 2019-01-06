import { TestBed, inject } from '@angular/core/testing';

import { PlaceorderService } from './placeorder.service';

describe('PlaceorderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlaceorderService]
    });
  });

  it('should be created', inject([PlaceorderService], (service: PlaceorderService) => {
    expect(service).toBeTruthy();
  }));
});

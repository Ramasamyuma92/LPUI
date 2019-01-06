import { TestBed, inject } from '@angular/core/testing';

import { RecipientService } from './recipient.service';

describe('RecipientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipientService]
    });
  });

  it('should be created', inject([RecipientService], (service: RecipientService) => {
    expect(service).toBeTruthy();
  }));
});

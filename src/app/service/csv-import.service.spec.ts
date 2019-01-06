import { TestBed, inject } from '@angular/core/testing';

import { CsvImportService } from './csv-import.service';

describe('CsvImportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CsvImportService]
    });
  });

  it('should be created', inject([CsvImportService], (service: CsvImportService) => {
    expect(service).toBeTruthy();
  }));
});

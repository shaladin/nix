import { TestBed } from '@angular/core/testing';

import { NgxFrameworkService } from './ngx-framework.service';

describe('NgxFrameworkService', () => {
  let service: NgxFrameworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxFrameworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFrameworkComponent } from './ngx-framework.component';

describe('NgxFrameworkComponent', () => {
  let component: NgxFrameworkComponent;
  let fixture: ComponentFixture<NgxFrameworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxFrameworkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxFrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRowComponent } from './password-row.component';

describe('PasswordRowComponent', () => {
  let component: PasswordRowComponent;
  let fixture: ComponentFixture<PasswordRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

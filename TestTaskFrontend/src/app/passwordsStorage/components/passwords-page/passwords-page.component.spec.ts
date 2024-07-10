import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordsPageComponent } from './passwords-page.component';

describe('PasswordsPageComponent', () => {
  let component: PasswordsPageComponent;
  let fixture: ComponentFixture<PasswordsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

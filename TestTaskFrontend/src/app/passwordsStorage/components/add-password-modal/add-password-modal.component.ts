import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { PasswordTypes } from '../../model/password-entry';
import { distinctUntilChanged, Observable } from 'rxjs';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-add-password-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgbTooltip],
  templateUrl: './add-password-modal.component.html',
  styleUrl: './add-password-modal.component.scss'
})
export class AddPasswordModalComponent {
  protected activeModal: NgbActiveModal;
  passwordTypes = PasswordTypes;

  passwordForm = new FormGroup({
    passwordType: new FormControl<PasswordTypes>(PasswordTypes.Website, [
      Validators.required
    ]),
    passwordFor: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ])
  });

  @Input({required:true}) addPassword!: (type: PasswordTypes, passwordFor: string, password: string) => Observable<boolean>;
  protected modalService: NgbModal;

  constructor(activeModal: NgbActiveModal, modalService: NgbModal) {
    this.activeModal = activeModal;
    this.modalService = modalService;

    this.passwordType.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.passwordFor.clearValidators();
      this.passwordFor.setValidators(value == PasswordTypes.Email ? [
        Validators.required,
        Validators.email
      ] : [
        Validators.required
      ]);
      this.passwordFor.updateValueAndValidity();
    })
  }

  get passwordFor() {
    return this.passwordForm.controls.passwordFor;
  }

  get password() {
    return this.passwordForm.controls.password;
  }

  get passwordType() {
    return this.passwordForm.controls.passwordType;
  }

  submitNewPassword() {
    if (this.passwordForm.valid && this.passwordType.value && this.passwordFor.value && this.password.value)
    {
      let subscription = this.addPassword(
        this.passwordType.value,
        this.passwordFor.value,
        this.password.value
      ).subscribe({
        next: value => {
          if (value)
            this.activeModal.close();          
          subscription.unsubscribe();
        }
      })
    }
    else
    {
      let modal = this.modalService.open(ErrorModalComponent, {centered:true});
      (modal.componentInstance as ErrorModalComponent).errorText = "Пустое поле!";
    }
  }
}
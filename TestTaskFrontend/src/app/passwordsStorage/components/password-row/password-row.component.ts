import { Component, Input } from '@angular/core';
import { PasswordEntry } from '../../model/password-entry';
import { catchError, Observable, Subscription } from 'rxjs';
import { PasswordStorageRepositoryService } from '../../services/password-storage-repository.service';
import { GetPasswordValueError, IPasswordStorageRepositoryService } from '../../services/password-storage-resository.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

export const PasswordState = {
  Hidden: 0,
  Loading: 1,
  Displayed: 2,
  Error: 3
} as const;
export type PasswordState = typeof PasswordState[keyof typeof PasswordState];

@Component({
  selector: 'app-password-row',
  standalone: true,
  imports: [],
  templateUrl: './password-row.component.html',
  styleUrl: './password-row.component.scss'
})
export class PasswordRowComponent {
  @Input({required:true}) password!: PasswordEntry;
  passwordState : PasswordState = PasswordState.Hidden;
  passwordValue : string = "undefined";

  PasswordStates = PasswordState;

  protected repository : IPasswordStorageRepositoryService;
  protected passwordSubscription?: Subscription;
  protected modalService: NgbModal;

  constructor(repository: IPasswordStorageRepositoryService, modalService: NgbModal) {
    this.repository = repository;
    this.modalService = modalService;
  }

  loadPassword() {
    this.passwordState = PasswordState.Loading;
    
    this.passwordSubscription = this.repository.getPasswordValue(this.password).subscribe({
      next: value => {
        if (value.success)
        {
          this.passwordValue = value.result;
          this.passwordState = PasswordState.Displayed;
        }
        else
        {
          console.log(value.error);
          this.passwordState = PasswordState.Error;
          const modal = this.modalService.open(ErrorModalComponent, {centered:true});
          (modal.componentInstance as ErrorModalComponent).errorText =
          value.error == GetPasswordValueError.InvalidRecord ?
          "Не удалось найти этот пароль!" :
          "Системная ошибка.";
        }
        this.passwordSubscription?.unsubscribe();
      },
      error: err => {
        console.log(err);
        this.passwordState = PasswordState.Error;
        const modal = this.modalService.open(ErrorModalComponent, {centered:true});
        (modal.componentInstance as ErrorModalComponent).errorText = "Системная ошибка.";
        this.passwordSubscription?.unsubscribe();
      }
    });
  }
}
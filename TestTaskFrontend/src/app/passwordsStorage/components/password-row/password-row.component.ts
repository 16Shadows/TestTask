import { Component, Input } from '@angular/core';
import { PasswordEntry } from '../../model/password-entry';
import { catchError, Observable, Subscription } from 'rxjs';
import { PasswordStorageRepositoryService } from '../../services/password-storage-repository.service';
import { IPasswordStorageRepositoryService } from '../../services/password-storage-resository.interface';

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

  constructor(repository: IPasswordStorageRepositoryService) {
    this.repository = repository;
  }

  loadPassword() {
    this.passwordState = PasswordState.Loading;
    
    var passwordObservable = this.repository.getPasswordValue(this.password);
    this.passwordSubscription = passwordObservable.subscribe({
      next: value => {
        this.passwordValue = value;
        this.passwordState = PasswordState.Displayed;
        this.passwordSubscription?.unsubscribe();
      },
      error: err => {
        console.log(err);
        this.passwordState = PasswordState.Error;
        this.passwordSubscription?.unsubscribe();
      }
    });
  }
}
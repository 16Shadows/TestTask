import { Component, Input } from '@angular/core';
import { PasswordEntry } from '../../model/password-entry';

export const PasswordState = {
  Hidden: 0,
  Loading: 1,
  Displayed: 2
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
  passwordValue: string = "undefined";

  PasswordStates = PasswordState;

  loadPassword() {
    this.passwordState = PasswordState.Loading;
    setTimeout(() => {
      this.passwordState = PasswordState.Displayed;
      this.passwordValue = "test password";
    }, 2000)
  }
}
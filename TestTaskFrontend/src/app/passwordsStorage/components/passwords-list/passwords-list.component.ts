import { Component } from '@angular/core';
import { PasswordEntry } from '../../model/password-entry';
import { PasswordRowComponent } from '../password-row/password-row.component';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AddPasswordError, IPasswordStorageRepositoryService } from '../../services/password-storage-resository.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPasswordModalComponent } from '../add-password-modal/add-password-modal.component';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-passwords-list',
  standalone: true,
  imports: [ PasswordRowComponent, AsyncPipe ],
  templateUrl: './passwords-list.component.html',
  styleUrl: './passwords-list.component.scss'
})
export class PasswordsListComponent {
  passwords : PasswordEntry[] = [];
  searchPrompt = new Subject<string>();

  protected passwordRepo : IPasswordStorageRepositoryService;
  protected modalService : NgbModal;

  constructor( passwordsRepo : IPasswordStorageRepositoryService, modalService: NgbModal) {
    this.passwordRepo = passwordsRepo;
    this.modalService = modalService;

    this.searchPrompt.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(prompt => this.passwordRepo.getPasswords(prompt))
    ).subscribe({
      next: value => {
        if (value.success)
          this.passwords = value.result;
        else
        {
          const modal = this.modalService.open(ErrorModalComponent, {centered:true});
          (modal.componentInstance as ErrorModalComponent).errorText = "Не удалось загрузить список паролей.";
        }
      },
      error: err => {
        console.log(err);
      }
    })

    setTimeout(() => this.searchPrompt.next(''), 100);
  }

  updateSearchPrompt(event: Event) {
    this.searchPrompt.next((event.target as HTMLInputElement).value);
  }

  addNewPassword() {
    let modal = this.modalService.open(AddPasswordModalComponent, {centered: true});
    (modal.componentInstance as AddPasswordModalComponent).addPassword = (a, b, c) => {
      const result = new Subject<boolean>
      const subscription = this.passwordRepo.addPassword(a, b, c).subscribe({
        next: value => {
          if (value.success)
          {
            this.passwords.splice(0, 0, value.result);
            result.next(true);
          }
          else
          {
            const modal = this.modalService.open(ErrorModalComponent, {centered:true});
            (modal.componentInstance as ErrorModalComponent).errorText = 
              value.error == AddPasswordError.DuplicatePassword ?
              "Такой пароль уже существует." :
              "Системная ошибка.";
            subscription.unsubscribe();
            result.next(false);
          }
          subscription.unsubscribe();
        },
        error: err => {
          subscription.unsubscribe();
          result.next(false);
        }
      })
      return result;
    };
  }
}

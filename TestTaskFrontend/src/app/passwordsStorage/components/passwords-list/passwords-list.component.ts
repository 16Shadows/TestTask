import { Component } from '@angular/core';
import { PasswordEntry, PasswordTypes } from '../../model/password-entry';
import { PasswordRowComponent } from '../password-row/password-row.component';
import { debounceTime, distinctUntilChanged, from, Observable, Subject, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { IPasswordStorageRepositoryService } from '../../services/password-storage-resository.interface';

@Component({
  selector: 'app-passwords-list',
  standalone: true,
  imports: [ PasswordRowComponent, AsyncPipe ],
  templateUrl: './passwords-list.component.html',
  styleUrl: './passwords-list.component.scss'
})
export class PasswordsListComponent {
  passwords = new Observable<PasswordEntry[]>();
  searchPrompt = new Subject<string>();

  protected passwordRepo : IPasswordStorageRepositoryService;

  constructor( passwordsRepo : IPasswordStorageRepositoryService ) {
    this.passwordRepo = passwordsRepo;

    this.passwords = this.searchPrompt.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(prompt => this.passwordRepo.getPasswords(prompt))
    );

    setTimeout(() => this.searchPrompt.next(''), 100);
  }

  updateSearchPrompt(event: Event) {
    this.searchPrompt.next((event.target as HTMLInputElement).value);
  }
}

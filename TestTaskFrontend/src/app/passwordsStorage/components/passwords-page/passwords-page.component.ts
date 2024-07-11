import { Component } from '@angular/core';
import { PasswordsListComponent } from '../passwords-list/passwords-list.component';
import { PasswordStorageRepositoryService } from '../../services/password-storage-repository.service';
import { IPasswordStorageRepositoryService } from '../../services/password-storage-resository.interface';
import { IPasswordStorageService } from '../../services/password-storage.interface';
import { PasswordStorageService } from '../../services/password-storage.service';

@Component({
  selector: 'app-passwords-page',
  standalone: true,
  imports: [PasswordsListComponent],
  templateUrl: './passwords-page.component.html',
  styleUrl: './passwords-page.component.scss',
  providers: [
    { provide: IPasswordStorageRepositoryService, useClass: PasswordStorageRepositoryService },
    { provide: IPasswordStorageService, useClass: PasswordStorageService }
  ]
})
export class PasswordsPageComponent {

}

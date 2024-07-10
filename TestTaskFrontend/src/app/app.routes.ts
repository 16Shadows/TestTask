import { Routes } from '@angular/router';
import { NotFoundPageComponent } from './notFound/components/not-found-page/not-found-page.component';
import { PasswordsPageComponent } from './passwordsStorage/components/passwords-page/passwords-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/passwords', pathMatch: 'full' },
    { path: 'passwords', component: PasswordsPageComponent },
    { path: '**', component: NotFoundPageComponent }
];

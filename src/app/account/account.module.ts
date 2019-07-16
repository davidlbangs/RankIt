import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PasswordComponent } from './pages/password/password.component';
import { AccountComponent } from './pages/account/account.component';


// guards
import { AuthGuard } from '../../auth/shared/guards/auth.guard';

export const routes:Routes = [
  { path: '', pathMatch: 'full', canActivate: [AuthGuard], component: AccountComponent },
  { path: 'password', canActivate: [AuthGuard], component: PasswordComponent }
];


@NgModule({
  declarations: [PasswordComponent, AccountComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class AccountModule { }

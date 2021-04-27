import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PasswordComponent } from './pages/password/password.component';
import { AccountComponent } from './pages/account/account.component';
import { SharedModule } from '../shared/shared.module';

// guards
import { AuthGuard } from '../auth/shared/guards/auth.guard';
import { MetaGuard } from 'meta';

export const routes:Routes = [
  { path: '', pathMatch: 'full', canActivate: [AuthGuard, MetaGuard], component: AccountComponent,
  data: {
          meta: {
            title: 'Account'
          }
    }, 
  },
  { path: 'password', canActivate: [AuthGuard], component: PasswordComponent }
];


@NgModule({
  declarations: [PasswordComponent, AccountComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class AccountModule { }

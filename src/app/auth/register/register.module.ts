import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { RegisterComponent } from './containers/register/register.component';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';

export const ROUTES: Routes = [
  {
    path: '', component: RegisterComponent,
    data: {
          meta: {
            title: 'Register'
          }
    }
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    SharedModule,
    NgxAuthFirebaseUIModule
  ],
  declarations: [
  RegisterComponent
  ]
})
export class RegisterModule {}
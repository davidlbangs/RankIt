import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './containers/login/login.component';

// Auth Module UI
// import {FirebaseUIModule, firebase, firebaseui} from 'firebaseui-angular';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';

export const ROUTES: Routes = [
  {
    path: '', component: LoginComponent,
    data: {
          meta: {
            title: 'Login'
          }
    }
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    NgxAuthFirebaseUIModule,
    // FirebaseUIModule,
    SharedModule
  ],
  declarations: [
  LoginComponent
  ]
})
export class LoginModule {}
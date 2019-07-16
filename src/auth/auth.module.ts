import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// shared modules
import { SharedModule } from './shared/shared.module';


// third party
import { AngularFireModule, FirebaseAppConfig } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';


export const ROUTES: Routes = [
  {
    path: 'auth',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', loadChildren: './login/login.module#LoginModule' },
      { path: 'register', loadChildren: './register/register.module#RegisterModule' }
    ]
  }
];

export const firebaseConfig:FirebaseAppConfig = {
    apiKey: "AIzaSyAQVdV2q3YDlLO0gWt7cLSD0ehR3NTKVLc",
    authDomain: "fitnessapp-fc0fa.firebaseapp.com",
    databaseURL: "https://fitnessapp-fc0fa.firebaseio.com",
    projectId: "fitnessapp-fc0fa",
    storageBucket: "fitnessapp-fc0fa.appspot.com",
    messagingSenderId: "86385318516"
  };


 // https://github.com/firebase/firebaseui-web
 // https://fireship.io/lessons/angularfire-google-oauth/


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    SharedModule.forRoot()
  ]
})
export class AuthModule {}
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
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      {path: 'login', loadChildren: () => import ('./login/login.module').then(m => m.LoginModule)},
      {path: 'register', loadChildren: () => import ('./register/register.module').then(m => m.RegisterModule)}
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
 // https://github.com/RaphaelJenni/firebaseui-angular


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
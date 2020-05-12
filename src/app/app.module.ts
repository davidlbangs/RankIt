import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAnalytics, AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { environment } from '../environments/environment';

import { SharedModule } from './shared/shared.module';
import { Store } from 'store';
import { CookieService } from 'ngx-cookie-service';

//import { NgUniversalModule } from '@trilon/ng-universal';

// Material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// AUTH
import { AuthModule } from './auth/auth.module';
import { UserResolver } from './shared/services/resolver.service';
// import {FirebaseUIModule, firebase, firebaseui} from 'firebaseui-angular';

// META
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { MetaLoader, MetaStaticLoader, PageTitlePositioning, MetaModule } from 'meta';
import { HttpClientModule } from '@angular/common/http';

export function metaFactory(): MetaLoader {
  return new MetaStaticLoader({
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' - ',
    applicationName: 'RankIt',
    defaults: {
      title: 'RankIt',
      description: 'RankIt facilitates polls using Ranked Choice Voting.',
      'og:image': 'https://rankit-vote.firebaseapp.com/assets/images/rankit-share-image.jpg',
      'og:type': 'website',
      'og:locale': 'en_US',
      'og:locale:alternate': 'en_US,nl_NL,tr_TR'
    }
  });
}

const firebaseAuthConfig = {
                    apiKey: environment.firebase.apiKey,
                    authDomain: environment.firebase.authDomain,
                    databaseURL: environment.firebase.databaseURL,
                    projectId: environment.firebase.projectId,
                    storageBucket: environment.firebase.storageBucket,
                    messagingSenderId: environment.firebase.messagingSenderId,
                    appId: environment.firebase.appId,
                    measurementId: environment.firebase.measurementId
                }


// const firebaseUiAuthConfig: firebaseui.auth.Config = {
//   signInFlow: 'popup',
//   signInOptions: [
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     {
//       scopes: [
//         'public_profile',
//         'email'
//       ],
//       customParameters: {
//         'auth_type': 'reauthenticate'
//       },
//       provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID
//     },
//     firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//     {
//       requireDisplayName: false,
//       provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
//     }
//   ],
//   tosUrl: '<your-tos-link>',
//   privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
//   credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
// };



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
   // NgUniversalModule,
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: (metaFactory)
    }),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireAnalyticsModule,
    // FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    NgxAuthFirebaseUIModule.forRoot(firebaseAuthConfig),
    BrowserAnimationsModule,
    AuthModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [Store, UserResolver, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }

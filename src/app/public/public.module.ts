import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './pages/home/home.component';
import { MetaGuard } from '@ngx-meta/core';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { DescriptionComponent } from './components/description/description.component';

export const routes:Routes = [
  { path: 'privacy', component: PrivacyComponent, canActivate: [MetaGuard],
    data: {
          meta: {
            title: 'Privacy Policy'
          }
    } 
  },
  { path: '', pathMatch: 'full', component: HomeComponent, canActivate: [MetaGuard],
    data: {
          meta: {
            title: 'Home'
          }
    } 
  }
];


@NgModule({
  declarations: [HomeComponent, PrivacyComponent, DescriptionComponent],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forChild(routes),
  ]
})
export class PublicModule { }

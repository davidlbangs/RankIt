import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { ManagePollsComponent } from './pages/manage-polls/manage-polls.component';

import { MetaGuard } from '@ngx-meta/core';
import { UserResolver } from '../shared/services/resolver.service';

export const routes:Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'manage-polls' },
  { path: 'manage-polls', canActivate: [MetaGuard], resolve: { resolverUser: UserResolver}, component: ManagePollsComponent,
  data: {
          meta: {
            title: 'Admin - Manage Polls'
          }
    },
   }
];


@NgModule({
  declarations: [ManagePollsComponent],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forChild(routes),
  ]
})


export class AdminModule { }

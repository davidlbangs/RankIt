import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { ManagePollsComponent } from './pages/manage-polls/manage-polls.component';

import { MetaGuard } from '@ngx-meta/core';
import { UserResolver } from '../shared/services/resolver.service';

import { AdminGuard } from '../../auth/shared/guards/admin.guard';

import { ManageUsersComponent } from './pages/manage-users/manage-users.component';

export const routes:Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'manage-polls' },
  { path: 'manage-polls', canActivate: [MetaGuard, AdminGuard], resolve: { resolverUser: UserResolver}, component: ManagePollsComponent,
  data: {
          meta: {
            title: 'Admin - Manage Polls'
          }
    }
   },
   { path: 'manage-users', canActivate: [MetaGuard, AdminGuard], resolve: { resolverUser: UserResolver}, component: ManageUsersComponent,
  data: {
          meta: {
            title: 'Admin - Manage Users'
          }
    }
   }
];


@NgModule({
  declarations: [ManagePollsComponent, ManageUsersComponent],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forChild(routes),
  ]
})


export class AdminModule { }

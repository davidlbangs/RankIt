import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/shared/guards/auth.guard';

export const routes:Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', loadChildren: () => import ('./public/public.module').then(m => m.PublicModule)},
  { path: 'polls', canActivate: [AuthGuard], loadChildren: () => import ('./polls/polls.module').then(m => m.PollsModule) },
  { path: 'admin', canActivate: [AuthGuard], loadChildren: () => import ('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'vote', loadChildren: () => import ('./vote/vote.module').then(m => m.VoteModule) },
  { path: 'results', loadChildren: () => import ('./results/results.module').then(m => m.ResultsModule) },
  { path: 'account', canActivate: [AuthGuard], loadChildren: () => import ('./account/account.module').then(m => m.AccountModule) },
  {
    path: '**',
    redirectTo: '/home/not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/shared/guards/auth.guard';

export const routes:Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home' },
  {path: 'home', loadChildren: './public/public.module#PublicModule'},
  { path: 'polls', canActivate: [AuthGuard], loadChildren: './polls/polls.module#PollsModule' },
  { path: 'vote', loadChildren: './vote/vote.module#VoteModule' },
  { path: 'results', loadChildren: './results/results.module#ResultsModule' },
  { path: 'account', canActivate: [AuthGuard], loadChildren: './account/account.module#AccountModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

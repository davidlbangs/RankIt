import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';

import { map, switchMap, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router:Router,
    private authService:AuthService
    ) {}

  canActivate(
              next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {
    return this.authService.authState
    .pipe(
          map(user => {
              if (!user) {
                this.router.navigate(['/auth/login']);
              }
              return !!user; //"double bang". if {} then true, if null then false.
            })
          );
  }
}

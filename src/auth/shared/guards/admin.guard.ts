import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { tap, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';


@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private auth:AuthService
    ) {}

  canActivate(
              next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> {

    return this.auth.user$.pipe(
                                  take(1),
                                  map(user => user && user.roles.admin ? true : false),
                                  tap(isAdmin => {
                                    if(!isAdmin) {
                                      console.log('access denied. admins only');
                                    }
                                  })
                                );

  }
}

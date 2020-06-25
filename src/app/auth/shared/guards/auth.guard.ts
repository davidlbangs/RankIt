import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';

import { map, switchMap, take } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router:Router,
    private authService:AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    //@Inject('httpResponseData') private httpResponseData: any
    ) {}

  canActivate(
              next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {
                if (isPlatformServer(this.platformId)) {
                  return new Observable<boolean>(observer => {
                    observer.next(false);
                    observer.complete();
                });
                }
    return this.authService.authState
    .pipe(
          map(user => {
              if (!user) {
                
                
                this.router.navigate(['/auth/login']);
                /*
                this.router.navigate(['/auth/login']);
                if (isPlatformServer(this.platformId)) {
                  //this.httpResponseData.redirectUrl = 'https://rankit.vote/auth/login';
                }
                else {
                  this.router.navigate(['/auth/login']);
                }*/
              }
              return !!user; //"double bang". if {} then true, if null then false.
            })
          );
  }
}

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { TokenApiModel } from '../models/token-api.model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private toast: NgToastService,private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.authService.getToken();
    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}`}
      });
    }
    return next.handle(request).pipe(
      catchError((err:any) =>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            return this.handleUnauthorizedError(request,next);
          }
        }

        return throwError(()=> new Error('Some other error occured'));
        
      })
    );
}

handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler){
  const accessToken = this.authService.getToken()!;
  const refeshToken = this.authService.getRefreshToken()!;

  let tokenApiModel = new TokenApiModel();
  tokenApiModel.accessToken = accessToken;
  tokenApiModel.refreshToken = refeshToken;

  return this.authService.renewToken(tokenApiModel)
  .pipe(
    switchMap((data:TokenApiModel) => {
      this.authService.storeRefreshToken(data.refreshToken);
      this.authService.storeToken(data.accessToken);
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${data.accessToken}`}
    })
    return next.handle(request);
    }),
    catchError((err) => {
      return throwError(() => {
        this.toast.warning({detail:'Warning',summary:'Tken expired, please login'});
        this.router.navigate(['login']);
      })
    })
  )
}
}

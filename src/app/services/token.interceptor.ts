//This file is used for taking header from localstorage and getting the authentication from backend in order to get response from http request(name is interceptor)
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');

    if(token){
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      });
    }
    return next.handle(request).pipe(
      catchError((err)=>{
        if(err instanceof HttpErrorResponse){
          console.log(err.url);
          if(err.status === 401 || err.status === 403){
            if(this.router.url === '/login'){
              //Do Nothing
            }
            else{
              localStorage.removeItem('token');
              this.router.navigate(['/']);
            }
          }
        }
        return throwError(err);
      })
    )
  }
}
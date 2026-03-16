import { Injectable } from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'Something went wrong. Please try again.';

        switch (error.status) {
          case 404: message = 'Resource not found.';                         break;
          case 409: message = 'Cart is no longer open for modifications.';   break;
          case 400: message = 'Invalid request. Please check your input.';   break;
          case 0:   message = 'Cannot reach the server. Is the backend running?'; break;
        }

        this.snackBar.open(message, 'Dismiss', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });

        return throwError(() => error);
      })
    );
  }
}

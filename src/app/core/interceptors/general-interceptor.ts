import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const generalInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 404) {
          console.error('Servicio no encontrado.');
        } else if (error.status === 500) {
          console.error('Error inesperado.');
        }
      }
      return throwError(() => error);
    })
  );

};

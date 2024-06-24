import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private client: HttpClient) { }

  public post(serviceUrl: string, data: any): Observable<any> {
    return this.client.post(serviceUrl, data).pipe(
      retry(1),
      delay(3000),
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(() => error);
  }
}

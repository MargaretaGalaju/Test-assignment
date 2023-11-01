import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const modifiedRequest = request.clone({
      setHeaders: {
        Accept: 'application/json',
        // Hardcoded because we don't have the login flow
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZjMxZWFlMDU5YzY0NGM0OTgwNzQ5Njg3Yzk2YjkyZSIsInN1YiI6IjY1M2ZkMDllYzhhNWFjMDBhZDM4NjQ5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0E290Wc-OIkBy-XmF0gCCDxqSQXgFAnS8pNqtb68hSw',
      },
    });
    
    return next.handle(modifiedRequest);
  }
}

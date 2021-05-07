import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../shared/service/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  URL_LOGIN = environment.API_URL + "/login"
  URL_REGISTER = environment.API_URL + "/register"


  constructor(private authService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes(this.URL_LOGIN) || request.url.includes(this.URL_REGISTER))
      return next.handle(request);

    this.authService.loadToken();
    const token = this.authService.geToken()
    const httpRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })

    return next.handle(httpRequest);
  }
}

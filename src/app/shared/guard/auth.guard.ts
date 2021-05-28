import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NotificationType } from '../enum/notification-type.enum';
import { AuthenticationService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService,
    private router: Router,
    private notificationService: NotifierService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    this.authService.loadToken()
    if (this.authService.geToken())
      return true;

    this.router.navigate(["/login"])
    this.notificationService.notify(NotificationType.ERROR, "Needed log in to access this resource.")
    return false;
  }

}

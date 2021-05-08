import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../shared/service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    if (this.authService.geToken() !== undefined)
      return true;

    this.router.navigate(["/login"])
    return false;
  }

}

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Storage } from '../const/storage';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private token: string | undefined;
  private loggedInUsername: string | undefined;

  constructor(private http: HttpClient) { }

  public login(user: User): Promise<HttpResponse<User>> {
    return this.http.post<User>(`${environment.API_URL}/login`, user, {
      observe:'response'
    })
      .toPromise();
  }

  public register(user: User): Promise<User> {
    return this.http.post<User>(`${environment.API_URL}/register`, user).toPromise();
  }

  public logOut(): void {
    this.token = undefined;
    this.loggedInUsername = undefined;
    localStorage.removeItem(Storage.USER);
    localStorage.removeItem(Storage.TOKEN);
    localStorage.removeItem(Storage.USERS);
  }

  public storageToken(token: string): void {
    this.token = token
    localStorage.setItem(Storage.TOKEN, token);
  }

  public storageUser(user: User): void {
    localStorage.setItem(Storage.USER, JSON.stringify(user));
  }

  public getUserFromLocalStorage(): User | undefined {
    let user = localStorage.getItem(Storage.USER);
    return user ? JSON.parse(user) : undefined
  }

  public loadToken() {
    let jwtToken = localStorage.getItem(Storage.TOKEN)
    this.token = jwtToken ? jwtToken : undefined;
  }

  public geToken(): string | undefined {
    return this.token;
  }
}

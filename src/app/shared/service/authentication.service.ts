import { HttpClient, HttpResponse } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Storage } from '../const/storage';
import { AuthorityType } from '../enum/authority-type.enum';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private token: string | undefined;
  private loggedUser: User | undefined;
  @Output() loginEvent: EventEmitter<{ isLogged: boolean }> = new EventEmitter();

  constructor(private http: HttpClient) { 
    this.loggedUser = this.getUserFromLocalStorage()
  }

  public login(user: User): Promise<HttpResponse<User>> {
    return this.http.post<User>(`${environment.API_URL}/login`, user, {
      observe: 'response'
    })
      .toPromise();
  }

  public register(user: User): Promise<User> {
    return this.http.post<User>(`${environment.API_URL}/register`, user).toPromise();
  }

  public logOut(): void {
    this.token = undefined;
    localStorage.removeItem(Storage.USER);
    localStorage.removeItem(Storage.TOKEN);
    localStorage.removeItem(Storage.USERS);
    this.loginEvent.emit({ isLogged: false })
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

  public loadUser() {
    let user = JSON.parse(localStorage.getItem(Storage.USER) || "") as User
    this.loggedUser = user ? user : undefined;
  }

  public geToken(): string | undefined {
    return this.token;
  }

  public checkUserDeleteAuthority(): string | undefined {
    return this.loggedUser?.authorities?.find(authority => authority === AuthorityType.DELETE)
  }

  public checkUserUpdateAuthority(): string | undefined {
    return this.loggedUser?.authorities?.find(authority => authority === AuthorityType.UPDATE)
  }

  public checkUserWriteAuthority(): string | undefined {
    return this.loggedUser?.authorities?.find(authority => authority === AuthorityType.WRITE)
  }

  public checkUserReadAuthority(): string | undefined {
    return this.loggedUser?.authorities?.find(authority => authority === AuthorityType.READ)
  }
}

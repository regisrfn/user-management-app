import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpResponse } from '../model/http-response.model';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public deleteUser(id: string): Promise<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.API_URL}/delete/${id}`).toPromise()
  }

  public getUsers(): Promise<User[]> {
    return this.http.get<User[]>(`${environment.API_URL}/get`).toPromise()
  }

  public getUserById(id:string): Promise<User> {
    return this.http.get<User>(`${environment.API_URL}/get/${id}`).toPromise()
  }

  public saveUser(formData: FormData): Promise<User> {
    return this.http.post<User>(`${environment.API_URL}/save`, formData).toPromise()
  }

  public selectAnUser(email="", username=""): Promise<User> {
    return this.http.get<User>(`${environment.API_URL}/select?email=${email}&username=${username}`).toPromise()
  }

  public updateUser(user: User): Promise<User> {
    return this.http.put<User>(`${environment.API_URL}/update`, user).toPromise()
  }

  public updateProfileImage(formData: FormData, id: string): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${environment.API_URL}/update-profile/${id}`, formData, {
      reportProgress: true,
      observe: 'events'
    })
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  public getRoles(): Observable<any[]> {
    return this.http.get<any>('/action?action_route=upt_roles')
                .pipe(
                  map(response => response.roles as any[])
                );
  }

}
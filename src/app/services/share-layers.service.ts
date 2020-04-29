import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  params: null
};

@Injectable({
  providedIn: 'root'
})
// Service used to handle the sharing or privatization of layers.
export class ShareLayersService {

  constructor(private http: HttpClient) { }

  public getShareLayers(): Observable<any[]> {
    return this.http.get('/action?action_route=share_layers')
            .pipe(
              map(response => response as any[])
            );
  }

  public postShareLayers(id: number, is_public: number): Observable<any[]> {
    let body = new HttpParams();
    body = body.set('id', id.toString());
    body = body.set('is_public', is_public.toString());
    return this.http.post('/action?action_route=share_layers', body)
            .pipe(
              map(response => response as any[])
            );
  }
}

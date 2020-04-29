import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NormalizationMethod } from 'src/app/interfaces/normalization-method';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  params: null
};

@Injectable({
  providedIn: 'root'
})
// Service used to manage the normalization and operation methods labels for ST (CRUD),
// as well as getting a static list of the currently installed methods.
export class MethodService {

  constructor(private http: HttpClient) { }

  getNormalizationMethods(): Observable<NormalizationMethod[]> {
    return this.http.get<any>('/action?action_route=st_standardization')
            .pipe(
              map(res => res as NormalizationMethod[])
            );
  }

  createNormalizationMethod(normMethod: NormalizationMethod): Observable<NormalizationMethod> {
    let body = new HttpParams();
    body = body.set('label', normMethod.label);
    body = body.set('language', normMethod.language);
    body = body.set('value', normMethod.value.toString());
    return this.http.post<any>('/action?action_route=st_standardization', body)
            .pipe(
              map(res => res as NormalizationMethod)
            );
  }

  updateNormalizationMethod(normMethod: NormalizationMethod): Observable<NormalizationMethod> {
    let body = new HttpParams();
    body = body.set('id', normMethod.id.toString());
    body = body.set('label', normMethod.label);
    body = body.set('language', normMethod.language);
    body = body.set('value', normMethod.value.toString());
    return this.http.put<any>('/action?action_route=st_standardization', body)
            .pipe(
              map(res => res as NormalizationMethod)
            );
  }

  deleteNormalizationMethod(normMethod: NormalizationMethod): Observable<NormalizationMethod> {
    httpOptions.params = {
      id: normMethod.id
    };
    return this.http.delete<any>('/action?action_route=st_standardization', httpOptions)
            .pipe(
              map(res => res as NormalizationMethod)
            );
  }

  getJoinMethods(): Observable<NormalizationMethod[]> {
    return this.http.get<any>('/action?action_route=st_operation')
            .pipe(
              map(res => res as NormalizationMethod[])
            );
  }

  createJoinMethod(joinMethod: NormalizationMethod): Observable<NormalizationMethod> {
    let body = new HttpParams();
    body = body.set('label', joinMethod.label);
    body = body.set('language', joinMethod.language);
    body = body.set('value', joinMethod.value.toString());
    return this.http.post<any>('/action?action_route=st_operation', body)
            .pipe(
              map(res => res as NormalizationMethod)
            );
  }

  updateJoinMethod(joinMethod: NormalizationMethod): Observable<NormalizationMethod> {
    let body = new HttpParams();
    body = body.set('id', joinMethod.id.toString());
    body = body.set('label', joinMethod.label);
    body = body.set('language', joinMethod.language);
    body = body.set('value', joinMethod.value.toString());
    return this.http.put<any>('/action?action_route=st_operation', body)
            .pipe(
              map(res => res as NormalizationMethod)
            );
  }

  deleteJoinMethod(joinMethod: NormalizationMethod): Observable<NormalizationMethod> {
    httpOptions.params = {
      id: joinMethod.id
    };
    return this.http.delete<any>('/action?action_route=st_operation', httpOptions)
            .pipe(
              map(res => res as NormalizationMethod)
            );
  }

  getStaticNormMethod(): Observable<NormalizationMethod[]> {
    return this.http.get<any>('/action?action_route=st_standardization_options').pipe(
      map(res => res as NormalizationMethod[])
    );
  }

  getStaticJoinMethod(): Observable<NormalizationMethod[]> {
    return this.http.get<any>('/action?action_route=st_operation_options').pipe(
      map(res => res as NormalizationMethod[])
    );
  }
}

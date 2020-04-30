import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Classification } from 'src/app/interfaces/classification';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  params: null
};

@Injectable({
  providedIn: 'root'
})
// Service that manages classifications (CRUD) as well as uploading them.
export class ClassificationService {

  constructor(private http: HttpClient) { }

  getClassifications(): Observable<Classification[]> {
    return this.http.get<any>('/action?action_route=classification_manager').pipe(
      map(res => res as Classification[])
    );
  }
  
  postClassifications(clsf: Classification): Observable<Classification> {
    let body = new HttpParams();
    body = body.set('name', clsf.name);
    body = body.set('fclass', clsf.fclass);
    body = body.set('category', clsf.category);
    return this.http.post<any>('/action?action_route=classification_manager', body).pipe(
      map(res => res as Classification)
    );
  }

  putClassifications(clsf: Classification): Observable<Classification> {
    let body = new HttpParams();
    body = body.set('classification_id', clsf.classification_id.toString());
    body = body.set('name', clsf.name);
    body = body.set('fclass', clsf.fclass);
    body = body.set('category', clsf.category);
    return this.http.put<any>('/action?action_route=classification_manager', body).pipe(
      map(res => res as Classification)
    );
  }

  deleteClassifications(clsf: Classification): Observable<Classification> {
    httpOptions.params = clsf;
    return this.http.delete<any>('/action?action_route=classification_manager', httpOptions).pipe(
      map(res => res as Classification)
    );
  }
}

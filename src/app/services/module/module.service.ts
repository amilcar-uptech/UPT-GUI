import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Module } from 'src/app/interfaces/module';
import { IndUp } from 'src/app/interfaces/ind-up';
import { IndResult } from 'src/app/interfaces/ind-result';
import { SelectItem } from 'primeng/api';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  params: null
};

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  // Service used to install and manage Calculus Modules (CRUD), manage indicators and manage results labels.
  constructor(private http: HttpClient) { }

  installModule(file: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('document', file, file.name);
    return this.http.post<any>('/action?action_route=indicators_installer', formData);
  }

  getModules(): Observable<Module[]> {
    return this.http.get<any>('/action?action_route=indicators_installer').pipe(
      map(res => res as Module[])
    );
  }

  postModule(mdl: Module): Observable<Module> {
    let body = new HttpParams();
    body = body.set('description', mdl.description);
    body = body.set('label', mdl.label);
    body = body.set('language', mdl.language);
    body = body.set('name', mdl.name);
    return this.http.post<any>('/action?route=indicators_installer', body).pipe(
      map(res => res as Module)
    );
  }

  putModule(mdl: Module): Observable<Module> {
    let body = new HttpParams();
    body = body.set('id', mdl.id.toString());
    body = body.set('description', mdl.description);
    body = body.set('label', mdl.label);
    body = body.set('language', mdl.language);
    body = body.set('name', mdl.name);
    return this.http.put<any>('/action?action_route=indicators_installer', body).pipe(
      map(res => res as Module)
    );
  }

  deleteModule(mdl: Module): Observable<Module> {
    httpOptions.params = mdl;
    return this.http.delete<any>('/action?action_route=indicators_installer', httpOptions).pipe(
      map(res => res as Module)
    );
  }

  getIndicators(): Observable<IndUp[]> {
    return this.http.get<any>('/action?action_route=indicators_manager').pipe(
      map(res => res as IndUp[])
    );
  }

  getIndicatorsSelItem(): Observable<SelectItem[]> {
    return this.http.get<any>('/action?action_route=indicators_manager').pipe(
      map(res => res as SelectItem[])
    );
  }

  postIndicators(ind: IndUp): Observable<IndUp> {
    let body = new HttpParams();
    body = body.set('indicator', ind.indicator);
    return this.http.post<any>('/action?action_route=indicators_manager', body).pipe(
      map(res => res as IndUp)
    );
  }

  putIndicators(ind: IndUp): Observable<IndUp> {
    let body = new HttpParams();
    body = body.set('id', ind.id.toString());
    body = body.set('indicator', ind.indicator);
    return this.http.put<any>('/action?action_route=indicators_manager', body).pipe(
      map(res => res as IndUp)
    );
  }

  deleteIndicators(ind: IndUp): Observable<IndUp> {
    httpOptions.params = ind;
    return this.http.delete<any>('/action?action_route=indicators_manager', httpOptions).pipe(
      map(res => res as IndUp)
    );
  }

  getIndicatorResults(): Observable<IndResult[]> {
    return this.http.get<any>('/action?action_route=indicators_labeling').pipe(
      map(res => res as IndResult[])
    );
  }

  postIndicatorResults(iRsl: IndResult): Observable<IndResult> {
    let body = new HttpParams();
    body = body.set('label', iRsl.label);
    body = body.set('language', iRsl.language);
    body = body.set('units', iRsl.units);
    body = body.set('up_indicators_id', iRsl.up_indicators_id.toString());
    return this.http.post<any>('/action?action_route=indicators_labeling', body).pipe(
      map(res => res as IndResult)
    );
  }

  putIndicatorResults(iRsl: IndResult): Observable<IndResult> {
    let body = new HttpParams();
    body = body.set('id', iRsl.id.toString());
    body = body.set('label', iRsl.label);
    body = body.set('language', iRsl.language);
    body = body.set('units', iRsl.units);
    body = body.set('up_indicators_id', iRsl.up_indicators_id.toString());
    return this.http.put<any>('/action?action_route=indicators_labeling', body).pipe(
      map(res => res as IndResult)
    );
  }

  deleteIndicatorResults(iRsl: IndResult): Observable<IndResult> {
    httpOptions.params = iRsl;
    return this.http.delete<any>('/action?action_route=indicators_labeling', httpOptions).pipe(
      map(res => res as IndResult)
    );
  }
}

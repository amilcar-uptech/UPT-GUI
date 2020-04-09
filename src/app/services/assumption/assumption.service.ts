import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Assumption } from 'src/app/interfaces/assumption';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  params: null
};

@Injectable({
  providedIn: 'root'
})
export class AssumptionService {

  constructor(private http: HttpClient) { }

  getAssumptions(id: string): Observable<Assumption[]> {
    return this.http.get<any>('/action?action_route=up_assumptions&scenario_id=' + id)
            .pipe(
              map(res => res as Assumption[])
            );
  }

  uploadAssumption(id: string, file: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('document', file, file.name);
    return this.http.post<any>('/action?action_route=up_csv_assumptions&study_area=' + id, formData);
  }

  createAssumption(assumption: Assumption): Observable<Assumption> {
    let body = new HttpParams();
    body = body.set('study_area', assumption.study_area.id.toString());
    body = body.set('scenario', assumption.scenario.scenarioId.toString());
    body = body.set('category', assumption.category);
    body = body.set('name', assumption.name);
    body = body.set('value', assumption.value.toString());
    body = body.set('units', assumption.units);
    body = body.set('source', assumption.source);
    body = body.set('description', assumption.description);
    return this.http.post<any>('/action?action_route=up_assumptions', body)
            .pipe(
              map(res => res as Assumption)
            );
  }

  updateAssumption(assumption: Assumption): Observable<Assumption> {
    let body = new HttpParams();
    body = body.set('id', assumption.id.toString());
    body = body.set('study_area', assumption.study_area.toString());
    body = body.set('scenario', assumption.scenario.toString());
    body = body.set('category', assumption.category);
    body = body.set('name', assumption.name);
    body = body.set('value', assumption.value.toString());
    body = body.set('units', assumption.units);
    body = body.set('source', assumption.source);
    body = body.set('description', assumption.description);
    return this.http.put<any>('/action?action_route=up_assumptions', body)
            .pipe(
              map(res => res as Assumption)
            );
  }

  deleteAssumption(assumption: Assumption): Observable<Assumption> {
    httpOptions.params = assumption;
    return this.http.delete<any>('/action?action_route=up_assumptions', httpOptions)
            .pipe(
              map(res => res as Assumption)
            );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';
import { Scenario } from 'src/app/interfaces/scenario';
import { map } from 'rxjs/operators';
import { Status } from 'src/app/interfaces/status';

let ids = [];

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  params: null
};

const csvOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  responseType: 'text' as 'json',
  params: null
};

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor(private http: HttpClient) { }

  public getScenarios(scenarios: Scenario[]): Observable<any[]> {
    ids = [];
    scenarios.forEach(scen => ids.push(scen.scenarioId));
    httpOptions.params = {
      scenariosId: ids
    };
    return this.http.get<any>('/action?action_route=scenario-results', httpOptions).pipe(
      map(res => res as any[])
    );
  }

  public calculateScenarios(scenarios: Scenario[]): Observable<Status> {
    ids = [];
    scenarios.forEach(scen => ids.push(scen.scenarioId));
    let body = new HttpParams({fromObject: {scenariosId: ids}});
    return this.http.post<any>('/action?action_route=ScenarioUPHandler&action=evaluate', body).pipe(
      map(res => res as Status)
    );
  }

  getUPBuffers(scenarios: Scenario[]): Observable<any[]> {
    ids = [];
    scenarios.forEach(scen => ids.push(scen.scenarioId));
    httpOptions.params = {
      scenariosId: ids
    };
    return this.http.get<any>('/action?action_route=scenario_buffers', httpOptions).pipe(
      map(res => res as any[])
    );
  }

  exportUPResults(scenarios: Scenario[]): Observable<any> {
    ids = [];
    scenarios.forEach(scen => ids.push(scen.scenarioId));
    csvOptions.params = {
      scenariosId: ids
    };
    return this.http.get('/action?action_route=up_results_export', csvOptions);
  }

  dummyExport(): Observable<any> {
    return this.http.get<any>('/assets/data/action', csvOptions);
  }
}

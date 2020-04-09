import { Injectable } from '@angular/core';
import { Scenario } from '../interfaces/scenario';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Status } from '../interfaces/status';
import { map } from 'rxjs/operators';




const httpOptions = {
  
  params: null
};

let ids = [];

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private http: HttpClient) { }

  public statusUP(scenario: Scenario[]): Observable<Status[]> {
    ids = [];
    scenario.forEach(scen => ids.push(scen.scenarioId));
    let body = new HttpParams({fromObject: {scenariosId: ids}});
    return this.http.post<any>('/action?action_route=ScenarioUPHandler&action=status', body).pipe(
      map(res => res as Status[])
    );
  }
}

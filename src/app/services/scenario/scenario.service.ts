import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Scenario } from 'src/app/interfaces/scenario';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const httpOptions = {
  params: null
};

let scenarioIds = [];

@Injectable({
  providedIn: 'root'
})
// Service used to manage Scenarios (CRUD)
export class ScenarioService {

  constructor(private http: HttpClient) { }

  public getScenarios(): Observable<Scenario[]> {
    return this.http.get<Scenario>('/action?action_route=up_scenario')
            .pipe(
              map(res => res as Scenario[])
            );
  }

  public postScenario(scenario: Scenario): Observable<Scenario> {
    let body = new HttpParams();
    body = body.set('studyAreaId', scenario.studyAreaId.toString());
    body = body.set('name', scenario.name);
    body = body.set('isBase', scenario.isBase);
    body = body.set('indicators', scenario.indicators.toString());
    try {
      return this.http.post('/action?action_route=up_scenario', body);

    } catch (e) {
      console.log(e);
    }
  }

  public putScenario(scenario: Scenario): Observable<Scenario> {
    console.log(scenario);
    scenario.isBase = scenario.isBase ? 1 : 0;
    let body = new HttpParams();
    body = body.set('scenarioId', scenario.scenarioId.toString());
    body = body.set('studyArea', scenario.studyArea.toString());
    body = body.set('name', scenario.name);
    body = body.set('description', scenario.description);
    body = body.set('isBase', scenario.isBase);
    try {
      return this.http.put<any>('/action?action_route=up_scenario', body)
            .pipe(
              map(res => res as Scenario)
      );
    } catch (e) {
      console.log(e);
    }
  }

  public deleteScenario(scenario: Scenario): Observable<Scenario> {
    httpOptions.params = scenario;
    try {
      return this.http.delete<any>('/action?action_route=up_scenario', httpOptions)
            .pipe(
              map(res => res as Scenario)
      );
    } catch (e) {
      console.log(e);
    }
  }
}

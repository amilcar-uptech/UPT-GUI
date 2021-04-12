import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';

const httpOptions = {
  params: null
};

@Injectable({
  providedIn: 'root'
})
// Pending functionality. Service used to handle WFS.
export class WfsUptService {

  constructor(private http: HttpClient) { }

  public getUptWfsLayers(): Observable<SelectItem[]> {
    /* ids = [];
    scenarios.forEach(scen => ids.push(scen.scenarioId));
    let body = new HttpParams({fromObject: {scenariosId: ids}});*/
    return this.http.get<any>('/action?action_route=wfs_listing')
                .pipe(
                  map(res => res as SelectItem[])
                );
  }
  
  public importUptWfs(ids: string[]): Observable<any> {
    try {
      let body = new HttpParams({fromObject: {studyAreasId: ids}});
      return this.http.post<any>('/action?action_route=UPTImportPublicLayerData', body);
    } catch (e) {
      console.log(e);
    }
  }

  public deleteUptWfs(ids: string[]): Observable<any> {
    try {
      let body = new HttpParams({fromObject: {studyAreasId: ids}});
      return this.http.delete<any>('/action?action_route=UPTImportPublicLayerData', body);
    } catch (e) {
      console.log(e);
    }
  }

  public getUptWfsColumns(id: number, sa: number): Observable<any[]> {
    /* ids = [];
    scenarios.forEach(scen => ids.push(scen.scenarioId));
    let body = new HttpParams({fromObject: {scenariosId: ids}});*/
    httpOptions.params = {
      study_area: sa,
      layer_name: id
    };
    return this.http.get<any>('/action?action_route=LayersWfsHandler&action=list_columns', httpOptions).pipe(
      map(res => res.columns as any[])
    );
  }

  public testPostWFS() {
    httpOptions.params = {
    };
    return this.http.post('/action?action_route=UPTImportPublicLayerData', httpOptions);
  }
}

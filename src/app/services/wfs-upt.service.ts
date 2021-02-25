import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TreeNode } from 'primeng/api';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  params: null
};

@Injectable({
  providedIn: 'root'
})
// Pending functionality. Service used to handle WFS.
export class WfsUptService {

  constructor(private http: HttpClient) { }

  public getUptWfsLayers(): Observable<TreeNode[]> {
    /* ids = [];
    scenarios.forEach(scen => ids.push(scen.scenarioId));
    let body = new HttpParams({fromObject: {scenariosId: ids}});*/
    return this.http.get<any>('/action?action_route=LayersWfsHandler&action=list_layers').pipe(
      map(res => res.data as TreeNode[])
    );
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
    return this.http.post('/action?action_route=UPTImportPublicLayerData?action=single_layer');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Heatmap } from '../interfaces/heatmap';

@Injectable({
  providedIn: 'root'
})
// Service used to save heatmaps into Oskari, as well as sending a request to fix user layer data
export class HeatmapService {

  constructor(private http: HttpClient) { }

  saveHeatmap(h: Heatmap): Observable<any> {
    let dateGP = new Date();
    h.name += '_' + dateGP.getDate().toString() + '_'
    + dateGP.getMonth() + '_' + dateGP.getFullYear() +
    '_' + dateGP.getHours() + '_' + dateGP.getMinutes();

    let body = new HttpParams();
    body = body.set('name', h.name);
    body = body.set('study_area', h.study_area.toString());
    body = body.set('crs', h.crs);
    body = body.set('description', h.description);
    body = body.set('source', h.source);
    body = body.set('style', h.style);
    body = body.set('geojson', h.geojson);
    return this.http.post<any>('/action?action_route=st_store_heatmap', body);
  }

  fixLayerGPData(): Observable<any> {
    return this.http.get<any>('/action?action_route=fix_data');
  }
}

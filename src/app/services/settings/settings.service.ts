import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Settings } from 'src/app/interfaces/settings';




const httpOptions = {
  
  params: null
};
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) { }

  getSettings(id: string): Observable<Settings[]> {
    return this.http.get<any>('/action?action_route=LayersSTHandler&action=list_st_layers&study_area=' + id)
                .pipe(
                  map(res => res as Settings[])
                );
  }

  postSettings(settings: Settings): Observable<Settings> {
    try {
      let body = new HttpParams();
      body = body.set('st_layer_id', settings.st_layer_id.toString());
      body = body.set('normalization_method', settings.normalization_method.toString());
      body = body.set('range_min', settings.range_min.toString());
      body = body.set('range_max', settings.range_max.toString());
      body = body.set('smaller_better', settings.smaller_better.toString());
      body = body.set('weight', settings.weight.toString());
      return this.http.post<any>('/action?action_route=st_settings', body);
    } catch (e) {
      console.log(e);
    }
  }

  putSettings(settings: Settings): Observable<Settings> {
    try {
      let body = new HttpParams();
      body = body.set('id', settings.id.toString());
      body = body.set('st_layer_id', settings.st_layer_id.toString());
      body = body.set('normalization_method', settings.normalization_method.toString());
      body = body.set('range_min', settings.range_min.toString());
      body = body.set('range_max', settings.range_max.toString());
      body = body.set('smaller_better', settings.smaller_better.toString());
      body = body.set('weight', settings.weight.toString());
      return this.http.put<any>('/action?action_route=st_settings', body);
    } catch (e) {
      console.log(e);
    }
  }

  deleteSettings(settings: Settings): Observable<Settings> {
    httpOptions['params'] = {
      id: settings.id
    };
    try {
      return this.http.delete<any>('/action?action_route=st_settings', httpOptions);
    } catch (e) {
      console.log(e);
    }
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NormalizationMethod } from 'src/app/interfaces/normalization-method';

@Injectable({
  providedIn: 'root'
})
// Service that requests the study areas for the UPT,
// and gets the layers and filters for a selected study area for UrbanHotspots.
export class LayerService {

  constructor(private http: HttpClient) { }

  getStudyAreas(): Observable<SelectItem[]> {
    return this.http.get<any>('/action?action_route=study_area')
                .pipe(
                  map(res => res as SelectItem[])
                );
  }

  getPublicStudyAreas(): Observable<SelectItem[]> {
    return this.http.get<any>('/action?action_route=public_study_area')
                .pipe(
                  map(res => res as SelectItem[])
                );
  }

  getLayers(id: number): Observable<SelectItem[]> {
    return this.http.get<any>('/action?action_route=LayersSTHandler&action=list_st_layers&study_area=' + id)
                .pipe(
                  map(res => res as SelectItem[])
                );
  }

  getLayersPubStdArea(id: number): Observable<SelectItem[]> {
    return this.http.get<any>('/action?action_route=LayersSTHandler&action=list_st_layers_pub_std_area&study_area=' + id)
                .pipe(
                  map(res => res as SelectItem[])
                );
  }

  getPublicLayers(id: number): Observable<SelectItem[]> {
    return this.http.get<any>('/action?action_route=LayersSTHandler&action=list_st_public_layers&study_area=' + id)
                .pipe(
                  map(res => res as SelectItem[])
                );
  }

  getPublicLayersPubStdArea(id: number): Observable<SelectItem[]> {
    return this.http.get<any>('/action?action_route=LayersSTHandler&action=list_st_public_layers_pub_std_area&study_area=' + id)
                .pipe(
                  map(res => res as SelectItem[])
                );
  }

  getFilters(id: number): Observable<SelectItem[]> {
    return this.http.get<any>('/action?action_route=st_filters&study_area=' + id)
                .pipe(
                  map(res => res as any[])
                );
  }

  getFilterSTPubStdArea(id: number): Observable<SelectItem[]> {
    return this.http.get<any>('/action?action_route=st_filters_pub_lyr&study_area=' + id)
                .pipe(
                  map(res => res as any[])
                );
  }

  getPublicFilters(id: number): Observable<SelectItem[]> {
    return this.http.get<any>('/action?action_route=st_public_filters&study_area=' + id)
                .pipe(
                  map(res => res as any[])
                );
  }

  getPublicFilterSTPubStdArea(id: number): Observable<SelectItem[]> {
    return this.http.get<any>('/action?action_route=st_public_filters_pub_lyr&study_area=' + id)
                .pipe(
                  map(res => res as any[])
                );
  }

  getNormalizationMethods(): Observable<SelectItem[]> {
    try {
      return this.http.get<any>('/action?action_route=st_standardization')
                  .pipe(
                    map(res => res as SelectItem[])
                  );
    } catch (e) {
      console.log(e);
    }
  }

  getJoinMethods(): Observable<NormalizationMethod[]> {
    try {
      return this.http.get<any>('/action?action_route=st_operation')
                  .pipe(
                    map(res => res as NormalizationMethod[])
                  );
    } catch (e) {
      console.log(e);
    }
  }
}

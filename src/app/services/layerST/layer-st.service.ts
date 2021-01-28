import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LayerST } from 'src/app/interfaces/layer-st';
import { isNullOrUndefined, isUndefined } from 'util';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  params: null
};

@Injectable({
  providedIn: 'root'
})
// Service used to manage Layers and Filters for UrbanHotspots (CRUD).
export class LayerSTService {

  constructor(private http: HttpClient) { }

  getLayerST(id: string): Observable<LayerST[]> {
    return this.http.get<any>('/action?action_route=st_layers&study_area=' + id)
            .pipe(
              map(res => res as LayerST[])
            );
  }

  getPublicLayerST(id: string): Observable<LayerST[]> {
    return this.http.get<any>('/action?action_route=st_public_layers&study_area=' + id)
            .pipe(
              map(res => res as LayerST[])
            );
  }

  createLayerST(layerST: LayerST): Observable<LayerST> {
    httpOptions['params'] = layerST;
    return this.http.post<any>('/action?action_route=st_layers', {}, httpOptions)
            .pipe(
              map(res => res as LayerST)
            );
  }

  updateLayerST(layerST: LayerST): Observable<LayerST> {
    let body = new HttpParams();
    if (isUndefined(layerST.layer_field.name) && isUndefined(layerST.layer_mmu_code.name)) {
      body = body.set('layerId', layerST.id.toString());
      body = body.set('layerLabel', layerST.st_layer_label);
      body = body.set('field', layerST.layer_field);
      body = body.set('mmuCode', layerST.layer_mmu_code);
    } else if (!isUndefined(layerST.layer_field.name)) {
      if (!isUndefined(layerST.layer_mmu_code.name)) {
        body = body.set('layerId', layerST.id.toString());
        body = body.set('layerLabel', layerST.st_layer_label);
        body = body.set('field', layerST.layer_field.name);
        body = body.set('mmuCode', layerST.layer_mmu_code.name);
      } else {
        body = body.set('layerId', layerST.id.toString());
        body = body.set('layerLabel', layerST.st_layer_label);
        body = body.set('field', layerST.layer_field.name);
        body = body.set('mmuCode', layerST.layer_mmu_code);
      }
    } else if (!isUndefined(layerST.layer_mmu_code.name)) {
      if(!isUndefined(layerST.layer_field.name)) {
        body = body.set('layerId', layerST.id.toString());
        body = body.set('layerLabel', layerST.st_layer_label);
        body = body.set('field', layerST.layer_field.name);
        body = body.set('mmuCode', layerST.layer_mmu_code.name);
      } else {
        body = body.set('layerId', layerST.id.toString());
        body = body.set('layerLabel', layerST.st_layer_label);
        body = body.set('field', layerST.layer_field);
        body = body.set('mmuCode', layerST.layer_mmu_code.name);
      }
    }
    return this.http.put<any>('/action?action_route=st_layers', body)
            .pipe(
              map(res => res as LayerST)
            );
  }

  deleteLayerST(layerST: LayerST): Observable<LayerST> {
    if(isUndefined(layerST.layer_field.name)) {
      httpOptions['params'] = {
          layerId: layerST.id,
          layerLabel: layerST.st_layer_label,
          field: layerST.layer_field
      };
    } else if(!isUndefined(layerST.layer_field.name)) {
      httpOptions['params'] = {
        layerId: layerST.id,
        layerLabel: layerST.st_layer_label,
        field: layerST.layer_field.name
      };
    }
    return this.http.delete<any>('/action?action_route=st_layers', httpOptions)
            .pipe(
              map(res => res as LayerST)
            );
  }

  getFiltersST(id: number): Observable<LayerST[]> {
    return this.http.get<any>('/action?action_route=st_filters&study_area=' + id)
            .pipe(
              map(res => res as LayerST[])
            );
  }

  createFilterST(layerST: LayerST): Observable<LayerST> {
    httpOptions['params'] = layerST;
    return this.http.post<any>('/action?action_route=st_filters', {}, httpOptions)
            .pipe(
              map(res => res as LayerST)
            );
  }

  updateFilterST(layerST: LayerST): Observable<LayerST> {
    let body = new HttpParams();
    body = body.set('filterId', layerST.id.toString());
    body = body.set('filterLabel', layerST.st_filter_label);
    return this.http.put<any>('/action?action_route=st_filters', body)
            .pipe(
              map(res => res as LayerST)
            );
  }

  deleteFilterST(layerST: LayerST): Observable<LayerST> {
    httpOptions['params'] = {
      filterId: layerST.id,
      filterLabel: layerST.st_filter_label
    };
    return this.http.delete<any>('/action?action_route=st_filters', httpOptions)
            .pipe(
              map(res => res as LayerST)
            );
  }
}

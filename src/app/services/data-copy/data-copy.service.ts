import {
  Injectable
} from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import {
  DataCopy
} from 'src/app/interfaces/data-copy';
import {
  Observable
} from 'rxjs';
import {
  MatchLayer
} from 'src/app/interfaces/match-layer';



const httpOptions = {

  params: null
};

@Injectable({
  providedIn: 'root'
})
// Service used to import data from the geoportal into the UPT.
export class DataCopyService {

  constructor(private http: HttpClient) {}

  public copyDataUP(dataCopy: DataCopy): Observable < DataCopy > {
    let array = [];
    dataCopy.tableUP.forEach(
      ele => array.push(ele.name)
    );
    dataCopy.tableUP = array;
    let body = new HttpParams({
      fromObject: {
        tableUP: dataCopy.tableUP,
        table: dataCopy.table
      }
    });
    body = body.set('layerUPName', dataCopy.layerUPName);
    body = body.set('layerName', dataCopy.layerName);
    body = body.set('scenarioId', dataCopy.scenarioId.toString());
    try {
      return this.http.post('/action?action_route=copy_data', body);
    } catch (e) {
      console.log(e);
    }
  }

  public copyDataST(dataCopy: DataCopy): Observable < DataCopy > {
    let array = [];
    dataCopy.tableST.forEach(
      ele => array.push(ele.name)
    );
    dataCopy.tableST = array;
    let body = new HttpParams({
      fromObject: {
        tableST: dataCopy.tableST,
        table: dataCopy.table
      }
    });
    body = body.set('layerSTName', dataCopy.layerSTName);
    body = body.set('layerName', dataCopy.layerName);
    body = body.set('studyAreaId', dataCopy.studyAreaId.toString());
    try {
      return this.http.post('/action?action_route=st_copy_layers', body);
    } catch (e) {
      console.log(e);
    }
  }

  public copyLayersST(matchLayer: MatchLayer): Observable < MatchLayer > {
    let body = new HttpParams();
    body = body.set('layerId', matchLayer.layerId.toString());
    body = body.set('layerLabel', matchLayer.layerLabel.toString());
    body = body.set('field', matchLayer.field.toString());
    body = body.set('mmuCode', matchLayer.mmuCode.toString());
    try {
      return this.http.post('/action?action_route=st_layers', body);
    } catch (e) {
      console.log(e);
    }

  }

  public copyPublicLayersST(matchLayer: MatchLayer): Observable < MatchLayer > {
    let body = new HttpParams();
    body = body.set('layerId', matchLayer.layerId.toString());
    body = body.set('layerLabel', matchLayer.layerLabel.toString());
    body = body.set('field', matchLayer.field.toString());
    body = body.set('mmuCode', matchLayer.mmuCode.toString());
    try {
      return this.http.post('/action?action_route=st_layers_pub_lyr', body);
    } catch (e) {
      console.log(e);
    }
  }

  public copyFiltersST(matchFilter: MatchLayer): Observable < MatchLayer > {
    let body = new HttpParams();
    body = body.set('filterId', matchFilter.filterId.toString());
    body = body.set('filterLabel', matchFilter.filterLabel.toString());
    try {
      return this.http.post('/action?action_route=st_filters', body);
    } catch (e) {
      console.log(e);
    }
  }

  public copyPublicFiltersST(matchFilter: MatchLayer): Observable < MatchLayer > {
    let body = new HttpParams();
    body = body.set('filterId', matchFilter.filterId.toString());
    body = body.set('filterLabel', matchFilter.filterLabel.toString());
    try {
      return this.http.post('/action?action_route=st_public_filters', body);
    } catch (e) {
      console.log(e);
    }
  }
}

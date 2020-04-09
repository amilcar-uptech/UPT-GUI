import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Amenities } from 'src/app/interfaces/amenities';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  params: null
};

@Injectable({
  providedIn: 'root'
})
export class UpMiscService {

  constructor(private http: HttpClient) { }

  deleteTableUP(scenario: any, table: any): Observable<string> {
    httpOptions.params = {
      scenarioId: scenario,
      layerUPName: table
    };
    return this.http.delete<any>('/action?action_route=delete_data', httpOptions).pipe(
      map(res => res as string)
    );
  }
}

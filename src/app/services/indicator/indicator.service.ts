import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {SelectItem} from 'primeng/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Indicator } from 'src/app/interfaces/indicator';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {

  constructor(private http: HttpClient) { }

  public getIndicators(): Observable<Indicator[]> {
    return this.http.get<any>('/action?action_route=IndicatorsUPHandler')
                .pipe(
                  map(response => response as Indicator[])
                );
  }
}

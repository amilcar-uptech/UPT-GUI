import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Column } from 'src/app/domain/column';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { UpColumn } from 'src/app/interfaces/up-column';
import { StColumn } from 'src/app/interfaces/st-column';

@Injectable()
export class ListService {

    constructor(private http: HttpClient) {}

    getUPColumn(id: string): Observable<UpColumn[]> {
        return this.http.get<any>('/action?action_route=LayersUPHandler&action=list_up_columns&layer_id=' + id).pipe(
            map(response => response.upFields as UpColumn[])
        );
    }

    getColumn(id: string): Observable<any[]> {
        return this.http.get<any>('/action?action_route=LayersUPHandler&action=list_columns&layer_id=' + id).pipe(
            map(response => response.columns as any[])
        );
    }

    getSTColumn(): Observable<StColumn[]> {
        try {
            return this.http.get<any>('/action?action_route=LayersSTHandler&action=list_st_columns&table=layers').pipe(
                map(response => response.stFields as StColumn[])
            );
        } catch (e) {
            console.log(e);
        }
    }

    getSTDistancesColumn(id: any): Observable<any[]> {
        try {
            return this.http.get<any>('/action?action_route=LayersSTHandler&action=list_remote_st_columns&layer_id=' + id).pipe(
                map(response => response.upFields as UpColumn[])
            );
        } catch (e) {
            console.log(e);
        }
    }

    getSTColumnWithId(id: string): Observable<any[]> {
        try {
            return this.http.get<any>('/action?action_route=LayersSTHandler&action=list_columns&layer_id=' + id).pipe(
                map(response => response.columns as any[])
            );
        } catch (e) {
            console.log(e);
        }
    }

    getSTColumnFilters(): Observable<StColumn[]> {
        try {
            return this.http.get<any>('/action?action_route=LayersSTHandler&action=list_st_columns&table=filters').pipe(
                map(response => response.stFields as StColumn[])
            );
        } catch (e) {
            console.log(e);
        }
    }

    getSTColumnFiltersWithId(id: string): Observable<any[]> {
        try {
            return this.http.get<any>('/action?action_route=LayersSTHandler&action=list_columns&layer_id=' + id).pipe(
                map(response => response.columns as any[])
            );
        } catch (e) {
            console.log(e);
        }
    }

    getSTColumnMMU(): Observable<Column[]> {
        try {
            return this.http.get<any>('/action?action_route=LayersSTHandler&action=list_st_columns&table=mmu').pipe(
                map(response => response.columns)
            );
        } catch (e) {
            console.log(e);
        }
    }

    getSTColumnMMUWithId(id: string): Observable<any[]> {
        try {
            return this.http.get<any>('/action?action_route=list_suitability_layers&table=' + id).pipe(
                map(response => response.columns as any[])
            );
        } catch (e) {
            console.log(e);
        }
    }

    getSTColumnData(id: string): Observable<any[]> {
        try {
            return this.http.get<any>('/action?action_route=list_suitability_layer_columns&layer_id=' + id).pipe(
                map(response => response.columns as any[])
            )
        } catch (e) {
            console.log(e);
        }
    }
}

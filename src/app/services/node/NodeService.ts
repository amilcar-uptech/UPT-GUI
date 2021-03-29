import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {TreeNode} from 'primeng/api';
import { map } from 'rxjs/operators';

@Injectable()
// Service used to get data for PrimeNG tree elements
export class NodeService {
    constructor(private http: HttpClient) {}

    getUPLayers(id: string) {
        return this.http.get<any>('/action?action_route=LayersUPHandler&action=list_up_layers&id=' + id)
                    .toPromise()
                    .then(res => res.data as TreeNode[]);
    }

    getUPTables(id: string) {
        return this.http.get<any>('/action?action_route=LayersUPHandler&action=list_up_layers&id=' + id).pipe(
            map(res => res.data as TreeNode[])
        );
    }

    getUPPublicTables(id: string) {
        return this.http.get<any>('/action?action_route=LayersUPHandler&action=list_up_public_layers&id=' + id).pipe(
            map(res => res.data as TreeNode[])
        );
    }


    getSTTables(id: string) {
        return this.http.get<any>('/action?action_route=LayersSTHandler&action=list_remote_st_tables&study_area=' + id)
                    .toPromise()
                    .then(res => res as TreeNode[]);
    }

    getSTLayers(id: string) {
        return this.http.get<any>('/action?action_route=list_oskari_layers&studyArea=' + id)
                    .toPromise()
                    .then(res => res.data as TreeNode[]);
    }

    getLayers() {
        return this.http.get<any>('/action?action_route=LayersUPHandler&action=list_layers')
                    .toPromise()
                    .then(res => res.data as TreeNode[]);
    }

    getLayersST() {
        return this.http.get<any>('/action?action_route=LayersSTHandler&action=list_layers')
                    .toPromise()
                    .then(res => res.data as TreeNode[]);
    }
}

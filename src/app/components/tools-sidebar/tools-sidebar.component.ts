import { Component, OnInit, Input } from '@angular/core';
import { NodeService } from 'src/app/services/node/NodeService';
import { TreeNode, MessageService } from 'primeng/api';
import { ListService } from 'src/app/services/list/list.service';
import { Column } from 'src/app/domain/column';
import { Layer } from 'src/app/interfaces/layer';
import { SelectItem } from 'primeng/api';
import { Indicator } from 'src/app/interfaces/indicator';
import { Scenario } from 'src/app/interfaces/scenario';
import { ScenarioService } from 'src/app/services/scenario/scenario.service';
import { Scenarios } from 'src/app/interfaces/results';
import { ResultsService } from 'src/app/services/results/results.service';
import { Observable } from 'rxjs';
import { LayerService } from 'src/app/services/layer/layer.service';
import { DataCopy } from 'src/app/interfaces/data-copy';
import { DataCopyService } from 'src/app/services/data-copy/data-copy.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { Settings } from 'src/app/interfaces/settings';
import { StatusService } from '../../services/status.service';
import { MatchLayer } from 'src/app/interfaces/match-layer';
import { NormalizationMethod } from '../../interfaces/normalization-method';
import { StEvaluationService } from 'src/app/services/st-evaluation.service';
import chroma from 'chroma-js';
import { Assumption } from 'src/app/interfaces/assumption';
import { AssumptionService } from 'src/app/services/assumption/assumption.service';
import { LayerST } from 'src/app/interfaces/layer-st';
import { LayerSTService } from 'src/app/services/layerST/layer-st.service';
import { MethodService } from 'src/app/services/method/method.service';
import { ModuleService } from 'src/app/services/module/module.service';
import { Amenities } from 'src/app/interfaces/amenities';
import { UpMiscService } from 'src/app/services/up-misc/up-misc.service';
import { UpColumn } from 'src/app/interfaces/up-column';
import { IndResult } from 'src/app/interfaces/ind-result';
import { IndUp } from 'src/app/interfaces/ind-up';
import { Module } from 'src/app/interfaces/module';
import { StColumn } from 'src/app/interfaces/st-column';
import { ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Classification } from 'src/app/interfaces/classification';
import { ClassificationService } from 'src/app/services/classification/classification.service';
import { Status } from 'src/app/interfaces/status';
import { Heatmap } from 'src/app/interfaces/heatmap';
import { HeatmapService } from 'src/app/services/heatmap.service';
import { WfsUptService } from 'src/app/services/wfs-upt.service';
import { saveAs } from 'file-saver';
import { ShareLayersService } from 'src/app/services/share-layers.service';
import { RoleService } from 'src/app/services/role.service';
import { UrbanHotspotsComponent } from '../urban-hotspots/urban-hotspots.component';
import { UrbanPerformanceComponent } from '../urban-performance/urban-performance.component';

declare var Oskari: any;

@Component({
  selector: 'app-tools-sidebar',
  templateUrl: './tools-sidebar.component.html',
  styleUrls: ['./tools-sidebar.component.scss'],
  providers: [MessageService],
})

export class ToolsSidebarComponent implements OnInit {
  
  @ViewChild(UrbanHotspotsComponent, {static: false}) urbanHotspots: UrbanHotspotsComponent;
  @ViewChild(UrbanPerformanceComponent, {static: false}) urbanPerformance: UrbanPerformanceComponent;
  /**
   *  Misc. Variables: General use variables that aren't used by either UrbanHotspots or UrbanPerformance
   */
  @Input()
  uptWindow: Window & {
    __session_active?: boolean;
  };

  
  errHtml = '';
  procHtml = '';
  displayEvaluation = false;
  displayConsole = false;

  oskariUrl = '/Oskari/dist/wbidp/geoportal';

  geojsonTest;
  numArrTest = [];

  dateGP: Date;
  dateStringGP = '';

  displayShare = false;
  displayUptWfs = false;

  hasUPTRole = false;
  isUPTAdmin = false;

  // UPT WFS variables
  wfsStudyArea: SelectItem[];
  wfsSelectedStudyArea: Layer[];
  uptWfs: SelectItem[];
  selectedUptWfs: TreeNode;
  colFieldsNameArrayUptWfs = [];
  listManageDataUptWfs: any[];
  columnsHeaderUptWfs = '';
  columnFieldsArrayUptWfs: Column[] = [];
  listDataUptWfs: UpColumn[];

  // Block Document
  blockedDocument = false;

  displayTools: boolean;

  // Properties to determine which plugin is active
  upAct = false;
  stAct = false;

  shareLayersList: any[];
  shareLayer: any;

  /**
   * Misc. Functions: Functions that are not involved in either ST or UP
   */
  // Error handler for the console for most service calls.
  logErrorHandler(error) {
    let errContainer = [];
    const errObject = error.error.info.Errors;
    errObject.forEach((err) => {
      errContainer.push({ message: err.message, status: err.status });
    });
    errContainer.forEach((err) => {
            this.errHtml +=
              '<div class="ui-md-4">' +
              err.status +
              '</div><div class="ui-md-8">' +
              err.message +
              '</div>';
          });
    this.showConsole();
    this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!',
    });
  }

  // Clears the error console.
  clearConsole() {
    this.errHtml = '';
  }

  // Clears the evaluation console.
  clearEvaluation() {
    this.procHtml = '';
  }

  // PrimeNG document blocking.
  blockDocument() {
    this.blockedDocument = true;
  }

  // PrimeNG document unblocking.
  unblockDocument() {
    this.blockedDocument = false;
  }

  // Displays the error console
  showConsole() {
    this.displayConsole = true;
  }

  // Displays the evaluation console
  showEvaluation() {
    this.displayEvaluation = true;
  }

  // Hides de error console
  hideConsole() {
    this.displayConsole = false;
  }

  // Hides the evaluation console
  hideEvaluation() {
    this.displayEvaluation = false;
  }

  // Toggles the error console
  toggleErrorConsole() {
    this.displayConsole = !this.displayConsole;
  }

  // Toggles the 
  toggleProgressConsole() {
    this.displayEvaluation = !this.displayEvaluation;
  }

  // Pending functionality. Toggles WFS dialog.
  toggleUptWfs() {
    this.loadUptWfsLayers();
    this.displayUptWfs = !this.displayUptWfs;
  }

  testWFS() {
    this.blockDocument();
    this.messageService.add({
      severity: 'info',
      summary: 'In Progress!',
      detail: 'Your operation is being processed.',
    });
    this.wfsUptService.testPostWFS().subscribe(
      () => {},
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!',
        });
        this.unblockDocument();
      },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Feature data was imported successfully!',
        });
        this.unblockDocument();
      }
    );
  }

  importUptWfs() {
    this.blockDocument();
    this.messageService.add({
      severity: 'info',
      summary: 'In Progress!',
      detail: 'Your operation is being processed.',
    });
    let lyrId = [];
    this.wfsSelectedStudyArea.forEach((lyr) => {
      lyr.id = lyr.id.replace("pub_","");
      lyrId.push(lyr.id);
    });
    this.wfsUptService.importUptWfs(lyrId).subscribe(
      () => {},
      (error) => {
        this.logErrorHandler(error);
        this.unblockDocument();
      },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Feature data was imported successfully!',
        });
        this.unblockDocument();
      }
    );
  }

  deleteUptWfs() {
    this.messageService.add({
      key: 'confirmDeleteWfs',
      sticky: true,
      severity: 'warn',
      summary: 'Warning!',
      detail:
        'This operation will delete all imported data from the selected WFS. This process is irreversible. ' +
        'Confirm to delete, cancel to go back',
    });
  }

  confirmDeleteWfs() {
    this.blockDocument();
    this.messageService.add({
      severity: 'info',
      summary: 'In Progress!',
      detail: 'Your operation is being processed.',
    });
    let lyrId = [];
    console.log(this.wfsSelectedStudyArea);
    this.wfsSelectedStudyArea.forEach((lyr) => {
      console.log(lyr);
      lyr.id = lyr.id.replace("pub_","");
      lyrId.push(lyr.id);
    });
    console.log(lyrId)
    this.wfsUptService.deleteUptWfs(lyrId).subscribe(
      () => {},
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!',
        });
        this.unblockDocument();
        this.messageService.clear('confirmDeleteWfs');
        this.logErrorHandler(error);
      },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Feature data was deleted successfully!',
        });
        this.unblockDocument();
        this.messageService.clear('confirmDeleteWfs');
      }
    );
  }

  cancelDeleteWfs() {
    this.messageService.clear('confirmDeleteWfs');
  }

  // Toggles Share Layers dialog.
  toggleShare() {
    if (!this.displayShare) {
      this.shareLayerService.getShareLayers().subscribe(
        (lyr) => {
          this.shareLayersList = lyr;
        },
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.displayShare = !this.displayShare;
        }
      );
    }
  }

  // Displays changeLayerStatus dialog
  shareLayerStatus(event) {
    this.messageService.add({
      key: 'changeLayerStatus',
      sticky: true,
      severity: 'warn',
      summary: 'Warning!',
      detail:
        'The following operation will make the selected layer public or private. Select ' +
        'the option that better suits your needs. Click on the \'x\' to cancel.',
    });
  }

  // Sends a request to make a layer public
  publishLayer() {
    this.shareLayerService.postShareLayers(this.shareLayer.id, 1).subscribe(
      () => {
        this.messageService.add({
          severity: 'info',
          summary: 'In Progress!',
          detail: 'Your operation is being processed.',
        });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!',
        });
      },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Process was completed successfully!',
        });
        this.messageService.clear('changeLayerStatus');
      }
    );
  }

  // Sends a request to make a layer private
  privatizeLayer() {
    this.shareLayerService.postShareLayers(this.shareLayer.id, 0).subscribe(
      () => {
        this.messageService.add({
          severity: 'info',
          summary: 'In Progress!',
          detail: 'Your operation is being processed.',
        });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!',
        });
      },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Process was completed successfully!',
        });
        this.messageService.clear('changeLayerStatus');
      }
    );
  }

  // Sends a request to clean user layers for easier use with the UPT.
  fixLayersGP() {
    this.messageService.add({
      severity: 'info',
      summary: 'In Progress!',
      detail: 'Your operation is being processed.',
    });
    this.heatmapService.fixLayerGPData().subscribe(
      () => {},
      (error) => {
        this.logErrorHandler(error);
      },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Process was completed successfully!',
        });
      }
    );
  }

  // Pending functionality. Sends a request to get the WFS layers.
  loadUptWfsLayers() {
    this.wfsUptService.getUptWfsLayers().subscribe(
      (lyr) => {
        this.wfsStudyArea = lyr;
      },
      (error) => {
        this.logErrorHandler(error);
      }
    );
  }

  // Shows the main ST dialog and loads important variables to run its calculations
  showST() {
    this.upAct = false;
    this.stAct = true;
    this.urbanHotspots.startST();
  }

  // Displays the main UP dialog, as well as sends requests needed for the different elements needed for operations.
  noLoadST() {
    this.urbanHotspots.showNoLoadST();
  }

  showUP() {
    this.upAct = true;
    this.stAct = false;
    this.urbanPerformance.startUP();
  }

  noLoadUP() {
    this.urbanPerformance.showNoLoadUP();
  }

  constructor(
    private messageService: MessageService,
    private heatmapService: HeatmapService,
    private wfsUptService: WfsUptService,
    private shareLayerService: ShareLayersService,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    // Sets up the initial state of a number of variables used by the UPT
    this.displayTools = true;
    if (this.uptWindow) {
      this.roleService.getRoles().subscribe((role) => {
        role.forEach((str) => {
          if (str.toLowerCase().includes('upt')) {
            this.hasUPTRole = true;
          }
          if (str.toLowerCase().includes('uptadmin')) {
            this.isUPTAdmin = true;
          }
        });
      });
    }
  }
}

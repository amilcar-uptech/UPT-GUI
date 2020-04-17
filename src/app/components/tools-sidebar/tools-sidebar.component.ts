import { Component, OnInit, Input } from '@angular/core';
import { NodeService } from 'src/app/services/node/NodeService';
import {TreeNode, MessageService} from 'primeng/api';
import { ListService } from 'src/app/services/list/list.service';
import { Column } from 'src/app/domain/column';
import { Layer } from 'src/app/interfaces/layer';
import {SelectItem} from 'primeng/api';
import { Indicator } from 'src/app/interfaces/indicator';
import { IndicatorService } from 'src/app/services/indicator/indicator.service';
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
import {ViewChild} from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Classification } from 'src/app/interfaces/classification';
import { ClassificationService } from 'src/app/services/classification/classification.service';
import { Status } from 'src/app/interfaces/status';
import { Heatmap } from 'src/app/interfaces/heatmap';
import { HeatmapService } from 'src/app/services/heatmap.service';
import { WfsUptService } from 'src/app/services/wfs-upt.service';
import { saveAs } from 'file-saver';

declare var Oskari: any;

@Component({
  selector: 'app-tools-sidebar',
  templateUrl: './tools-sidebar.component.html',
  styleUrls: ['./tools-sidebar.component.scss'],
  providers: [MessageService]
})

export class ToolsSidebarComponent implements OnInit {
  /**
   *  Misc. Variables
   */
  @ViewChild('tabsetUP', {static: false}) tabsetUP: NgbTabset;

  @Input()
  uptWindow: Window & {
    __session_active?: boolean
  };

  oskariUrl = '/Oskari/dist/1.1.1/geoportal';

  dateGP: Date;
  dateStringGP = '';

  displayAbout = false;
  displayUptWfs = false;

  // UPT WFS variables
  wfsStudyArea: SelectItem[];
  wfsSelectedStudyArea: Layer;
  uptWfs: TreeNode[];
  selectedUptWfs: TreeNode;
  colFieldsNameArrayUptWfs = [];
  listManageDataUptWfs: any[];
  columnsHeaderUptWfs = '';
  columnFieldsArrayUptWfs: Column[] = [];
  listDataUptWfs: UpColumn[];

  // Data and options used for chart in UP
  dataColorsUP: string[] = ['#FF8680', '#43D9B7', '#4287F5', '#FCBA03'];

  // Block Document
  blockedDocument = false;
  
  displayTools: boolean;

  // Properties to determine which plugin is active
  @Input() upAct: boolean;
  @Input() stAct: boolean;

  // Properties for range sliders
  filterRangeST: number[];

  columnDataGP: string[] = [];

  /**
   * UP Variables
   */

  // Status
  statusUP: Status[] = [];
  errHtml = '';
  procHtml = '';
  buffersUP = [];

  // Collapsed state of UP steps
  studyAreaCollapsed = false;
  createScenarioCollapsed = true;
  manageDataCollapsed = true;
  scenariosCollapsed = true;
  resultsCollapsed = true;

  // Status of UP steps
  studyAreaDone = false;
  createScenarioDone = false;
  manageDataDone = false;
  scenariosDone = false;
  resultsDone = false;

  // Create scenario properties
  isBaseUP = false;

  // Properties to display UP dialogs
  displayUP = false;
  displayConsole = false;
  displayEvaluation = false;
  displayManageDataUP = false;
  displayAssumptions = false;
  editAssumptions = false;
  displayIndicatorsModule = false;
  editScenario = false;
  editClassification = false;
  editModule = false;
  editIndicator = false;
  editIndResult = false;
  editAmenities = false;
  editRoads = false;
  editTransit = false;
  editRisks = false;
  editFootprints = false;
  editJobs = false;

  // Data provided by NodeService UP
  layersUP: TreeNode[];
  layers: TreeNode[];
  tablesUP: TreeNode[];
  selectedTable: TreeNode;
  selectedLayerUP: TreeNode;
  selectedLayer: TreeNode;

  // Cities
  studyArea: SelectItem[];
  selectedStudyAreaUP: Layer;

  // Properties to change icons of collapsible UP steps
  showCreate: boolean;
  showManage: boolean;
  showResults: boolean;
  showScenariosUP: boolean;

  // Data provided by ListService UP
  listManageDataUP: any[];
  listDataUP: UpColumn[];
  selectedColumn: Column;
  selectedUPColumn: Column;

  // Indicators
  indicators: Indicator[];
  indSelectItems: SelectItem[] = [];
  selectedIndicators: Indicator[];
  indArray;
  selIndText = '';

  selectedCityAssumptions: Layer;

  // Scenarios
  newScenario: Scenario;
  scenarios: Scenario[];
  scenarioManage: Scenario;
  scenarioAssumptions: Scenario;
  selectedScenarios: Scenario[] = [];
  scenarioName: string;
  scenarioLocation: string;
  scenariosCalculate: number[] = [];
  selScenIdArray = [];
  isNewScenario: boolean;
  selScenario: Scenario;

  // Assumptions
  assumptionName: string;
  assumptionCategory: string;
  assumptionValue: number;

  // Results
  scenarioResults: any[] = [];
  rsltLabels: any[] = [];
  rsltLabelsArray: any[] = [];
  rsltLabelsPercent: any[] = [];
  rsltUnits: any[] = [];
  rsltValues: any[] = [];
  rsltValuesPercent: any[] = [];
  resultDatasets: any[] = [];
  resultDataUP: any;
  resultOptionsUP: any;

  goalsArray: any[] = [];
  goalsLabelArray: any[] = [];
  goalsValues: any[] = [];

  // Results
  resultsScenarios: Scenarios[];

  // Assumptions
  uploadedAssumptions: any[] = [];
  asmptStudyAreaFile: Layer;
  asmptScenarioManage: Scenario;
  assumptions: Assumption[];
  selAssumption: Assumption;
  isNewAssumption: boolean;
  assumptionManage: Assumption;

  // Classification
  isNewClassification = false;
  manageClassification: Classification;
  selClassification: Classification;
  classifications: Classification[] = [];

  // UP Tables
  upTablesScenario: Scenario;

  // Modules
  isNewModule = false;
  manageModules: Module;
  selModule: Module;
  modules: Module[] = [];

  // Indicator
  isNewIndicator = false;
  manageIndicators: IndUp;
  selIndicator: IndUp;
  inds: IndUp[] = [];

  // Indicator Results
  isNewIndResult = false;
  indsEditResult: SelectItem[] = [];
  manageIndResults: IndResult;
  selIndResult: IndResult;
  indsResult: IndResult[] = [];

  // Amenities
  isNewAmenities = false;
  manageAmenities: Amenities;
  selAmenities: Amenities;
  amenities: Amenities[] = [];

  // Roads
  isNewRoads = false;
  manageRoads: Amenities;
  selRoads: Amenities;
  roads: Amenities[] = [];

  // Transit
  isNewTransit = false;
  manageTransit: Amenities;
  selTransit: Amenities;
  transit: Amenities[] = [];

  // Risks
  isNewRisks = false;
  manageRisks: Amenities;
  selRisks: Amenities;
  risks: Amenities[] = [];

  // Footprints
  isNewFootprints = false;
  manageFootprints: Amenities;
  selFootprints: Amenities;
  footprints: Amenities[] = [];

  // Jobs
  isNewJobs = false;
  manageJobs: Amenities;
  selJobs: Amenities;
  jobs: Amenities[] = [];

  // Manage Data UP variables
  manageDataHeaderUP = '';
  columnsHeaderUP = '';
  columnFieldsArrayUP: Column[] = [];
  colFieldsNameArrayUP: any[] = [];

  // import data
  dataCopy: DataCopy;

  // Manage variables for objects
  manageScenario: Scenario;

  // Download object
  downloadObject: any;

  // selScenarios copy
  scenariosCopy: Scenario[];

  okayResults = true;

  // Cols for managing objects
  colsScenario: any[];
  colsAssumption: any[];
  colsClassification: any[];
  colsResults: any[] = [];
  colsAmenities: any[];
  colsRoads: any[];
  colsTransit: any[];
  colsRisks: any[];
  colsFootprints: any[];
  colsJobs: any[];
  colsModules: any[];
  colsIndicators: any[];
  colsIndResults: any[];
  colsLayersSettings: any[];
  colsLayer: any[];
  colsFilter: any[];
  colsSetting: any[];
  colsManageSetting: any[];
  colsNormMethod: any[];
  colsJoinMethod: any[];

  /**
   * ST variables
   */

  // Status
  statusST: Status[] = [];

  // Distance Layers
  distanceLayerST = [];

  displayST = false;
  displayColorScaleST = false;
  displaySaveHeatmap = false;
  displayManageDataST = false;
  displayAdminST = false;
  displayDistanceModule = false;
  displayDataST = false;
  displayMethodsST = false;
  editLayers = false;
  editFilters = false;
  editSettings = false;
  editNormMethod = false;
  editJoinMethod = false;

  accordionST = 0;

  // Data containing labels for filters in ST
  filters: any[];

  // Static methods
  staticNormST: SelectItem[] = [];
  staticJoinST: SelectItem[] = [];

  // Data provided by NodeService ST
  layersDataST: TreeNode[];
  layersManageDataST: TreeNode[];
  selectedLayerST: TreeNode;
  selectedLayerManageST: TreeNode;

  selectedStudyAreaST: Layer;
  studyAreaMMUST: Layer;
  studyAreaDistanceST: Layer;

  // ST Layers and filters
  // layersST$: Observable<Layer[]>;
  // layersSuitability: boolean[];

  layersST$: Observable <SelectItem[]>;
  layersST: SelectItem[];
  layerSettings: any[];
  layersMMUST: TreeNode[];
  tablesST: TreeNode[];
  selLayerMMUST: TreeNode;
  selTableST: TreeNode;
  selDistanceLayerST: TreeNode;
  listDataST: StColumn[];
  listDataOtherST: Column[];
  listDataDistancesST: UpColumn[];
  listManageDistanceST: any[] = [];
  columnHeaderDistancesST = '';

  selectedLayersST: any[] = [];
  filtersST$: Observable <SelectItem[]>;
  filterList: any[];
  filtersST: SelectItem[];
  selectedFiltersST: number[];
  selectedFiltersArrayST = [];
  studyAreaST: SelectItem[];
  stdAreaSTDistances: Layer;
  stdAreaSTEvalDist: Layer;

  // ST settings
  settingsST$: Observable<Settings[]>;
  settings: Settings[] = [];
  settingsType: NormalizationMethod[];
  typeArray: NormalizationMethod[] = [];
  rangeArray: number[][] = [];
  weightArray: any[] = [];
  smallerBetterArray: any[] = [];
  constMax: any[] = [];
  constMin: any[] = [];
  rangeDisabledArray: any[] = [];
  settingsEvaluate: any[] = [];
  settingsString = '';
  selSetting: Settings[] = [];
  clonedSettings: { [s: string]: Settings; } = {};

  // import data
  dataCopyST: DataCopy;

  // Manage Data ST variables
  distanceHeaderST = '';
  columnsHeaderST = '';
  columnFieldsArrayST: Column[] = [];
  colFieldsNameArrayST: any[] = [];

  // Manage Data ST variables
  listManageDataST: any[];
  selectedLayerDataST: TreeNode;
  selectedLayerManageDataST: TreeNode;
  layerSTLabel: string;

  columnDataST: any[];
  matchLayer: MatchLayer;
  layerSTId: number;
  dataSettings: Settings[];
  layerSTField: Layer;
  layerSTMMU: Layer;
  // ST
  columnsHeaderFiltersST = '';
  columnDataFilterST: any[];
  matchFilter: MatchLayer;
  filterSTId: number;
  filterSTField: Layer;
  filterSTLabel: string;
  listManageDataFiltersST: any[];
  selectedFilter: TreeNode;
  filtersDataST: TreeNode[];
  listFiltersDataST: StColumn[];
  // ST
  columnsHeaderMMUST = '';
  columnDataMMUST: any[];
  matchMMU: MatchLayer;
  MMUSTId: number;
  MMUSTField: Layer;
  MMUSTLabel: string;
  listManageDataMMUST: any[];
  selectedMMU: TreeNode;
  MMUDataST: TreeNode[];
  listMMUDataST: Column[];

  // ST
  joinType: NormalizationMethod[];
  joinMethod: NormalizationMethod;
  // ST
  colors = chroma.scale(['#C70039', '#fd8702', '#fdc002', '#a2fd02', '#02e2fd', '#0265fd']);
  scaleColorsST = ['#C70039', '#fd8702', '#fdc002', '#a2fd02', '#02e2fd', '#0265fd'];
  scaleNumbersST = [0, 20, 40, 60, 80, 100];

  // LayersST
  isNewLayer = false;
  stdAreaLayer: SelectItem[];
  stdAreaManageLayer: Layer;
  manageLayer: LayerST;
  selLayer: LayerST;
  selLayerColumns: any[];
  layersSTManage: LayerST[] = [];

  // FiltersST
  isNewFilter = false;
  stdAreaFilter: SelectItem[];
  stdAreaManageFilter: Layer;
  manageFilter: LayerST;
  selFilter: LayerST;
  selFilterColumns: any[];
  filtersSTManage: LayerST[] = [];

  // SettingsST
  isNewSetting = false;
  isDefaultSetting = false;
  stdAreaSetting: SelectItem[];
  stdAreaManageSetting: Layer;
  manageSetting: Settings;
  selManageSetting: Settings;
  settingsSTManage: Settings[] = [];

  // Normalization Method
  isNewNormMethod = false;
  dropdownNormMethod: SelectItem[] = [];
  manageNormMethod: NormalizationMethod;
  selNormalization: NormalizationMethod;
  normMethodsSTManage: NormalizationMethod[] = [];

  // Join Method
  isNewJoinMethod = false;
  dropdownJoinMethod: SelectItem[] = [];
  manageJoinMethod: NormalizationMethod;
  selJoin: NormalizationMethod;
  joinMethodsSTManage: NormalizationMethod[] = [];

  // Oskari variables for displaying data on map (ST)
  rn = 'MapModulePlugin.AddFeaturesToMapRequest';
  layerOptions = {};

  geojsonObject: any;
  fullGeojson: any;
  valuesST = [];

  oskariHeatmap: Heatmap;
  oskariResponse: any;

  stResult = true;

  /**
   * Misc. Functions
   */

  clearConsole() {
    this.errHtml = '';
  }

  clearEvaluation() {
    this.procHtml = '';
  }

  showAbout() {
    this.displayAbout = true;
  }

  hideAbout() {
    this.displayAbout = false;
  }

  blockDocument() {
    this.blockedDocument = true;
  }

  unblockDocument() {
    this.blockedDocument = false;
  }

  toggleUptWfs() {
    this.displayUptWfs = !this.displayUptWfs;
  }

  fixLayersGP() {
    this.messageService.add({
      severity: 'info',
      summary: 'In Progress!',
      detail: 'Your operation is being processed.'
    });
    this.heatmapService.fixLayerGPData().subscribe(
      () => {}, error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      }, () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Process was completed successfully!'
        });
      }
    );
  }

  loadUptWfsLayers() {
    this.wfsUptService.getUptWfsLayers().subscribe(lyr => {
      this.uptWfs = lyr;
    }, error => {
       let errContainer = [];
       const errObject = error.error.info.Errors;
       errObject.forEach(err => {
       errContainer.push({message: err.message, status: err.status});
       });
       errContainer.forEach(err => {
       this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
       err.message + '</div>';
       });
       this.showConsole();
       this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'An error ocurred during the operation!'});
    }
      );
    this.layersService.getStudyAreas().subscribe(studyArea => {
        this.wfsStudyArea = studyArea;
      }, error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
            err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!'
          });
      }
      );
  }

  loadUptWfsColumns(event) {
    if (event.node.type.toLowerCase() === 'layer') {
      this.wfsUptService.getUptWfsColumns(event.node.data, this.wfsSelectedStudyArea.id).subscribe(uptwfs => {
        this.listManageDataUptWfs = uptwfs;
      }, error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
            err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'An error ocurred during the operation!'});
      }
      );
    }
  }

  importUptWfs() {
    if (this.wfsSelectedStudyArea) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'You\'re sending the following Study Area: ' + this.wfsSelectedStudyArea.id
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Please select a study area!'
      });
    }
  }

  /**
   * Functions for UP
   */

  showUP() {
    this.indSelectItems = [];
    this.indsEditResult = [];
    this.selectedScenarios = [];
    this.indicatorService.getIndicators().subscribe(
      indicators => {
        this.indicators = indicators;
      }, error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      },
      () => {
        this.indicators.forEach(
          indicator => {
            this.indSelectItems.push({label: indicator.label, value: indicator});
          }
        );
      }
      );
    this.layersService.getStudyAreas().subscribe(studyArea => {
      this.studyArea = studyArea;
    }, error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    }
    );
    this.classificationService.getClassifications().subscribe(clsf => this.classifications = clsf,
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      });
    this.moduleService.getModules().subscribe(mdls => this.modules = mdls,
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      });
    this.moduleService.getIndicators().subscribe(
      inds => {
        this.inds = inds;
        inds.forEach(ind => this.indsEditResult.push({value: ind.id, label: ind.indicator}));
      }, error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      }
    );
    this.moduleService.getIndicatorResults().subscribe(
      indRes => this.indsResult = indRes,
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      }
    );
    this.getScenarios();
    this.displayUP = true;
  }

  showConsole() {
    this.displayConsole = true;
  }

  showEvaluation() {
    this.displayEvaluation = true;
  }

  showNoLoadUP() {
    this.displayUP = true;
  }

  hideUP() {
    this.displayUP = false;
  }

  hideConsole() {
    this.displayConsole = false;
  }

  hideEvaluation() {
    this.displayEvaluation = false;
  }

  toggleErrorConsole() {
    this.displayConsole = !this.displayConsole;
  }

  toggleProgressConsole() {
    this.displayEvaluation = !this.displayEvaluation;
  }

  showManageDataUP() {
    this.displayManageDataUP = true;
  }

  showAssumptions() {
    this.displayAssumptions = true;
  }

  showIndicatorsModule() {
    this.displayIndicatorsModule = true;
  }

  hideAssumptions() {
    this.displayAssumptions = false;
  }

  hideIndicatorsModule() {
    this.displayIndicatorsModule = false;
  }

  hideManageDataUP() {
    this.displayManageDataUP = false;
  }

  collapseStudyArea() {
    this.studyAreaCollapsed = true;
  }

  collapseCreateScenario() {
    this.createScenarioCollapsed = true;
  }

  collapseManageData() {
    this.manageDataCollapsed = true;
  }

  collapseScenarios() {
    this.scenariosCollapsed = true;
  }

  collapseUPResults() {
    this.resultsCollapsed = true;
  }

  openStudyArea() {
    this.studyAreaCollapsed = false;
  }

  openCreateScenario() {
    this.createScenarioCollapsed = false;
  }

  openManageData() {
    this.manageDataCollapsed = false;
  }

  openScenarios() {
    this.scenariosCollapsed = false;
  }

  openUPResults() {
    this.resultsCollapsed = false;
  }

  finishStudyArea() {
    this.studyAreaDone = true;
  }

  finishCreateScenario() {
    this.createScenarioDone = true;
  }

  finishManageData() {
   this.manageDataDone = true;
  }

  finishScenarios() {
    this.scenariosDone = true;
  }

  changeIndicator(event) {
    const indAry = event.value;
    if (indAry.length > 0) {
      const indSel = event.itemValue;
      const indDep = indSel.dependencies;
      const indList = this.indSelectItems;
      let origString = '';
      let arrayString: string[] = [];
      let newArrayString: string[] = [];
      let depAry = [];
      origString = indDep.replace(/"/g, '').replace('[', '').replace(']', '');
      arrayString = origString.split(',');
      arrayString.forEach(str => {
        newArrayString.push(str.trim());
      });
      newArrayString.forEach(ary => {
        indList.forEach(ind => {
          if (ind.value.name.toLowerCase() === ary.toLowerCase()) {
            depAry.push(ind.value);
          }
        });
      });
      depAry.forEach(dep => {
        if (!indAry.includes(dep)) {
          event.value.push(dep);
        }
      });
    }
  }

  getUPResults() {
    if(this.selectedScenarios.length > 0) {
      this.scenariosCopy = this.selectedScenarios;
      this.okayResults = true;
      this.resultsService.getScenarios(this.selectedScenarios).subscribe(
        scnr => {
          this.scenarioResults = scnr;
        },
        error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
            err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!'
          });
         },
         () => {
          this.scenarioResults.forEach(rslt => {
            if (rslt.results.length > 0) {
              this.okayResults = false;
            }
          });
          this.rsltLabels = [];
          this.rsltLabelsArray = [];
          this.rsltLabelsPercent = [];
          this.rsltUnits = [];
          this.rsltValues = [];
          this.rsltValuesPercent = [];
          this.resultDatasets = [];

          this.goalsArray = [];
          this.goalsLabelArray = [];
          this.goalsValues = [];

          let fullRslt = [];
          let rslVal = [];
          let tmpRslt = [];
          let tempVal = [];
          let rslInd = [];
          let scnName = [];
          let rsltArray = [];
          let prcVal = [];
          let goalInd = [];
          let goalIndArray = [];
          let goalLabel = [];
          let goalValArray = [];
          let goalScenario = [];
          this.scenarioResults[0].results.forEach(
            r => {
              if(!this.rsltLabelsArray.includes(r.label) && r.label !== null) {
                this.rsltLabels.push({label: r.label, units: r.units, value: []});
                this.rsltLabelsArray.push(r.label);
              }
              if ((r.units === '%' || !r.units) && r.label) {
                this.rsltLabelsPercent.push(r.label);
              }
              if (r.category !== '' && r.category !== null) {
                if (!this.goalsLabelArray.includes(r.category)) {
                  this.goalsLabelArray.push(r.category);
                  this.goalsArray.push({name: r.category, goal: []});
                }
              }
            }
          );
          this.rsltLabelsPercent = this.rsltLabelsPercent.sort();
          this.rsltLabels.forEach(label => {
            tmpRslt = [];
            this.scenarioResults.forEach(scenario => {
              scenario.results.forEach(result => {
                if (result.label === label.label) {
                  tmpRslt.push(result.value);
                }
              });
            });
            label.value.push(tmpRslt);
          });
          this.goalsArray.forEach((goal, i) => {
            goalInd = [];
            goalIndArray = [];
            this.scenarioResults.forEach(scenario => {
              scenario.results.forEach(result => {
                if (result.category === goal.name) {
                  if (!goalInd.includes(result.label) && result.label) {
                    goalInd.push(result.label);
                    goalIndArray.push({name: result.label, units: result.units, goal: goal.name});
                  }
                }
              });
            });
            goalLabel.push(goalIndArray);
          });
          this.goalsArray.forEach((goal, i) => {
            goalLabel.forEach((g, index) => {
              g.forEach(lbl => {
                if(goal.name === lbl.goal) {
                  goal.goal.push({indicator: lbl.name, units: lbl.units, value: []});
                }
              });
            });
          });
          this.goalsArray.forEach(goal => {
            goalScenario = [];
            goalValArray = [];
            if (goal.goal.length > 0) {
              goal.goal.forEach(indicator => {
                this.scenarioResults.forEach(scenario => {
                  scenario.results.forEach(result => {
                    if(result.label === indicator.indicator && result.category === goal.name) {
                          indicator.value.push(result.value);
                      }
                    });
                });
              });
            } else {
              const tempGoal = this.goalsArray.filter(ind => ind !== goal);
              this.goalsArray = tempGoal;
            }
          });
          this.scenarioResults.forEach(
            r => {
              fullRslt.push(r.results);
            }
          );
          fullRslt.forEach(
            (r, index) => {
              tempVal = [];
              prcVal = [];
              let valPrct = [];
              r.forEach(
                i => {
                  this.rsltLabelsPercent.forEach(
                    lbl => {
                      if (i.label === lbl) {
                        prcVal.push({label: i.label, value: i.value});
                        prcVal = prcVal.sort(this.compareLabels);
                        tempVal.push(i.value);
                      }
                      rsltArray.push(i);
                    }
                  );
                }
              );
              rslVal.push(tempVal);
              prcVal.forEach(val => {
                valPrct.push(val.value);
              });
              this.rsltValuesPercent.push(valPrct);
            }
          );
          this.rsltValues = rslVal;
          this.rsltLabels.forEach(
            r => {
              rslInd.push(r.label);
            }
          );
          this.scenarioResults.forEach(
            scn => scnName.push(scn.name)
          );
          for (let i = 0; i < scnName.length; i++) {
            this.resultDatasets.push(
              {
                label: scnName[i],
                backgroundColor: 'transparent',
                borderColor: this.dataColorsUP[i],
                pointBackgroundColor: this.dataColorsUP[i],
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: this.dataColorsUP[i],
                data: this.rsltValuesPercent[i]
              }
            );
          }
          this.resultDataUP = {
            labels: this.rsltLabelsPercent,
            datasets: this.resultDatasets
          };
          this.collapseScenarios();
          this.openUPResults();
         }
       );
    }
  }

  exportUPResults() {
    this.resultsService.exportUPResults(this.scenariosCopy).subscribe(res => {
      this.downloadObject = res;
    },
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
       },
       () => {
        this.saveToFileSystem(this.downloadObject);
       }
      );
  }

  private saveToFileSystem(response) {
    const blob = new Blob([response], { type: 'text/csv' });
    saveAs(blob, 'up-results.csv');
  }

  compareLabels( a, b ) {
    if ( a.label < b.label ){
      return -1;
    }
    if ( a.label > b.label ){
      return 1;
    }
    return 0;
  }

 calculateScenarios() {
   if (this.selectedScenarios.length > 0) {
     let interval;
     this.clearEvaluation();
     this.messageService.add({
       severity: 'info',
       summary: 'In Progress!',
       detail: 'Your operation is being processed.'
     });
     this.okayResults = true;
     this.resultsService.calculateScenarios(this.selectedScenarios).subscribe(
       () => {},
       error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
       },
       () => {
          interval = setInterval(() => this.getStatusUP(interval), 5000);
      }
     );
   } else {
     this.messageService.add({
       severity: 'error',
       summary: 'No scenarios selected!',
       detail: 'Please choose at least one scenario and try again.'
     });
   }
 }

getStatusUP(i) {
  let statusFlag = false;
  this.statusService.statusUP(this.selectedScenarios).subscribe(sts => {
    this.statusUP = sts;
    }, () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    }, () => {
    if(this.statusUP.length > 0) {
      this.clearEvaluation();
      this.showEvaluation();
      this.statusUP.forEach(s => {
        this.procHtml += '<div class="ui-md-4">' + s.event + '</div><div class="ui-md-2">' +
        s.scenario_id + '</div><div class="ui-md-2">' + s.created_on + '</div><div class="ui-md-4">' +
        s.value + '</div>';
        if (s.value.toLowerCase() === 'all scenarios have been processed') {
          statusFlag = true;
        }
      });
      if (statusFlag) {
        clearInterval(i);
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Results successfully generated.'
        });
        this.getUPBuffers();
        this.getUPResults();
      }
    }
   }
  );
}

getUPBuffers() {
  this.resultsService.getUPBuffers(this.selectedScenarios).subscribe(
    buffers => this.buffersUP = buffers,
    error => {
      let errContainer = [];
      const errObject = error.error.info.Errors;
      errObject.forEach(err => {
        errContainer.push({message: err.message, status: err.status});
      });
      errContainer.forEach(err => {
        this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
        err.message + '</div>';
      });
      this.showConsole();
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'An error ocurred during the operation!'
      });
    }, () => {
      this.buffersUP.forEach(bfs => {
        setTimeout(() => {
          Oskari.getSandbox().findRegisteredModuleInstance('MyPlacesImport').getService().addLayerToService(bfs, false);
          Oskari.getSandbox().findRegisteredModuleInstance('MyPlacesImport').getTab().refresh();
        }, 500);
      });
      this.layersService.getStudyAreas().subscribe(studyArea => {
        this.studyArea = studyArea;
      }, error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
            err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!'
          });
      }
      );
    }
  );
}

 createScenario() {
   if (this.selectedStudyAreaUP === null) {
     this.messageService.add({
       severity: 'error',
       summary: 'Error!',
       detail: 'Please select a study area!'
     });
   } else if (this.scenarioName === null) {
     this.messageService.add({
       severity: 'error',
       summary: 'Error!',
       detail: 'Please type a name for your scenario!'
     });
   } else if (this.indSelectItems.length === 0) {
     this.messageService.add({
       severity: 'error',
       summary: 'Error!',
       detail: 'Please select at least one indicator!'
     });
   } else if (this.selectedStudyAreaUP !== null && this.scenarioName !== null && this.indSelectItems.length > 0) {
     this.blockDocument();
     this.messageService.add({
       severity: 'info',
       summary: 'In Progress!',
       detail: 'Your operation is being processed.'
     });
     this.selIndText = '';
     this.selectedIndicators.forEach(indicator => this.selIndText = this.selIndText + indicator.module + '_');
     this.selIndText = this.selIndText.slice(0, -1);
     this.newScenario = {
       name: this.scenarioName,
       indicators: this.selIndText,
       isBase: this.isBaseUP ? 1 : 0,
       studyArea: this.selectedStudyAreaUP.id,
       studyAreaId: this.selectedStudyAreaUP.id
     };
     this.scenarioService.postScenario(this.newScenario).subscribe(scenario => {
       if (!scenario.name.toLowerCase().includes('error')) {
         this.newScenario = null;
         this.newScenario = {
           scenarioId: scenario.scenarioId,
           name: scenario.name,
           indicators: scenario.indicators,
           isBase: scenario.isBase,
           studyArea: scenario.studyArea,
           studyAreaId: scenario.studyAreaId
         };
         this.getScenarios();
         this.messageService.add({
           severity: 'success',
           summary: 'Success!',
           detail: 'Scenario created successfully.'
         });
         this.unblockDocument();
         if (scenario.has_assumptions === 0) {
          this.messageService.clear();
          this.messageService.add({
             key: 'loadAssumptions',
             sticky: true,
             severity: 'warn',
             summary: 'Warning!',
             detail: 'Your scenario belongs to a study area that lacks assumptions, which are required in order to use ' +
             'it for calculations. You can upload or create assumptions in the Assumptions tab under the Advanced Options ' + 
             'module. Click \'YES \' to open the module, or click \'NO\' to do this later.'
            });
         }
         this.collapseCreateScenario();
         this.finishCreateScenario();
         this.openManageData();
       } else {
         this.messageService.add({
           severity: 'error',
           summary: 'Error!',
           detail: 'An error ocurred during the operation.'
         });
         this.unblockDocument();
       }
     },
     error => {
      this.unblockDocument();
      let errContainer = [];
      const errObject = error.error.info.Errors;
      errObject.forEach(err => {
        errContainer.push({message: err.message, status: err.status});
      });
      errContainer.forEach(err => {
        this.errHtml += '<div class="ui-md-4">' +
        err.status + '</div><div class="ui-md-8">' + err.message + '</div>';
      });
      this.showConsole();
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'An error ocurred during the operation.'
      });
     }, () => {
      this.selectedScenarios = [];
     }
     );
   }
 }

 acceptLoadAssumption() {
  this.messageService.clear('loadAssumptions');
  this.asmptStudyAreaFile = this.selectedStudyAreaUP;
  this.tabsetUP.select('assumptionsUP');
  this.showAssumptions();
 }

 cancelLoadAssumptions() {
  this.messageService.clear('loadAssumptions');
 }

 loadUPLayers() {
   if(this.scenarioManage) {
    this.nodeService.getUPLayers(this.scenarioManage.scenarioId).then(layersUP => {
      this.layersUP = layersUP;
    });
   }
 }

 loadDataLayerUP() {
   this.nodeService.getLayers().then(layers => {
     this.layers = layers;
     this.showManageDataUP();
   });
 }

loadUPColumns(event) {
    if (event.node.type.toLowerCase() === 'layer') {
      if (event.node.data.toLowerCase() !== 'assumptions') {
        this.listService.getUPColumn(event.node.data).subscribe(listDataUP => {
            this.listDataUP = listDataUP;
            this.loadDataLayerUP();
          },
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' +
              err.status + '</div><div class="ui-md-8">' + err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
          );
      } else {
        this.tabsetUP.select('assumptionsUP');
        this.showAssumptions();
      }
    }
 }

loadDataColumnsUP(event) {
  if (event.node.type.toLowerCase() === 'layer') {
    this.listService.getColumn(event.node.data).subscribe(listManageDataUP => {
      this.colFieldsNameArrayUP = [];
      listManageDataUP.forEach(data => this.colFieldsNameArrayUP.push({name: data}));
      this.listManageDataUP = this.colFieldsNameArrayUP;
      this.columnsHeaderUP = event.node.label;
    }, error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'An error ocurred during the operation!'});
    }
    );
  }
}

 loadTablesUP() {
   if (this.upTablesScenario) {
    this.nodeService.getUPTables(this.upTablesScenario.scenarioId).subscribe(
      tables => this.tablesUP = tables,
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      }
    );
   }
 }

 deleteTableUP(event) {
  this.messageService.add({
    key: 'confirmDeleteTableUP',
    sticky: true,
    severity: 'warn',
    summary: 'Warning!',
    detail: 'This operation will delete all data from the selected table. This process is irreversible. ' +
    'Confirm to delete, cancel to go back'
  });
 }

 confirmDeleteTableUP() {
  this.messageService.add({
    severity: 'info',
    summary: 'In process!',
    detail: 'Table data is being deleted!'
  });
  this.messageService.clear('confirmDeleteTableUP');
  this.upMiscService.deleteTableUP(this.upTablesScenario.scenarioId, this.selectedTable.data).subscribe(
    () => {}, error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
            err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!'
          });
    }, () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Table data deleted successfully!'
      });
      this.loadTablesUP();
      this.loadUPLayers();
    }
   );
 }

 cancelDeleteTableUP() {
  this.messageService.clear('confirmDeleteTableUP');
 }

 importDataUP() {
     this.blockDocument();
     this.messageService.add({
       severity: 'info',
       summary: 'In Progress!',
       detail: 'Your operation is being processed.'
     });
     this.columnDataGP = [];
     this.columnFieldsArrayUP.forEach(data => this.columnDataGP.push(data.name));
     this.dataCopy = {
       layerName: this.selectedLayer.data,
       layerUPName: this.selectedLayerUP.data,
       table: this.columnDataGP,
       tableUP: this.listDataUP,
       scenarioId: this.scenarioManage.scenarioId
     };
     this.dataCopyService.copyDataUP(this.dataCopy).subscribe(
       () => {},
       error => {
        this.unblockDocument();
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
     },
       () => {
         this.messageService.add({
           severity: 'success',
           summary: 'Success!',
           detail: 'Process completed successfully.'
         });
         this.loadUPLayers();
         this.classificationService.getClassifications().subscribe(clsf => this.classifications = clsf,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          });
         this.unblockDocument();
         this.columnFieldsArrayUP = [];
         this.hideManageDataUP();
     }
     );
     this.columnFieldsArrayUP = [];
}

getScenarios() {
 this.scenarioService.getScenarios().subscribe(scenarios => this.scenarios = scenarios,
  error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
  });
}

selectScenario(event) {
 this.isNewScenario = false;
 this.scenarioManage = this.cloneScenario(event.data);
 this.editScenario = true;
}

cloneScenario(s: Scenario): Scenario {
 let scen = {};
 for (let prop in s) {
   scen[prop] = s[prop];
 }
 return scen as Scenario;
}

updateScenario() {
 this.scenarioService.putScenario(this.scenarioManage).subscribe(
   () => {
    this.messageService.add({
      severity: 'info',
      summary: 'In process!',
      detail: 'Your scenario is being updated!'
    });
   },
   error => {
    let errContainer = [];
    const errObject = error.error.info.Errors;
    errObject.forEach(err => {
      errContainer.push({message: err.message, status: err.status});
    });
    errContainer.forEach(err => {
      this.errHtml += '<div class="ui-md-4">' +
      err.status + '</div><div class="ui-md-8">' + err.message + '</div>';
    });
    errObject.forEach(err => {
      errContainer.push({message: err.message, status: err.status});
    });
    this.showConsole();
    this.messageService.add({
      severity: 'error',
      summary: 'Error!',
      detail: 'An error ocurred during the operation!'
    });
   },
   () => {
    this.scenarioService.getScenarios().subscribe(scenarios => this.scenarios = scenarios,
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      });
    this.selectedScenarios = [];
    this.scenarioManage = null;
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: 'Scenario updated successfully!'
    });
    this.hideEditScenario();
   }
 );
}

hideEditScenario() {
 this.editScenario = false;
}

deleteScenario() {
 this.messageService.clear();
 this.messageService.add({
   key: 'confirmDeleteScenario',
   sticky: true,
   severity: 'warn',
   summary: 'Warning!',
   detail: 'This operation is irreversible. Confirm to delete, or cancel to go back.'});
}

confirmDeleteScenario() {
  this.scenarioService.deleteScenario(this.scenarioManage).subscribe(
    () => {
     this.messageService.add({
       severity: 'info',
       summary: 'In process!',
       detail: 'Your scenario is being deleted!'
     });
    },
    error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
    () => {
      this.scenarioService.getScenarios().subscribe(scenarios => this.scenarios = scenarios,
        error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
            err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!'
          });
        });
      this.layers = [];
      this.tablesUP = [];
      this.selectedScenarios = [];
      this.messageService.clear('confirmDeleteScenario');
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Scenario deleted successfully!'
      });
      this.hideEditScenario();
    }
  );
}

cancelDeleteScenario() {
 this.messageService.clear('confirmDeleteScenario');
}

loadAssumptions() {
  if (this.asmptScenarioManage) {
    this.assumptionService.getAssumptions(this.asmptScenarioManage.scenarioId).subscribe(
      assumptions => this.assumptions = assumptions,
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      }
    );
  }
}

uploadAssumption(event) {
  this.blockDocument();
  this.messageService.add({
    severity: 'info',
    summary: 'In process!',
    detail: 'Your file is being uploaded!'
  });
  this.assumptionService.uploadAssumption(this.asmptStudyAreaFile.id, event.files[0]).subscribe(
    () => {},
    error => {
        this.unblockDocument();
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
    () => {
      if(this.asmptScenarioManage) {
        this.assumptionService.getAssumptions(this.asmptScenarioManage.scenarioId).subscribe(
          asmpt => this.assumptions = asmpt,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'File uploaded successfully!!'
      });
      this.unblockDocument();
    }
  );
}

selectAssumption(event) {
 this.isNewAssumption = false;
 this.assumptionManage = this.cloneAssumption(event.data);
 this.editAssumptions = true;
}

addAssumption() {
 this.isNewAssumption = true;
 this.assumptionManage = {} as Assumption;
 this.editAssumptions = true;
}

saveAssumption() {
  if (this.isNewAssumption) {
    this.assumptionService.createAssumption(this.assumptionManage).subscribe(
     () => this.messageService.add({
       severity: 'info',
       summary: 'In process!',
       detail: 'Your assumption is being created!'
     }),
     error => {
      let errContainer = [];
      const errObject = error.error.info.Errors;
      errObject.forEach(err => {
        errContainer.push({message: err.message, status: err.status});
      });
      errContainer.forEach(err => {
        this.errHtml += '<div class="ui-md-4">' +
        err.status + '</div><div class="ui-md-8">' + err.message + '</div>';
      });
      errObject.forEach(err => {
        errContainer.push({message: err.message, status: err.status});
      });
      this.showConsole();
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'An error ocurred during the operation!'
      });
    },
     () => {
       this.messageService.add({
         severity: 'success',
         summary: 'Success!',
         detail: 'Assumption created successfully!'
       });
       if(this.asmptScenarioManage) {
         this.assumptionService.getAssumptions(this.asmptScenarioManage.scenarioId).subscribe(
           asmpt => this.assumptions = asmpt,
           error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
           }
         );
       }
       this.assumptionManage = null;
       this.editAssumptions = false;
     }
   );
  } else {
    this.assumptionService.updateAssumption(this.assumptionManage).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your assumption is being updated!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Assumption updated successfully!'
        });
        if(this.asmptScenarioManage) {
          this.assumptionService.getAssumptions(this.asmptScenarioManage.scenarioId).subscribe(
            asmpt => this.assumptions = asmpt,
            error => {
              let errContainer = [];
              const errObject = error.error.info.Errors;
              errObject.forEach(err => {
                errContainer.push({message: err.message, status: err.status});
              });
              errContainer.forEach(err => {
                this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
                err.message + '</div>';
              });
              this.showConsole();
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'An error ocurred during the operation!'
              });
            }
          );
        }
        this.assumptionManage = null;
        this.editAssumptions = false;
      }
    );
  }
}

cloneAssumption(a: Assumption): Assumption {
 let asmpt = {};
 for (let prop in a) {
     asmpt[prop] = a[prop];
 }
 return asmpt as Assumption;
}

showEditAssumption() {
  this.isNewAssumption = true;
  this.assumptionManage = {} as Assumption;
  this.editAssumptions = true;
}

deleteAssumption() {
  this.messageService.clear();
  this.messageService.add({
  key: 'confirmDeleteAssumption',
  sticky: true,
  severity: 'warn',
  summary: 'Warning!',
  detail: 'This operation is irreversible. Confirm to delete, or cancel to go back.'}
  );
}

confirmDeleteAssumption() {
  this.assumptionService.deleteAssumption(this.assumptionManage).subscribe(
    () => this.messageService.add({
      severity: 'info',
      summary: 'In process!',
      detail: 'Your assumption is being deleted!'
    }),
    error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
  },
    () => {
      if(this.asmptScenarioManage) {
        this.assumptionService.getAssumptions(this.asmptScenarioManage.scenarioId).subscribe(
          asmpt => this.assumptions = asmpt,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
      }
      this.assumptionManage = null;
      this.messageService.clear('confirmDeleteAssumption');
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Assumption deleted successfully!'
      });
      this.editAssumptions = false;
    }
  );
}

cancelDeleteAssumption() {
  this.messageService.clear('confirmDeleteAssumption');
}

selectClassification(event) {
  this.isNewClassification = false;
  this.manageClassification = this.cloneClassification(event.data);
  this.editClassification = true;
}

addClassification() {
  this.isNewClassification = true;
  this.manageClassification = {} as Classification;
  this.editClassification = true;
}

saveClassification() {
  if(this.isNewClassification) {
    this.classificationService.postClassifications(this.manageClassification).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your module is being created!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Module created successfully!'
        });
        this.classificationService.getClassifications().subscribe(
          clsf => this.classifications = clsf,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
        this.manageClassification = null;
        this.editClassification = false;
      }
    );
  } else {
    this.classificationService.putClassifications(this.manageClassification).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your module is being updated!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Module updated successfully!'
        });
        this.classificationService.getClassifications().subscribe(
          clsf => this.classifications = clsf,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
        this.manageClassification = null;
        this.editClassification = false;
      }
    );
  }
}

cloneClassification(c: Classification): Classification {
  let clsf = {};
  for (let prop in c) {
      clsf[prop] = c[prop];
  }
  return clsf as Classification;
}

showEditClassification() {
  this.isNewClassification = true;
  this.manageClassification = {} as Classification;
  this.editClassification = true;
}

deleteClassification() {
  this.messageService.clear();
  this.messageService.add({
    key: 'confirmDeleteClassification',
    sticky: true,
    severity: 'warn',
    summary: 'Warning!',
    detail: 'This operation is irreversible. Confirm to delete, or cancel to go back.'
  });
}

confirmDeleteClassification() {
  this.classificationService.deleteClassifications(this.manageClassification).subscribe(
    () => this.messageService.add({
      severity: 'info',
      summary: 'In process!',
      detail: 'Your module is being deleted!'
    }),
    error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
  },
    () => {
      this.classificationService.getClassifications().subscribe(
        clsf => this.classifications = clsf,
        error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
            err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!'
          });
        }
      );
      this.manageClassification = null;
      this.messageService.clear('confirmDeleteClassification');
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Module deleted successfully!'
      });
      this.editClassification = false;
    }
  );
}

cancelDeleteClassification() {
  this.messageService.clear('confirmDeleteClassification');
}

selectModule(event) {
  this.isNewModule = false;
  this.manageModules = this.cloneModule(event.data);
  this.editModule = true;
}

addModule() {
  this.isNewModule = true;
  this.manageModules = {} as Module;
  this.editModule = true;
}

saveModule() {
  if(this.isNewModule) {
    this.moduleService.postModule(this.manageModules).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your module is being created!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Module created successfully!'
        });
        this.moduleService.getModules().subscribe(
          mdls => this.modules = mdls,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
        this.indSelectItems = [];
        this.indicatorService.getIndicators().subscribe(
          indicators => {
            this.indicators = indicators;
          }, error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          },
          () => {
            this.indicators.forEach(
              indicator => {
                this.indSelectItems.push({label: indicator.label, value: indicator});
              }
            );
          }
        );
        this.manageModules = null;
        this.editModule = false;
      }
    );
  } else {
    this.moduleService.putModule(this.manageModules).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your module is being updated!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Module updated successfully!'
        });
        this.moduleService.getModules().subscribe(
          mdls => this.modules = mdls,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
        this.indSelectItems = [];
        this.indicatorService.getIndicators().subscribe(
          indicators => {
            this.indicators = indicators;
          }, error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          },
          () => {
            this.indicators.forEach(
              indicator => {
                this.indSelectItems.push({label: indicator.label, value: indicator});
              }
            );
          }
        );
        this.manageModules = null;
        this.editModule = false;
      }
    );
  }
}

cloneModule(m: Module): Module {
  let mdl = {};
  for (let prop in m) {
      mdl[prop] = m[prop];
  }
  return mdl as Module;
}

showEditModule() {
  this.isNewModule = true;
  this.manageModules = {} as Module;
  this.editModule = true;
}

deleteModule() {
  this.messageService.clear();
  this.messageService.add({
    key: 'confirmDeleteModule',
    sticky: true,
    severity: 'warn',
    summary: 'Warning!',
    detail: 'This operation is irreversible. Confirm to delete, or cancel to go back.'
  });
}

confirmDeleteModule() {
  this.moduleService.deleteModule(this.manageModules).subscribe(
    () => this.messageService.add({
      severity: 'info',
      summary: 'In process!',
      detail: 'Your module is being deleted!'
    }),
    error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
  },
    () => {
      this.moduleService.getModules().subscribe(
        mdls => this.modules = mdls,
        error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
            err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!'
          });
        }
      );
      this.indSelectItems = [];
      this.indicatorService.getIndicators().subscribe(
          indicators => {
            this.indicators = indicators;
          }, error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          },
          () => {
            this.indicators.forEach(
              indicator => {
                this.indSelectItems.push({label: indicator.label, value: indicator});
              }
            );
        }
      );
      this.manageModules = null;
      this.messageService.clear('confirmDeleteModule');
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Module deleted successfully!'
      });
      this.editModule = false;
    }
  );
}

cancelDeleteModule() {
  this.messageService.clear('confirmDeleteModule');
}

selectIndicator(event) {
  this.isNewIndicator = false;
  this.manageIndicators = this.cloneIndicator(event.data);
  this.editIndicator = true;
}

addIndicator() {
  this.isNewIndicator = true;
  this.manageIndicators = {} as IndUp;
  this.editIndicator = true;
}

saveIndicator() {
  if(this.isNewIndicator) {
    this.moduleService.postIndicators(this.manageIndicators).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your indicator is being created!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Indicator created successfully!'
        });
        this.indsEditResult = [];
        this.moduleService.getIndicators().subscribe(
          inds => {
            this.inds = inds;
            inds.forEach(ind => this.indsEditResult.push({value: ind.id, label: ind.indicator}));
          },
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
        this.manageIndicators = null;
        this.editIndicator = false;
      }
    );
  } else {
    this.moduleService.putIndicators(this.manageIndicators).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your indicator is being updated!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Indicator updated successfully!'
        });
        this.indsEditResult = [];
        this.moduleService.getIndicators().subscribe(
          inds => {
            this.inds = inds;
            inds.forEach(ind => this.indsEditResult.push({value: ind.id, label: ind.indicator}));
          }, error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
        this.manageIndicators = null;
        this.editIndicator = false;
      }
    );
  }
}

cloneIndicator(i: IndUp): IndUp {
  let ind = {};
  for (let prop in i) {
      ind[prop] = i[prop];
  }
  return ind as IndUp;
}

showEditIndicator() {
  this.isNewIndicator = true;
  this.manageIndicators = {} as IndUp;
  this.editIndicator = true;
}

deleteIndicator() {
  this.messageService.clear();
  this.messageService.add({
    key: 'confirmDeleteIndicator',
    sticky: true,
    severity: 'warn',
    summary: 'Warning!',
    detail: 'This operation is irreversible. Confirm to delete, or cancel to go back.'
  });
}

confirmDeleteIndicator() {
  this.moduleService.deleteIndicators(this.manageIndicators).subscribe(
    () => this.messageService.add({
      severity: 'info',
      summary: 'In process!',
      detail: 'Your indicator is being deleted!'
    }),
    error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
  },
    () => {
      this.indsEditResult = [];
      this.moduleService.getIndicators().subscribe(
          inds => {
            this.inds = inds;
            inds.forEach(ind => this.indsEditResult.push({value: ind.id, label: ind.indicator}));
          }, error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
      this.manageIndicators = null;
      this.messageService.clear('confirmDeleteIndicator');
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Indicator deleted successfully!'
      });
      this.editIndicator = false;
    }
  );
}

cancelDeleteIndicator() {
  this.messageService.clear('confirmDeleteIndicator');
}

selectIndicatorResult(event) {
  this.isNewIndResult = false;
  this.manageIndResults = this.cloneIndicatorResult(event.data);
  this.editIndResult = true;
}

addIndicatorResult() {
  this.isNewIndResult = true;
  this.manageIndResults = {} as IndResult;
  this.editIndResult = true;
}

saveIndicatorResult() {
  if(this.isNewIndResult) {
    this.moduleService.postIndicatorResults(this.manageIndResults).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your result labeling is being created!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Result labeling created successfully!'
        });
        this.moduleService.getIndicatorResults().subscribe(
          indRes => this.indsResult = indRes,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
        if (this.scenarioResults || this.selectedScenarios) {
          this.getUPResults();
        }
        this.manageIndResults = null;
        this.editIndResult = false;
      }
    );
  } else {
    this.moduleService.putIndicatorResults(this.manageIndResults).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your result labeling is being updated!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Result labeling updated successfully!'
        });
        this.moduleService.getIndicatorResults().subscribe(
          indRes => this.indsResult = indRes,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
        if (this.scenarioResults || this.selectedScenarios) {
          this.getUPResults();
        }
        this.manageIndResults = null;
        this.editIndResult = false;
      }
    );
  }
}

cloneIndicatorResult(i: IndResult): IndResult {
  let ind = {};
  for (let prop in i) {
      ind[prop] = i[prop];
  }
  return ind as IndResult;
}

showEditIndicatorResult() {
  this.isNewIndResult = true;
  this.manageIndResults = {} as IndResult;
  this.editIndResult = true;
}

deleteIndicatorResult() {
  this.messageService.clear();
  this.messageService.add({
    key: 'confirmDeleteIndicatorResult',
    sticky: true,
    severity: 'warn',
    summary: 'Warning!',
    detail: 'This operation is irreversible. Confirm to delete, or cancel to go back.'
  });
}

confirmDeleteIndicatorResult() {
  this.moduleService.deleteIndicatorResults(this.manageIndResults).subscribe(
    () => this.messageService.add({
      severity: 'info',
      summary: 'In process!',
      detail: 'Your result labeling is being deleted!'
    }),
    error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
  },
    () => {
      this.moduleService.getIndicatorResults().subscribe(
        indRes => this.indsResult = indRes,
        error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
            err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!'
          });
        }
      );
      if (this.scenarioResults || this.selectedScenarios) {
        this.getUPResults();
      }
      this.manageIndResults = null;
      this.messageService.clear('confirmDeleteIndicatorResult');
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Result labeling deleted successfully!'
      });
      this.editIndResult = false;
    }
  );
}

cancelDeleteIndicatorResult() {
  this.messageService.clear('confirmDeleteIndicatorResult');
}

installModule(event) {
  this.blockDocument();
  this.moduleService.installModule(event.files[0]).subscribe(
    () => this.messageService.add({
      severity: 'info',
      summary: 'In process!',
      detail: 'Your module is being installed!'
    }),
    error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
  },
    () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Module installed successfully!'
      });
      this.moduleService.getModules().subscribe(
        mdls => this.modules = mdls,
        error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
            err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!'
          });
        }
      );
      this.indSelectItems = [];
      this.indicatorService.getIndicators().subscribe(
        indicators => {
          this.indicators = indicators;
        }, error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
            err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!'
          });
        },
        () => {
          this.indicators.forEach(
            indicator => {
              this.indSelectItems.push({label: indicator.label, value: indicator});
            }
          );
        }
      );
      this.unblockDocument();
    }
  );
}

  /**
   * Functions for ST
   */

  showAdminST() {
    this.displayAdminST = true;
  }

  closeAccordionST() {
    this.accordionST = -1;
  }

  openAccordionST() {
    this.accordionST = 0;
  }

  showColorScaleST() {
    this.displayColorScaleST = true;
  }

  hideColorScaleST() {
    this.displayColorScaleST = false;
  }

  showST() {
    this.loadDataLayerST();
    this.loadSTColumns();
    this.loadSTMethods();
    this.loadSTStudyArea();
    this.staticNormST = [];
    this.staticJoinST = [];
    this.showColorScaleST();
    this.openAccordionST();
    this.displayST = true;
  }

  showNoLoadST() {
    this.displayST = true;
  }

  showDataST() {
    this.displayDataST = true;
  }

  showSaveHeatmap() {
    this.displaySaveHeatmap = true;
  }

  showMethodsST() {
    this.displayMethodsST = true;
  }

  hideAdminST() {
    this.displayAdminST = false;
  }

  hideST() {
    this.displayST = false;
  }

  hideSaveHeatmap() {
    this.displaySaveHeatmap = false;
  }

  hideDataST() {
    this.displayDataST = false;
  }

  hideMethodsST() {
    this.displayMethodsST = false;
  }

  loadSTStudyArea() {
    this.layersService.getStudyAreasST().subscribe(studyArea => {
      this.studyAreaST = studyArea;
      this.stdAreaLayer = studyArea;
      this.stdAreaFilter = studyArea;
    },
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      }
    );
  }

  loadSTMethods() {
    this.layersService.getNormalizationMethods().subscribe(normMethod => {
      this.settingsType = normMethod;
      this.normMethodsSTManage = normMethod;
    },
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      });
    this.layersService.getJoinMethods().subscribe(joinType => {
      this.joinType = joinType;
      this.joinMethodsSTManage = joinType;
    },
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      },
      () => {
        this.joinMethod = this.joinType[0];
      }
    );
    this.methodService.getStaticNormMethod().subscribe(
      norms => {
        norms.forEach(
          n => this.staticNormST.push({value: n.id, label: n.label})
        );
      }, error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      }
    );
    this.methodService.getStaticJoinMethod().subscribe(
      joins => {
        joins.forEach(
          j => this.staticJoinST.push({value: j.id, label: j.label})
        );
      }, error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      }
    );
  }

  loadSTTables() {
    this.nodeService.getSTTables(this.stdAreaSTDistances.id).then(tablesST => {
      this.tablesST = tablesST;
    }, error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    });
  }

  loadSTLayers(event) {
    this.nodeService.getSTLayers(this.studyAreaMMUST.id).then(layersST => {
      this.layersMMUST = layersST;
    }, error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    });
    this.listService.getSTColumnMMUWithId(event.node.data).subscribe(dataST => {
      this.listDataOtherST = dataST;
    },
    error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
  }
    );
  }

  loadDataLayerST() {
    this.nodeService.getLayersST().then(layers => {
      this.layersDataST = layers;
    });
    this.nodeService.getFiltersST().then(filters => {
      this.filtersDataST = filters;
    });
  }

  loadSTDistancesColumns(event) {
    this.listService.getSTDistancesColumn(event.node.data).subscribe(listDataST => {
      this.listDataDistancesST = listDataST;
    }, error => {
      let errContainer = [];
      const errObject = error.error.info.Errors;
      errObject.forEach(err => {
        errContainer.push({message: err.message, status: err.status});
      });
      errContainer.forEach(err => {
        this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
        err.message + '</div>';
      });
      this.showConsole();
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'An error ocurred during the operation!'
      });
    });
  }

  loadSTDataDistanceColumns(event) {
    if (event.node.type.toLowerCase() !== 'directory') {
      this.listService.getSTColumnWithId(event.node.data).subscribe(listManageDataST => {
        this.colFieldsNameArrayST = [];
        this.layerSTId = null;
        listManageDataST.forEach(data => this.colFieldsNameArrayST.push({name: data}));
        this.layerSTId = event.node.data;
        this.listManageDistanceST = this.colFieldsNameArrayST;
        this.columnHeaderDistancesST = event.node.label;
      },
        error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' +
            err.status + '</div><div class="ui-md-8">' + err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'An error ocurred during the operation!'});
          });
    } else {
      this.colFieldsNameArrayST = [];
      this.layerSTId = null;
      this.listManageDistanceST = null;
      this.columnHeaderDistancesST = '';
    }
  }

  loadSTColumns() {
    this.listService.getSTColumn().subscribe(listDataST => {
        this.listDataST = listDataST;
        this.loadDataLayerST();
      }, error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      });
    this.listService.getSTColumnFilters().subscribe(listDataST => {
        this.listFiltersDataST = listDataST;
        this.loadDataLayerST();
      }, error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      });
  }

  loadDataColumnST(event) {
    if (event.node.type.toLowerCase() !== 'directory') {
      this.listService.getSTColumnWithId(event.node.data).subscribe(listManageDataST => {
        this.colFieldsNameArrayST = [];
        this.layerSTId = null;
        listManageDataST.forEach(data => this.colFieldsNameArrayST.push({name: data}));
        this.layerSTId = event.node.data;
        this.listManageDataST = this.colFieldsNameArrayST;
        this.columnsHeaderST = event.node.label;
      },
        error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' +
            err.status + '</div><div class="ui-md-8">' + err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'An error ocurred during the operation!'});
          });
    } else {
      this.colFieldsNameArrayST = [];
      this.layerSTId = null;
      this.listManageDataST = null;
      this.columnsHeaderST = '';
    }
  }

  loadDataColumnFiltersST(event) {
    if (event.node.type.toLowerCase() !== 'directory') {
      this.listService.getSTColumnFiltersWithId(event.node.data).subscribe(listManageDataFiltersST => {
        this.colFieldsNameArrayST = [];
        this.filterSTId = null;
        listManageDataFiltersST.forEach(data => this.colFieldsNameArrayST.push({name: data}));
        this.filterSTId = event.node.data;
        this.listManageDataFiltersST = this.colFieldsNameArrayST;
        this.columnsHeaderFiltersST = event.node.label;
      },
        error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' +
            err.status + '</div><div class="ui-md-8">' + err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'An error ocurred during the operation!'});
          });
    } else {
      this.colFieldsNameArrayST = [];
      this.filterSTId = null;
      this.listManageDataFiltersST = null;
      this.columnsHeaderFiltersST = '';
    }
  }

  loadDataColumnMMUST(event) {
    this.listService.getSTColumnData(event.node.data).subscribe(listManageDataMMUST => {
      this.colFieldsNameArrayST = [];
      this.MMUSTId = null;
      listManageDataMMUST.forEach(data => this.colFieldsNameArrayST.push({name: data}));
      this.MMUSTId = event.node.data;
      this.listManageDataMMUST = this.colFieldsNameArrayST;
      this.columnsHeaderMMUST = event.node.label;
    },
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'An error ocurred during the operation!'});
    });
  }

importDataST() {
  if (this.stdAreaSTDistances != null) {
    this.blockDocument();
    this.messageService.add({
      severity: 'info',
      summary: 'In Progress!',
      detail: 'Your operation is being processed.'
    });
    this.columnDataGP = [];
    this.columnFieldsArrayST.forEach(data => this.columnDataGP.push(data.name));
    this.dataCopyST = {
      layerName: this.selDistanceLayerST.data,
      layerSTName: this.selTableST.data,
      table: this.columnDataGP,
      tableST: this.listDataDistancesST,
      studyAreaId: this.stdAreaSTDistances.id
    };
    this.dataCopyService.copyDataST(this.dataCopyST).subscribe(
      data => {
        this.dataCopyST = {
          layerName: data.layerName,
          layerSTName: data.layerSTName,
          table: data.table,
          tableST: data.tableST,
          studyAreaId: data.studyAreaId
        };
      },
      error => {
        this.unblockDocument();
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Process completed successfully.'
        });
        this.unblockDocument();
    }
    );
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Error!',
      detail: 'Please select a study area!'
    });
  }
}

matchLayersST() {
  if (this.layerSTId && this.layerSTLabel && this.layerSTField.name) {
    this.blockDocument();
    this.messageService.add({
      severity: 'info',
      summary: 'In Progress!',
      detail: 'Your operation is being processed.'
    });
    this.matchLayer = {
      layerId: this.layerSTId,
      layerLabel: this.layerSTLabel,
      field: this.layerSTField.name,
      mmuCode: this.layerSTMMU.name
    };
    this.dataCopyService.copyLayersST(this.matchLayer).subscribe(
      data => {
        this.matchLayer = {
          layerId: data.layerId,
          layerLabel: data.layerLabel,
          field: data.field,
          mmuCode: data.mmuCode
        };
      },
      error => {
        this.unblockDocument();
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Process completed successfully.'
        });
        if (this.selectedStudyAreaST) {
          this.loadSTOptions();
        }
        if(this.stdAreaManageLayer) {
          this.layerSTService.getLayerST(this.stdAreaManageLayer.id).subscribe(
            layers => this.layersSTManage = layers,
            error => {
              let errContainer = [];
              const errObject = error.error.info.Errors;
              errObject.forEach(err => {
                errContainer.push({message: err.message, status: err.status});
              });
              errContainer.forEach(err => {
                this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
                err.message + '</div>';
              });
              this.showConsole();
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'An error ocurred during the operation!'
              });
            }
          );
        }
        this.unblockDocument();
    }
    );
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Error!',
      detail: 'The form is not properly filled.'
    });
  }
}

matchFiltersST() {
  this.blockDocument();
  this.messageService.add({
    severity: 'info',
    summary: 'In Progress!',
    detail: 'Your operation is being processed.'
  });
  this.matchFilter = {
    filterId: this.filterSTId,
    filterLabel: this.filterSTLabel
  };
  this.dataCopyService.copyFiltersST(this.matchFilter).subscribe(
    data => {
      this.matchFilter = {
        filterId: data.layerId,
        filterLabel: data.layerLabel
      };
    },
    error => {
        this.unblockDocument();
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
  },
    () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Process completed successfully.'
      });
      if (this.selectedStudyAreaST) {
        this.loadSTOptions();
      }
      if(this.stdAreaManageFilter) {
        this.layerSTService.getFiltersST(this.stdAreaManageFilter.id).subscribe(
          layers => this.filtersSTManage = layers,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
      }
      this.unblockDocument();
  }
  );
}

  loadSTOptions() {
      if (this.selectedStudyAreaST) {
        this.layerSettings = [];
        this.selectedLayersST = [];
        this.selSetting = [];
        this.settingsString = '';
        this.layersService.getLayers(this.selectedStudyAreaST.id).subscribe(
          layers =>  this.layerSettings = layers,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
        this.filterList = [];
        this.selectedFiltersST = [];
        this.layersService.getFilters(this.selectedStudyAreaST.id).subscribe(
          filters =>  this.filterList = filters,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
      }
  }

  evaluateLayer() {
    this.stResult = true;
    this.selectedFiltersArrayST = [];
    this.selectedFiltersST.forEach(
      fltr => this.selectedFiltersArrayST.push(+fltr)
    );
    if (this.selSetting.length == 0 || this.selSetting == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Please select at least one layer.'
      });
    } else if (!this.joinMethod) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Please select a join method.'
      });
    } else {
      this.blockDocument();
      this.settingsString = '';
      this.selectedLayersST = [];
      this.selSetting.forEach(setting => {
        this.selectedLayersST.push(setting.st_layer_id);
      });
      this.selSetting.forEach(
        stng => stng.smaller_better = stng.smaller_better ? 1 : 0
      );
      this.settingsString = JSON.stringify(this.selSetting);
      this.stEvaluationService.postLayer(
        this.selectedStudyAreaST.id, this.selectedLayersST, this.selectedFiltersArrayST, this.settingsString, this.joinMethod.value)
        .subscribe(
        data => {
          this.geojsonObject = data[0];
          this.fullGeojson = data;
        },
        error => {
          this.unblockDocument();
          this.stResult = true;
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' +
            err.status + '</div><div class="ui-md-8">' + err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!'
          });
        },
        () => {
          this.printGeoJSON();
        }
      );
    }
  }

  evaluateDistances() {
    let interval;
    let stdAreaEval = this.stdAreaSTEvalDist.id;
    this.messageService.add({
      severity: 'info',
      summary: 'In Progress!',
      detail: 'Your operation is being processed.'
    });
    this.stEvaluationService.postStdArea(stdAreaEval).subscribe(
      () => {},
       error => {
        this.unblockDocument();
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
       },
       () => {
          interval = setInterval(() => this.getStatusST(interval, stdAreaEval), 5000);
      }
    );
  }

getStatusST(i, sa) {
  let statusFlag = false;
  this.stEvaluationService.statusEvaluateST(sa).subscribe(sts => {
    this.statusST = sts;
    }, () => {
    }, () => {
    if(this.statusST.length > 0) {
      this.clearEvaluation();
      this.showEvaluation();
      this.statusST.forEach(s => {
        this.procHtml += '<div class="ui-md-4">' + s.event + '</div><div class="ui-md-2">' +
        s.layer_id + '</div><div class="ui-md-2">' + s.created_on + '</div><div class="ui-md-4">' +
        s.value + '</div>';
        if (s.event.toLowerCase() === 'all distances finished' || s.value.toLowerCase() === 'all distances finished') {
          statusFlag = true;
        }
      });
      if (statusFlag) {
        clearInterval(i);
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Distance evaluation completed!'
        });
        this.getSTDistanceLayers(sa);
      }
    }
   }
  );
}

getSTDistanceLayers(sa) {
  this.stEvaluationService.getDistanceLayers(sa).subscribe(
    layers => this.distanceLayerST = layers,
    error => {
      let errContainer = [];
      const errObject = error.error.info.Errors;
      errObject.forEach(err => {
        errContainer.push({message: err.message, status: err.status});
      });
      errContainer.forEach(err => {
        this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
        err.message + '</div>';
      });
      this.showConsole();
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'An error ocurred during the operation!'
      });
    }, () => {
      this.distanceLayerST.forEach(lyr => {
        setTimeout(() => {
          Oskari.getSandbox().findRegisteredModuleInstance('MyPlacesImport').getService().addLayerToService(lyr, false);
          Oskari.getSandbox().findRegisteredModuleInstance('MyPlacesImport').getTab().refresh();
        }, 500);
      });
      this.loadSTStudyArea();
    }
  );
}

  printGeoJSON() {
    if (this.geojsonObject['features'] !== null) {
      const heatmapStdArea = this.selectedStudyAreaST.id;
      this.oskariHeatmap = {
        name: '',
        study_area: heatmapStdArea,
        crs: this.geojsonObject.crs.properties.name,
        description: '',
        source: '',
        style: '',
        geojson: JSON.stringify({0:this.geojsonObject})
      };
      this.layerOptions = {
        layerId: 'ST_VECTOR_LAYER',
        layerInspireName: 'Inspire theme name',
        layerOrganizationName: 'Organization name',
        showLayer: true,
        opacity: 60,
        layerName: 'Index Values',
        layerDescription: 'Displays index values of Suitability evaluations.',
        layerPermissions: {
            publish: 'publication_permission_ok'
        },
        centerTo: true,
        optionalStyles: []
      };
      this.valuesST.forEach(val => {
        if (val >= this.filterRangeST[0] && val <= this.filterRangeST[1]) {
          this.layerOptions['optionalStyles'].push({
            property: { key: 'value', value: val },
            stroke: {
              color: this.colors((val / 100)).toString()
            },
            fill: {
              color: this.colors((val / 100)).toString()
            }
          });
        } else {
          this.layerOptions['optionalStyles'].push({
            property: { key: 'value', value: val },
            stroke: {
              color: 'transparent'
            },
            fill: {
              color: 'transparent'
            }
          });
        }
    });
      Oskari.getSandbox().postRequestByName('VectorLayerRequest', [this.layerOptions]);
      Oskari.getSandbox().postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'ST_VECTOR_LAYER']); 
      Oskari.getSandbox().postRequestByName(this.rn, [this.geojsonObject, this.layerOptions]);
      this.stResult = false;
      this.closeAccordionST();
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Process completed successfully!'
      });
      this.unblockDocument();
    } else {
      this.unblockDocument();
      this.closeAccordionST();
      this.stResult = true;
      this.messageService.add({
        severity: 'info',
        summary: 'Success',
        detail: 'Process completed successfully, but no results were generated.'
      });
      Oskari.getSandbox().postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'ST_VECTOR_LAYER']);
    }
  }

  filterGeoJSON(event) {
    if(this.geojsonObject != null && this.geojsonObject['features'] != null) {
      this.layerOptions = {
        layerId: 'ST_VECTOR_LAYER',
        layerInspireName: 'Inspire theme name',
        layerOrganizationName: 'Organization name',
        showLayer: true,
        opacity: 60,
        layerName: 'Index Values',
        layerDescription: 'Displays index values of Suitability evaluations.',
        layerPermissions: {
            publish: 'publication_permission_ok'
        },
        optionalStyles: []
      };
      this.valuesST.forEach(val => {
          if (val >= event.values[0] && val <= event.values[1]) {
            this.layerOptions['optionalStyles'].push({
              property: { key: 'value', value: val },
              stroke: {
                color: this.colors((val / 100)).toString()
              },
              fill: {
                color: this.colors((val / 100)).toString()
              }
            });
          } else {
            this.layerOptions['optionalStyles'].push({
              property: { key: 'value', value: val },
              stroke: {
                color: 'transparent'
              },
              fill: {
                color: 'transparent'
              }
            });
          }
      });
      Oskari.getSandbox().postRequestByName('VectorLayerRequest', [this.layerOptions]);
      Oskari.getSandbox().postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'ST_VECTOR_LAYER']);
      Oskari.getSandbox().postRequestByName(this.rn, [this.geojsonObject, this.layerOptions]);
    }
}

saveHeatmap() {
  this.messageService.add({
    severity: 'info',
    summary: 'In Progress!',
    detail: 'Your operation is being processed.'
  });
  this.blockDocument();
  this.heatmapService.saveHeatmap(this.oskariHeatmap).subscribe(
    res => this.oskariResponse = res,
    error => {
      this.unblockDocument();
      let errContainer = [];
      const errObject = error.error.info.Errors;
      errObject.forEach(err => {
        errContainer.push({message: err.message, status: err.status});
      });
      errContainer.forEach(err => {
        this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
        err.message + '</div>';
      });
      this.showConsole();
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'An error ocurred during the operation!'
      });
    },
    () => {
      this.unblockDocument();
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Process completed successfully!'
      });
      this.hideSaveHeatmap();
      Oskari.getSandbox().findRegisteredModuleInstance('MyPlacesImport').getService().addLayerToService(this.oskariResponse, false);
      Oskari.getSandbox().findRegisteredModuleInstance('MyPlacesImport').getTab().refresh();
      this.loadSTStudyArea();
    }
  );
}

loadManageLayers() {
  if (this.stdAreaManageLayer) {
    this.layerSTService.getLayerST(this.stdAreaManageLayer.id).subscribe(layers => this.layersSTManage = layers,
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      });
  }
}

loadManageFilters() {
  if (this.stdAreaManageFilter) {
    this.layerSTService.getFiltersST(this.stdAreaManageFilter.id).subscribe(filters => this.filtersSTManage = filters,
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      });
  }
}

loadManageSettings() {
  if (this.stdAreaManageSetting) {
    this.settingsService.getSettings(this.stdAreaManageSetting.id).subscribe(settings => this.settingsSTManage = settings,
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
      });
  }
}

selectLayer(event) {
  this.isNewLayer = false;
  this.manageLayer = this.cloneLayer(event.data);
  this.listService.getSTColumnWithId(event.data.user_layer_id).subscribe(
    columns => {
      this.colFieldsNameArrayST = [];
      columns.forEach(data => this.colFieldsNameArrayST.push({name: data}));
      this.selLayerColumns = this.colFieldsNameArrayST;
    }, error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    }
  );
  this.editLayers = true;
}

addLayer() {
  this.isNewLayer = true;
  this.manageLayer = {} as LayerST;
  this.editLayers = true;
}

saveLayer() {
  if(this.isNewLayer) {
    this.layerSTService.createLayerST(this.manageLayer).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your layer is being created!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Layer created successfully!'
        });
        if(this.stdAreaManageSetting) {
          this.settingsService.getSettings(this.stdAreaManageSetting.id).subscribe(
            stngs => this.settingsSTManage = stngs,
            error => {
              let errContainer = [];
              const errObject = error.error.info.Errors;
              errObject.forEach(err => {
                errContainer.push({message: err.message, status: err.status});
              });
              errContainer.forEach(err => {
                this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
                err.message + '</div>';
              });
              this.showConsole();
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'An error ocurred during the operation!'
              });
            }
          );
        }
        if(this.stdAreaManageLayer) {
          this.layerSTService.getLayerST(this.stdAreaManageLayer.id).subscribe(
            lyrs => this.layersSTManage = lyrs,
            error => {
              let errContainer = [];
              const errObject = error.error.info.Errors;
              errObject.forEach(err => {
                errContainer.push({message: err.message, status: err.status});
              });
              errContainer.forEach(err => {
                this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
                err.message + '</div>';
              });
              this.showConsole();
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'An error ocurred during the operation!'
              });
            }
          );
        }
        if(this.selectedStudyAreaST) {
          this.layersService.getLayers(this.selectedStudyAreaST.id).subscribe(
            lyrs => this.layerSettings = lyrs,
            error => {
              let errContainer = [];
              const errObject = error.error.info.Errors;
              errObject.forEach(err => {
                errContainer.push({message: err.message, status: err.status});
              });
              errContainer.forEach(err => {
                this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
                err.message + '</div>';
              });
              this.showConsole();
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'An error ocurred during the operation!'
              });
            }
          );
        }
        this.editLayers = false;
      }
    );
  } else {
    this.layerSTService.updateLayerST(this.manageLayer).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your layer is being updated!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Layer updated successfully!'
        });
        if(this.stdAreaManageSetting) {
          this.settingsService.getSettings(this.stdAreaManageSetting.id).subscribe(
            stngs => this.settingsSTManage = stngs,
            error => {
              let errContainer = [];
              const errObject = error.error.info.Errors;
              errObject.forEach(err => {
                errContainer.push({message: err.message, status: err.status});
              });
              errContainer.forEach(err => {
                this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
                err.message + '</div>';
              });
              this.showConsole();
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'An error ocurred during the operation!'
              });
            }
          );
        }
        if(this.stdAreaManageLayer) {
          this.layerSTService.getLayerST(this.stdAreaManageLayer.id).subscribe(
            lyrs => this.layersSTManage = lyrs,
            error => {
              let errContainer = [];
              const errObject = error.error.info.Errors;
              errObject.forEach(err => {
                errContainer.push({message: err.message, status: err.status});
              });
              errContainer.forEach(err => {
                this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
                err.message + '</div>';
              });
              this.showConsole();
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'An error ocurred during the operation!'
              });
            }
          );
        }
        if(this.selectedStudyAreaST) {
          this.layersService.getLayers(this.selectedStudyAreaST.id).subscribe(
            lyrs => this.layerSettings = lyrs,
            error => {
              let errContainer = [];
              const errObject = error.error.info.Errors;
              errObject.forEach(err => {
                errContainer.push({message: err.message, status: err.status});
              });
              errContainer.forEach(err => {
                this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
                err.message + '</div>';
              });
              this.showConsole();
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'An error ocurred during the operation!'
              });
            }
          );
        }
        this.manageLayer = null;
        this.editLayers = false;
      }
    );
  }
}

cloneLayer(l: LayerST): LayerST {
  let lyr = {};
  for (let prop in l) {
      lyr[prop] = l[prop];
  }
  return lyr as LayerST;
}

showEditLayer() {
  this.isNewLayer = true;
  this.manageLayer = {} as LayerST;
  this.editLayers = true;
}

deleteLayer() {
  this.messageService.clear();
  this.messageService.add({
    key: 'confirmDeleteLayer',
    sticky: true,
    severity: 'warn',
    summary: 'Warning!',
    detail: 'This operation is irreversible. Confirm to delete, or cancel to go back.'
  });
}

confirmDeleteLayer() {
  this.layerSTService.deleteLayerST(this.manageLayer).subscribe(
    () => this.messageService.add({
      severity: 'info',
      summary: 'In process!',
      detail: 'Your layer is being deleted!'
    }),
    error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
  },
    () => {
      this.manageLayer = null;
      this.messageService.clear('confirmDeleteLayer');
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Layer deleted successfully!'
      });
      if(this.stdAreaManageSetting) {
        this.settingsService.getSettings(this.stdAreaManageSetting.id).subscribe(
          stngs => this.settingsSTManage = stngs,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
      }
      this.layerSTService.getLayerST(this.stdAreaManageLayer.id).subscribe(
        lyrs => this.layersSTManage = lyrs,
        error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
            err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!'
          });
        }
      );
      if(this.selectedStudyAreaST) {
        this.layersService.getLayers(this.selectedStudyAreaST.id).subscribe(
          layers => this.layerSettings = layers,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
      }
      this.editLayers = false;
    }
  );
}

cancelDeleteLayer() {
this.messageService.clear('confirmDeleteLayer');
}

selectFilter(event) {
  this.isNewFilter = false;
  this.manageFilter = this.cloneFilter(event.data);
  this.editFilters = true;
}

addFilter() {
  this.isNewFilter = true;
  this.manageFilter = {} as LayerST;
  this.editFilters = true;
}

saveFilter() {
  if(this.isNewFilter) {
    this.layerSTService.createFilterST(this.manageFilter).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your filter is being created!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Filter created successfully!'
        });
        if(this.stdAreaManageFilter) {
          this.layerSTService.getFiltersST(this.stdAreaManageFilter.id).subscribe(
            fltr => this.filtersSTManage = fltr,
            error => {
              let errContainer = [];
              const errObject = error.error.info.Errors;
              errObject.forEach(err => {
                errContainer.push({message: err.message, status: err.status});
              });
              errContainer.forEach(err => {
                this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
                err.message + '</div>';
              });
              this.showConsole();
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'An error ocurred during the operation!'
              });
            }
          );
        }
        if(this.selectedStudyAreaST) {
          this.layersService.getFilters(this.selectedStudyAreaST.id).subscribe(
            flts => this.filterList = flts,
            error => {
              let errContainer = [];
              const errObject = error.error.info.Errors;
              errObject.forEach(err => {
                errContainer.push({message: err.message, status: err.status});
              });
              errContainer.forEach(err => {
                this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
                err.message + '</div>';
              });
              this.showConsole();
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'An error ocurred during the operation!'
              });
            }
          );
        }
        this.manageFilter = null;
        this.editFilters = false;
      }
    );
  } else {
    this.layerSTService.updateFilterST(this.manageFilter).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your filter is being updated!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Filter updated successfully!'
        });
        if(this.stdAreaManageFilter) {
          this.layerSTService.getFiltersST(this.stdAreaManageFilter.id).subscribe(
            fltr => this.filtersSTManage = fltr,
            error => {
              let errContainer = [];
              const errObject = error.error.info.Errors;
              errObject.forEach(err => {
                errContainer.push({message: err.message, status: err.status});
              });
              errContainer.forEach(err => {
                this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
                err.message + '</div>';
              });
              this.showConsole();
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'An error ocurred during the operation!'
              });
            }
          );
        }
        if(this.selectedStudyAreaST) {
          this.layersService.getFilters(this.selectedStudyAreaST.id).subscribe(
            flts => this.filterList = flts,
            error => {
              let errContainer = [];
              const errObject = error.error.info.Errors;
              errObject.forEach(err => {
                errContainer.push({message: err.message, status: err.status});
              });
              errContainer.forEach(err => {
                this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
                err.message + '</div>';
              });
              this.showConsole();
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'An error ocurred during the operation!'
              });
            }
          );
        }
        this.manageFilter = null;
        this.editFilters = false;
      }
    );
  }
}

cloneFilter(l: LayerST): LayerST {
  let lyr = {};
  for (let prop in l) {
      lyr[prop] = l[prop];
  }
  return lyr as LayerST;
}

showEditFilter() {
  this.isNewFilter = true;
  this.manageFilter = {} as LayerST;
  this.editFilters = true;
}

deleteFilter() {
  this.messageService.clear();
  this.messageService.add({
    key: 'confirmDeleteFilter',
    sticky: true,
    severity: 'warn',
    summary: 'Warning!',
    detail: 'This operation is irreversible. Confirm to delete, or cancel to go back.'
  });
}

confirmDeleteFilter() {
  this.layerSTService.deleteFilterST(this.manageFilter).subscribe(
    () => this.messageService.add({
      severity: 'info',
      summary: 'In process!',
      detail: 'Your filter is being deleted!'
    }),
    error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
  },
    () => {
      this.manageFilter = null;
      this.messageService.clear('confirmDeleteFilter');
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Filter deleted successfully!'
      });
      this.layerSTService.getFiltersST(this.stdAreaManageFilter.id).subscribe(
        fltr => this.filtersSTManage = fltr,
        error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
            err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!'
          });
        }
      );
      if(this.selectedStudyAreaST) {
        this.layersService.getFilters(this.selectedStudyAreaST.id).subscribe(
          fltr => this.filterList = fltr,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
      }
      this.editFilters = false;
    }
  );
}

cancelDeleteFilter() {
  this.messageService.clear('confirmDeleteFilter');
}

selectNormMethod(event) {
  this.isNewNormMethod = false;
  this.manageNormMethod = this.cloneNormMethod(event.data);
  this.editNormMethod = true;
}

addNormMethod() {
  this.isNewNormMethod = true;
  this.manageNormMethod = {} as NormalizationMethod;
  this.editNormMethod = true;
}

saveNormMethod() {
  if(this.isNewNormMethod) {
    this.methodService.createNormalizationMethod(this.manageNormMethod).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your method is being created!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Method created successfully!'
        });
        this.methodService.getNormalizationMethods().subscribe(
          method => {
            this.normMethodsSTManage = method;
            this.settingsType = method;
          },
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
        this.manageNormMethod = null;
        this.editNormMethod = false;
      }
    );
  } else {
    this.methodService.updateNormalizationMethod(this.manageNormMethod).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your method is being updated!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Method updated successfully!'
        });
        this.methodService.getNormalizationMethods().subscribe(
          method => {
            this.normMethodsSTManage = method;
            this.settingsType = method;
          },
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
        this.manageNormMethod = null;
        this.editNormMethod = false;
      }
    );
  }
}

cloneNormMethod(n: NormalizationMethod): NormalizationMethod {
  let nrm = {};
  for (let prop in n) {
      nrm[prop] = n[prop];
  }
  return nrm as NormalizationMethod;
}

showEditNormMethod() {
this.isNewNormMethod = true;
this.manageNormMethod = {} as NormalizationMethod;
this.editNormMethod = true;
}

deleteNormMethod() {
this.messageService.clear();
this.messageService.add({
  key: 'confirmDeleteNormMethod',
  sticky: true,
  severity: 'warn',
  summary: 'Warning!',
  detail: 'This operation is irreversible. Confirm to delete, or cancel to go back.'});
}

confirmDeleteNormMethod() {
  this.methodService.deleteNormalizationMethod(this.manageNormMethod).subscribe(
    () => this.messageService.add({
      severity: 'info',
      summary: 'In process!',
      detail: 'Your method is being deleted!'
    }),
    error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
  },
    () => {
      this.manageNormMethod = null;
      this.messageService.clear('confirmDeleteNormMethod');
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Method deleted successfully!'
      });
      this.methodService.getNormalizationMethods().subscribe(
        method => {
          this.normMethodsSTManage = method;
          this.settingsType = method;
        },
        error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
            err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!'
          });
        }
      );
      this.editNormMethod = false;
    }
  );
}

cancelDeleteNormMethod() {
  this.messageService.clear('confirmDeleteNormMethod');
}

selectJoinMethod(event) {
  this.isNewJoinMethod = false;
  this.manageJoinMethod = this.cloneJoinMethod(event.data);
  this.editJoinMethod = true;
}

addJoinMethod() {
  this.isNewJoinMethod = true;
  this.manageJoinMethod = {} as NormalizationMethod;
  this.editJoinMethod = true;
}

saveJoinMethod() {
  if(this.isNewJoinMethod) {
    this.methodService.createJoinMethod(this.manageJoinMethod).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your method is being created!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Method created successfully!'
        });
        this.manageJoinMethod = null;
        this.methodService.getJoinMethods().subscribe(
          method => {
            this.joinMethodsSTManage = method;
            this.joinType = method;
          },
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
        this.editJoinMethod = false;
      }
    );
  } else {
    this.methodService.updateJoinMethod(this.manageJoinMethod).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your method is being updated!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Method updated successfully!'
        });
        this.methodService.getJoinMethods().subscribe(
          method => {
            this.joinMethodsSTManage = method;
            this.joinType = method;
          },
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
        this.manageJoinMethod = null;
        this.editJoinMethod = false;
      }
    );
  }
}

cloneJoinMethod(n: NormalizationMethod): NormalizationMethod {
  let nrm = {};
  for (let prop in n) {
      nrm[prop] = n[prop];
  }
  return nrm as NormalizationMethod;
}

showEditJoinMethod() {
  this.isNewJoinMethod = true;
  this.manageJoinMethod = {} as NormalizationMethod;
  this.editJoinMethod = true;
}

deleteJoinMethod() {
  this.messageService.clear();
  this.messageService.add({
    key: 'confirmDeleteJoinMethod',
    sticky: true,
    severity: 'warn',
    summary: 'Warning!',
    detail: 'This operation is irreversible. Confirm to delete, or cancel to go back.'
  });
}

confirmDeleteJoinMethod() {
  this.methodService.deleteJoinMethod(this.manageJoinMethod).subscribe(
    () => this.messageService.add({
      severity: 'info',
      summary: 'In process!',
      detail: 'Your method is being deleted!'
    }),
    error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
  },
    () => {
      this.manageJoinMethod = null;
      this.messageService.clear('confirmDeleteJoinMethod');
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Method deleted successfully!'
      });
      this.methodService.getJoinMethods().subscribe(
        method => {
          this.joinMethodsSTManage = method;
          this.joinType = method;
        }, error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
            err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!'
          });
        }
      );
      this.editJoinMethod = false;
    }
  );
}

cancelDeleteJoinMethod() {
  this.messageService.clear('confirmDeleteJoinMethod');
}

selectSettings(event) {
  this.isNewSetting = false;
  this.manageSetting = this.cloneSettings(event.data);
  if(this.manageSetting.id === 0) {
    this.isDefaultSetting = true;
  } else {
    this.isDefaultSetting = false;
  }
  this.editSettings = true;
}

addSettings() {
  this.isNewSetting = true;
  this.isDefaultSetting = false;
  this.manageSetting = {} as Settings;
  this.editSettings = true;
}

saveSettings() {
  if (this.isNewSetting || this.isDefaultSetting) {
    this.manageSetting.smaller_better = this.manageSetting.smaller_better ? 1 : 0;
    this.settingsService.postSettings(this.manageSetting).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your settings are being created!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Settings created successfully!'
        });
        this.settingsService.getSettings(this.stdAreaManageSetting.id).subscribe(
          stngs => this.settingsSTManage = stngs,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
        if(this.selectedStudyAreaST) {
          this.layersService.getLayers(this.selectedStudyAreaST.id).subscribe(
            layers => this.layerSettings = layers,
            error => {
              let errContainer = [];
              const errObject = error.error.info.Errors;
              errObject.forEach(err => {
                errContainer.push({message: err.message, status: err.status});
              });
              errContainer.forEach(err => {
                this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
                err.message + '</div>';
              });
              this.showConsole();
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'An error ocurred during the operation!'
              });
            }
          );
        }
        this.manageSetting = null;
        this.editSettings = false;
      }
    );
  } else {
    this.manageSetting.smaller_better = this.manageSetting.smaller_better ? 1 : 0;
    this.settingsService.putSettings(this.manageSetting).subscribe(
      () => this.messageService.add({
        severity: 'info',
        summary: 'In process!',
        detail: 'Your settings are being updated!'
      }),
      error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
    },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Settings updated successfully!'
        });
        this.settingsService.getSettings(this.stdAreaManageSetting.id).subscribe(
          stngs => this.settingsSTManage = stngs,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
        if(this.selectedStudyAreaST) {
          this.layersService.getLayers(this.selectedStudyAreaST.id).subscribe(
            layers => this.layerSettings = layers,
            error => {
              let errContainer = [];
              const errObject = error.error.info.Errors;
              errObject.forEach(err => {
                errContainer.push({message: err.message, status: err.status});
              });
              errContainer.forEach(err => {
                this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
                err.message + '</div>';
              });
              this.showConsole();
              this.messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'An error ocurred during the operation!'
              });
            }
          );
        }
        this.manageSetting = null;
        this.editSettings = false;
      }
    );
  }
}

cloneSettings(s: Settings): Settings {
  let stng = {};
  for (let prop in s) {
      stng[prop] = s[prop];
  }
  return stng as Settings;
}

showEditSettings() {
  this.isNewSetting = true;
  this.manageSetting = {} as Settings;
  this.editSettings = true;
}

deleteSettings() {
  this.messageService.clear();
  this.messageService.add({
    key: 'confirmDeleteSettings',
    sticky: true,
    severity: 'warn',
    summary: 'Warning!',
    detail: 'This operation is irreversible. Confirm to delete, or cancel to go back.'
  });
}

confirmDeleteSettings() {
  this.settingsService.deleteSettings(this.manageSetting).subscribe(
    () => this.messageService.add({
      severity: 'info',
      summary: 'In process!',
      detail: 'Your settings are being deleted!'
    }),
    error => {
        let errContainer = [];
        const errObject = error.error.info.Errors;
        errObject.forEach(err => {
          errContainer.push({message: err.message, status: err.status});
        });
        errContainer.forEach(err => {
          this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
          err.message + '</div>';
        });
        this.showConsole();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!'
        });
  },
    () => {
      this.manageSetting = null;
      this.messageService.clear('confirmDeleteSettings');
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Settings deleted successfully!'
      });
      this.settingsService.getSettings(this.stdAreaManageSetting.id).subscribe(
        stngs => this.settingsSTManage = stngs,
        error => {
          let errContainer = [];
          const errObject = error.error.info.Errors;
          errObject.forEach(err => {
            errContainer.push({message: err.message, status: err.status});
          });
          errContainer.forEach(err => {
            this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
            err.message + '</div>';
          });
          this.showConsole();
          this.messageService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'An error ocurred during the operation!'
          });
        }
      );
      if(this.selectedStudyAreaST) {
        this.layersService.getLayers(this.selectedStudyAreaST.id).subscribe(
          layers => this.layerSettings = layers,
          error => {
            let errContainer = [];
            const errObject = error.error.info.Errors;
            errObject.forEach(err => {
              errContainer.push({message: err.message, status: err.status});
            });
            errContainer.forEach(err => {
              this.errHtml += '<div class="ui-md-4">' + err.status + '</div><div class="ui-md-8">' +
              err.message + '</div>';
            });
            this.showConsole();
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation!'
            });
          }
        );
      }
      this.editSettings = false;
    }
  );
}

cancelDeleteSettings() {
  this.messageService.clear('confirmDeleteSettings');
}

  constructor(private nodeService: NodeService,
              private listService: ListService,
              private indicatorService: IndicatorService,
              private scenarioService: ScenarioService,
              private assumptionService: AssumptionService,
              private resultsService: ResultsService,
              private layersService: LayerService,
              private dataCopyService: DataCopyService,
              private settingsService: SettingsService,
              private messageService: MessageService,
              private statusService: StatusService,
              private stEvaluationService: StEvaluationService,
              private layerSTService: LayerSTService,
              private methodService: MethodService,
              private moduleService: ModuleService,
              private upMiscService: UpMiscService,
              private classificationService: ClassificationService,
              private heatmapService: HeatmapService,
              private wfsUptService: WfsUptService) {
                // this.uptWindow = window;
                this.resultOptionsUP = {
                  legend: {
                    position: 'top',
                    labels: {
                      fontColor: '#ffffff'
                    }
                  },
                  title: {
                    display: true,
                    text: 'Scenario Comparisons',
                    fontColor: '#fff'
                  },
                  scale: {
                    gridLines: {
                      color: '#ffffff',
                      lineWidth: 0.7
                    },
                    angleLines: {
                      display: true
                    },
                    ticks: {
                      beginAtZero: true,
                      min: 0,
                      max: 100,
                      stepSize: 50,
                      display: false
                    },
                    pointLabels: {
                      fontSize: 11,
                      fontColor: '#ffffff'
                    }
                  },
                  tooltips: {
                    callbacks: {
                      label: function (tooltipItem, data) {
                        let label = data.datasets[tooltipItem.datasetIndex].label || '';
            
                        if (label) {
                          label += ': ';
                        }
                        label += Math.round(tooltipItem.yLabel * 100) / 100;
                        label += '%';
                        return label;
                      },
                      title: function(tooltipItem, data) {
                        return 'Values';
                      }
                    }
                  }
                };
              }

  ngOnInit() {
    // this.loadUptWfsLayers();
    this.layerSTId = null;
    this.accordionST = 0;
    this.layerSTLabel = '';
    this.layerSTField = null;
    this.selectedStudyAreaST = null;
    this.selectedFiltersST = [];
    this.displayTools = true;
    this.filterRangeST = [0, 100];
    this.showCreate = false;
    this.showManage = false;
    this.showResults = false;
    this.showScenariosUP = false;
    this.colsScenario = [
      {field: 'name', header: 'Name'},
      {field: 'description', header: 'Description'},
      {field: 'is_base', header: 'Is baseline?'},
    ];
    this.colsAssumption = [
      {field: 'name', header: 'Name'},
      {field: 'category', header: 'Category'},
      {field: 'value', header: 'Value'},
      {field: 'units', header: 'Units'},
      {field: 'description', header: 'Description'},
      {field: 'source', header: 'Source'},
    ];
    this.colsClassification = [
      {field: 'name', header: 'Name'},
      {field: 'category', header: 'Category'},
      {field: 'fclass', header: 'F-class'}
  ];
    this.colsModules = [
      {field: 'name', header: 'Name'},
      {field: 'label', header: 'Label'},
      {field: 'description', header: 'Description'}
    ];
    this.colsIndicators = [
      {field: 'indicator', header: 'Indicator'}
    ];
    this.colsIndResults = [
      {field: 'label', header: 'Label'},
      {field: 'units', header: 'units'},
      {field: 'language', header: 'Language'},
      {field: 'up_indicators_id', header: 'Indicator'}
    ];
    this.colsAmenities = [
      {field: 'id', header: 'ID'},
      {field: 'scenario', header: 'Scenario'},
      {field: 'fclass', header: 'F-class'},
      {field: 'location', header: 'Location'},
      {field: 'buffer', header: 'Buffer'}
    ];
    this.colsRoads = [
      {field: 'id', header: 'ID'},
      {field: 'scenario', header: 'Scenario'},
      {field: 'fclass', header: 'F-class'},
      {field: 'location', header: 'Location'},
      {field: 'buffer', header: 'Buffer'}
    ];
    this.colsTransit = [
      {field: 'id', header: 'ID'},
      {field: 'scenario', header: 'Scenario'},
      {field: 'fclass', header: 'F-class'},
      {field: 'location', header: 'Location'},
      {field: 'buffer', header: 'Buffer'}
    ];
    this.colsRisks = [
      {field: 'id', header: 'ID'},
      {field: 'scenario', header: 'Scenario'},
      {field: 'fclass', header: 'F-class'},
      {field: 'location', header: 'Location'},
      {field: 'buffer', header: 'Buffer'}
    ];
    this.colsFootprints = [
      {field: 'id', header: 'ID'},
      {field: 'scenario', header: 'Scenario'},
      {field: 'name', header: 'Name'},
      {field: 'location', header: 'Location'},
      {field: 'value', header: 'Value'}
    ];
    this.colsJobs = [
      {field: 'id', header: 'ID'},
      {field: 'scenario', header: 'Scenario'},
      {field: 'location', header: 'Location'},
      {field: 'buffer', header: 'Buffer'}
    ];
    this.colsLayersSettings = [
      {field: 'label', header: 'Layer'},
      {field: 'normalization_method', header: 'Normalization Method'},
      {field: 'range_min', header: 'Lowest Value'},
      {field: 'range_max', header: 'Highest Value'},
      {field: 'weight', header: 'Weight'},
      {field: 'smaller_better', header: 'Smaller better?'}
    ];
    this.colsSetting = [
      {field: 'label', header: 'Layer'},
      {field: 'normalization_method', header: 'Normalization Method'},
      {field: 'range_min', header: 'Lowest Value'},
      {field: 'range_max', header: 'Highest Value'},
      {field: 'weight', header: 'Weight'},
      {field: 'smaller_better', header: 'Smaller better?'},
      {field: 'id', header: 'Is saved?'}
    ];
    this.colsLayer = [
      {field: 'st_layer_label', header: 'Layer Label'},
      {field: 'layer_field', header: 'Layer Value'},
      {field: 'layer_mmu_code', header: 'MMU ID'}
    ];
    this.colsFilter = [
      {field: 'st_filter_label', header: 'Filter Label'}
    ];
    this.colsNormMethod = [
        {field: 'label', header: 'Label'},
        {field: 'language', header: 'Language'},
        {field: 'value', header: 'Method'}
    ];
    this.colsJoinMethod = [
        {field: 'label', header: 'Label'},
        {field: 'language', header: 'Language'},
        {field: 'value', header: 'Method'}
    ];
    for (let i = 0; i <= 100; i++) {
        this.valuesST.push(i);
    }
  }

}

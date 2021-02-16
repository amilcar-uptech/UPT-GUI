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
import { isNullOrUndefined, isUndefined } from 'util';

declare var Oskari: any;

@Component({
  selector: 'app-tools-sidebar',
  templateUrl: './tools-sidebar.component.html',
  styleUrls: ['./tools-sidebar.component.scss'],
  providers: [MessageService],
})

export class ToolsSidebarComponent implements OnInit {
  /**
   *  Misc. Variables: General use variables that aren't used by either UrbanHotspots or UrbanPerformance
   */
  @Input()
  uptWindow: Window & {
    __session_active?: boolean;
  };

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
  upAct = false;
  stAct = false;

  // Properties for range sliders
  filterRangeST: number[];

  columnDataGP: string[] = [];

  shareLayersList: any[];
  shareLayer: any;

  tmpLayerId: string;

  /**
   * UP Variables
   */
  @ViewChild('tabsetUP', { static: false }) tabsetUP: NgbTabset;

  // Status
  statusUP: Status[] = [];
  errHtml = '';
  procHtml = '';
  buffersUP = [];

  // Collapsed state of UP steps
  createScenarioCollapsed = true;
  manageDataCollapsed = true;
  scenariosCollapsed = true;
  resultsCollapsed = true;

  // Status of UP steps
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
  displayAdvancedUP = false;
  editAssumptions = false;
  editScenario = false;
  editClassification = false;
  editModule = false;
  editIndicator = false;
  editIndResult = false;

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
  displayDistanceModule = false;
  displayDataST = false;
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

  layersST$: Observable<SelectItem[]>;
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
  filtersST$: Observable<SelectItem[]>;
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
  joinType: NormalizationMethod[];
  joinMethod: NormalizationMethod;
  settingsEvaluate: any[] = [];
  settingsString = '';
  selSetting: Settings[] = [];
  clonedSettings: { [s: string]: Settings } = {};

  // import data
  dataCopyST: DataCopy;

  // Variables used in the copy data segment of distance evaluation
  distanceHeaderST = '';
  columnsHeaderST = '';
  columnFieldsArrayST: Column[] = [];
  colFieldsNameArrayST: any[] = [];

  // Manage Data ST variables
  listManageDataST: any[];
  selectedLayerDataST: TreeNode;
  selectedLayerManageDataST: TreeNode;
  layerSTLabel: string;

  // Variables for copying layers in ST
  columnDataST: any[];
  matchLayer: MatchLayer;
  layerSTId: number;
  dataSettings: Settings[];
  layerSTField: Layer;
  layerSTMMU: Layer;

  // Variables for copying filters in ST
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

  // Colors used for the color scale dialog
  scaleColorsST = [
    "#630000",
    "#9e0142",
    "#d53e4f",
    "#f46d43",
    "#fee08b",
    "#abdda4",
    "#66c2a5",
    "#3288bd",
    "#5e4fa2",
    "#240058"
  ];

  // Color scaling for the heatmap
  colors = chroma.scale(this.scaleColorsST);

  // Numbers used for the color scale dialog
  scaleNumbersST: any[] = ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];

  // LayersST
  isNewLayer = false;
  stdAreaLayer: SelectItem[];
  stdAreaManageLayer: Layer;
  stdAreaManagePublicLayer: Layer;
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

  // Status of free scale
  isFreeScaleST = false;

  // Values for the Color Scale
  valuesST = [];
  freeValuesST = [];

  optionalStyles = [];

  oskariHeatmap: Heatmap;
  oskariResponse: any;

  stResult = true;

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
  /* toggleUptWfs() {
    this.displayUptWfs = !this.displayUptWfs;
  }*/

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
  /* loadUptWfsLayers() {
    this.wfsUptService.getUptWfsLayers().subscribe(
      (lyr) => {
        this.uptWfs = lyr;
      },
      (error) => {
        this.logErrorHandler(error);
      }
    );
    this.layersService.getStudyAreas().subscribe(
      (studyArea) => {
        this.wfsStudyArea = studyArea;
      },
      (error) => {
        this.logErrorHandler(error);
      }
    );
  }*/

  // Pending functionality: Sends a request to get WFS columns
  /* loadUptWfsColumns(event) {
    if (event.node.type.toLowerCase() === 'layer') {
      this.wfsUptService
        .getUptWfsColumns(event.node.data, this.wfsSelectedStudyArea.id)
        .subscribe(
          (uptwfs) => {
            this.listManageDataUptWfs = uptwfs;
          },
          (error) => {
            this.logErrorHandler(error);
          }
        );
    }
  }*/

  // Pending functionality. Sends a request to import
  /* importUptWfs() {
    if (this.wfsSelectedStudyArea) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success!',
        detail:
          'You\'re sending the following Study Area: ' +
          this.wfsSelectedStudyArea.id,
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Please select a study area!',
      });
    }
  }*/

  /**
   * Functions for UP
   */
  // Displays the main UP dialog, as well as sends requests needed for the different elements needed for operations.
  showUP() {
    this.upAct = true;
    this.stAct = false;
    this.indSelectItems = [];
    this.indsEditResult = [];
    this.selectedScenarios = [];
    this.moduleService.getModules().subscribe(
      (indicators) => {
        this.indicators = indicators;
        if (this.isUPTAdmin) {
          this.modules = indicators;
        }
      },
      (error) => {
        this.logErrorHandler(error);
      },
      () => {
        this.indicators.forEach((indicator) => {
          this.indSelectItems.push({
            label: indicator.label,
            value: indicator,
          });
        });
      }
    );
    this.layersService.getStudyAreas().subscribe(
      (studyArea) => {
        this.studyArea = studyArea;
      },
      (error) => {
        this.logErrorHandler(error);
      }
    );
    this.classificationService.getClassifications().subscribe(
      (clsf) => (this.classifications = clsf),
      (error) => {
        this.logErrorHandler(error);
      }
    );
    this.getScenarios();
    if (this.isUPTAdmin) {
      this.moduleService.getIndicators().subscribe(
        (inds) => {
          this.inds = inds;
          inds.forEach((ind) =>
            this.indsEditResult.push({ value: ind.id, label: ind.indicator })
          );
        },
        (error) => {
          this.logErrorHandler(error);
        }
      );
      this.moduleService.getIndicatorResults().subscribe(
        (indRes) => (this.indsResult = indRes),
        (error) => {
          this.logErrorHandler(error);
        }
      );
    }
    this.displayUP = true;
  }

  // Displays the main UP window without sending requests again.
  showNoLoadUP() {
    this.displayUP = true;
  }

  // Hides main UP window
  hideUP() {
    this.displayUP = false;
  }

  // Displays the Manage Data dialog for UP
  showManageDataUP() {
    this.displayManageDataUP = true;
  }

  // Displays the Advanced dialog for UP
  showAdvancedUP() {
    this.displayAdvancedUP = true;
  }

  // Hides the Advanced dialog for UP
  hideAdvancedUP() {
    this.displayAdvancedUP = false;
  }

  // Hides the Manage Data dialog for UP
  hideManageDataUP() {
    this.displayManageDataUP = false;
  }

  // Collapses the Create Scenario section of the main UP dialog
  collapseCreateScenario() {
    this.createScenarioCollapsed = true;
  }

  // Collapses the Manage Data section of the main UP dialog
  collapseManageData() {
    this.manageDataCollapsed = true;
  }

  // Collapses the Scenarios section of the main UP dialog
  collapseScenarios() {
    this.scenariosCollapsed = true;
  }

  // Collapses the Results section of the main UP dialog
  collapseUPResults() {
    this.resultsCollapsed = true;
  }

  // Opens the Create Scenario section of the main UP dialog
  openCreateScenario() {
    this.createScenarioCollapsed = false;
  }

  // Opens the Manage Data section of the main UP dialog
  openManageData() {
    this.manageDataCollapsed = false;
  }

  // Opens the Scenarios section of the main UP dialog
  openScenarios() {
    this.scenariosCollapsed = false;
  }

  // Opens the Results section of the main UP dialog
  openUPResults() {
    this.resultsCollapsed = false;
  }

  // Marks the Create Scenario as completed when the create request is successfully done
  finishCreateScenario() {
    this.createScenarioDone = true;
  }

  finishManageData() {
    this.manageDataDone = true;
  }

  finishScenarios() {
    this.scenariosDone = true;
  }

  // Automatically marks indicator dependencies if an indicator with dependencies is selected
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
      arrayString.forEach((str) => {
        newArrayString.push(str.trim());
      });
      newArrayString.forEach((ary) => {
        indList.forEach((ind) => {
          if (ind.value.name.toLowerCase() === ary.toLowerCase()) {
            depAry.push(ind.value);
          }
        });
      });
      depAry.forEach((dep) => {
        if (!indAry.includes(dep)) {
          event.value.push(dep);
        }
      });
    }
  }

  // Sends a request for results from the UP calculator and formats them for the Results section of UP.
  getUPResults() {
    if (this.selectedScenarios.length > 0) {
      this.scenariosCopy = this.selectedScenarios;
      this.okayResults = true;
      this.resultsService.getScenarios(this.selectedScenarios).subscribe(
        (scnr) => {
          this.scenarioResults = scnr;
        },
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.scenarioResults.forEach((rslt) => {
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
          this.scenarioResults[0].results.forEach((r) => {
            if (!this.rsltLabelsArray.includes(r.label) && r.label !== null) {
              this.rsltLabels.push({
                label: r.label,
                units: r.units,
                value: [],
              });
              this.rsltLabelsArray.push(r.label);
            }
            if ((r.units === '%' || !r.units) && r.label) {
              this.rsltLabelsPercent.push(r.label);
            }
            if (r.category !== '' && r.category !== null) {
              if (!this.goalsLabelArray.includes(r.category)) {
                this.goalsLabelArray.push(r.category);
                this.goalsArray.push({ name: r.category, goal: [] });
              }
            }
          });
          this.rsltLabelsPercent = this.rsltLabelsPercent.sort();
          this.rsltLabels.forEach((label) => {
            tmpRslt = [];
            this.scenarioResults.forEach((scenario) => {
              scenario.results.forEach((result) => {
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
            this.scenarioResults.forEach((scenario) => {
              scenario.results.forEach((result) => {
                if (result.category === goal.name) {
                  if (!goalInd.includes(result.label) && result.label) {
                    goalInd.push(result.label);
                    goalIndArray.push({
                      name: result.label,
                      units: result.units,
                      goal: goal.name,
                    });
                  }
                }
              });
            });
            goalLabel.push(goalIndArray);
          });
          this.goalsArray.forEach((goal, i) => {
            goalLabel.forEach((g, index) => {
              g.forEach((lbl) => {
                if (goal.name === lbl.goal) {
                  goal.goal.push({
                    indicator: lbl.name,
                    units: lbl.units,
                    value: [],
                  });
                }
              });
            });
          });
          this.goalsArray.forEach((goal) => {
            goalScenario = [];
            goalValArray = [];
            if (goal.goal.length > 0) {
              goal.goal.forEach((indicator) => {
                this.scenarioResults.forEach((scenario) => {
                  scenario.results.forEach((result) => {
                    if (
                      result.label === indicator.indicator &&
                      result.category === goal.name
                    ) {
                      indicator.value.push(result.value);
                    }
                  });
                });
              });
            } else {
              const tempGoal = this.goalsArray.filter((ind) => ind !== goal);
              this.goalsArray = tempGoal;
            }
          });
          this.scenarioResults.forEach((r) => {
            fullRslt.push(r.results);
          });
          fullRslt.forEach((r, index) => {
            tempVal = [];
            prcVal = [];
            let valPrct = [];
            r.forEach((i) => {
              this.rsltLabelsPercent.forEach((lbl) => {
                if (i.label === lbl) {
                  prcVal.push({ label: i.label, value: i.value });
                  prcVal = prcVal.sort(this.compareLabels);
                  tempVal.push(i.value);
                }
                rsltArray.push(i);
              });
            });
            rslVal.push(tempVal);
            prcVal.forEach((val) => {
              valPrct.push(val.value);
            });
            this.rsltValuesPercent.push(valPrct);
          });
          this.rsltValues = rslVal;
          this.rsltLabels.forEach((r) => {
            rslInd.push(r.label);
          });
          this.scenarioResults.forEach((scn) => scnName.push(scn.name));
          for (let i = 0; i < scnName.length; i++) {
            this.resultDatasets.push({
              label: scnName[i],
              backgroundColor: 'transparent',
              borderColor: this.dataColorsUP[i],
              pointBackgroundColor: this.dataColorsUP[i],
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: this.dataColorsUP[i],
              data: this.rsltValuesPercent[i],
            });
          }
          this.resultDataUP = {
            labels: this.rsltLabelsPercent,
            datasets: this.resultDatasets,
          };
          this.collapseScenarios();
          this.openUPResults();
        }
      );
    }
  }

  // Sends a request for the results in a CSV format.
  exportUPResults() {
    this.resultsService.exportUPResults(this.scenariosCopy).subscribe(
      (res) => {
        this.downloadObject = res;
      },
      (error) => {
        this.logErrorHandler(error);
      },
      () => {
        this.saveToFileSystem(this.downloadObject);
      }
    );
  }

  // Formats the results from the exportUPResults method into a .CSV file.
  private saveToFileSystem(response) {
    const blob = new Blob([response], { type: 'text/csv' });
    saveAs(blob, 'up-results.csv');
  }

  // Compares labels to make it easier to sort them.
  compareLabels(a, b) {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  }

  // Sends a request to evaluate the Scenarios selected in the MultiSelect element
  calculateScenarios() {
    if (this.selectedScenarios.length > 0) {
      let interval;
      this.clearEvaluation();
      this.messageService.add({
        severity: 'info',
        summary: 'In Progress!',
        detail: 'Your operation is being processed.',
      });
      this.okayResults = true;
      this.resultsService.calculateScenarios(this.selectedScenarios).subscribe(
        () => {},
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          interval = setInterval(() => this.getStatusUP(interval), 5000);
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'No scenarios selected!',
        detail: 'Please choose at least one scenario and try again.',
      });
    }
  }

  // Sends a request to get the latest status of the UP evaluation. If completed, calls getUPBuffers and getUPResults.
  getStatusUP(i) {
    let statusFlag = false;
    this.statusService.statusUP(this.selectedScenarios).subscribe(
      (sts) => {
        this.statusUP = sts;
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'An error ocurred during the operation!',
        });
      },
      () => {
        if (this.statusUP.length > 0) {
          this.clearEvaluation();
          this.showEvaluation();
          this.statusUP.forEach((s) => {
            this.procHtml +=
              '<div class="ui-md-4">' +
              s.event +
              '</div><div class="ui-md-2">' +
              s.scenario_id +
              '</div><div class="ui-md-2">' +
              s.created_on +
              '</div><div class="ui-md-4">' +
              s.value +
              '</div>';
            if (s.value.toLowerCase() === 'all scenarios have been processed') {
              statusFlag = true;
            }
          });
          if (statusFlag) {
            clearInterval(i);
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Results successfully generated.',
            });
            this.getUPBuffers();
            this.getUPResults();
          }
        }
      }
    );
  }

  // Sends a request for buffers generated from Buffers modules and saves them into Oskari.
  getUPBuffers() {
    this.resultsService.getUPBuffers(this.selectedScenarios).subscribe(
      (buffers) => (this.buffersUP = buffers),
      (error) => {
        this.logErrorHandler(error);
      },
      () => {
        this.buffersUP.forEach((bfs) => {
          setTimeout(() => {
            Oskari.getSandbox()
              .findRegisteredModuleInstance('MyPlacesImport')
              .getService()
              .addLayerToService(bfs, false);
            Oskari.getSandbox()
              .findRegisteredModuleInstance('MyPlacesImport')
              .getTab()
              .refresh();
          }, 500);
        });
        this.layersService.getStudyAreas().subscribe(
          (studyArea) => {
            this.studyArea = studyArea;
          },
          (error) => {
            this.logErrorHandler(error);
          }
        );
      }
    );
  }

  // Sends a request to create a Scenario with the Create Scenario form
  createScenario() {
    if (this.selectedStudyAreaUP === null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Please select a study area!',
      });
    } else if (this.scenarioName === null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Please type a name for your scenario!',
      });
    } else if (this.indSelectItems.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Please select at least one indicator!',
      });
    } else if (
      this.selectedStudyAreaUP !== null &&
      this.scenarioName !== null &&
      this.indSelectItems.length > 0
    ) {
      this.blockDocument();
      this.messageService.add({
        severity: 'info',
        summary: 'In Progress!',
        detail: 'Your operation is being processed.',
      });
      this.selIndText = '';
      this.selectedIndicators.forEach(
        (indicator) =>
          (this.selIndText = this.selIndText + indicator.name + '_')
      );
      this.selIndText = this.selIndText.slice(0, -1);
      this.newScenario = {
        name: this.scenarioName,
        indicators: this.selIndText,
        isBase: this.isBaseUP ? 1 : 0,
        studyArea: this.selectedStudyAreaUP.id,
        studyAreaId: this.selectedStudyAreaUP.id,
      };
      this.scenarioService.postScenario(this.newScenario).subscribe(
        (scenario) => {
          if (!scenario.name.toLowerCase().includes('error')) {
            this.newScenario = null;
            this.newScenario = {
              scenarioId: scenario.scenarioId,
              name: scenario.name,
              indicators: scenario.indicators,
              isBase: scenario.isBase,
              studyArea: scenario.studyArea,
              studyAreaId: scenario.studyAreaId,
            };
            this.getScenarios();
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Scenario created successfully.',
            });
            this.unblockDocument();
            if (scenario.has_assumptions === 0) {
              this.messageService.clear();
              this.messageService.add({
                key: 'loadAssumptions',
                sticky: true,
                severity: 'warn',
                summary: 'Warning!',
                detail:
                  'Your scenario belongs to a study area that lacks assumptions, which are required in order to use ' +
                  'it for calculations. You can upload or create assumptions in the Assumptions tab under the Advanced Options ' +
                  'module. Click \'YES \' to open the module, or click \'NO\' to do this later.',
              });
            }
            this.collapseCreateScenario();
            this.finishCreateScenario();
            this.openManageData();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'An error ocurred during the operation.',
            });
            this.unblockDocument();
          }
        },
        (error) => {
          this.unblockDocument();
          this.logErrorHandler(error);
        },
        () => {
          this.selectedScenarios = [];
        }
      );
    }
  }

  // Opens the Advanced dialog on the Assumptions tab
  acceptLoadAssumption() {
    this.messageService.clear('loadAssumptions');
    this.asmptStudyAreaFile = this.selectedStudyAreaUP;
    this.tabsetUP.select('assumptionsUP');
    this.showAdvancedUP();
  }

  // Closes the loadAssumptions message
  cancelLoadAssumptions() {
    this.messageService.clear('loadAssumptions');
  }

  // Loads the PrimeNG tree element in the Manage Data section of the main UP dialog using the Scenario ID
  loadUPLayers() {
    if (this.scenarioManage) {
      this.nodeService
        .getUPLayers(this.scenarioManage.scenarioId)
        .then((layersUP) => {
          this.layersUP = layersUP;
        });
    }
  }

  // Loads the study for UP
  loadDataLayerUP() {
    this.nodeService.getLayers().then((layers) => {
      this.layers = layers;
      this.showManageDataUP();
    });
  }

  // Loads the required column names after selecting a table in Manage Data section.
  loadUPColumns(event) {
    if (event.node.type.toLowerCase() === 'layer') {
      if (event.node.data.toLowerCase() !== 'assumptions') {
        this.listService.getUPColumn(event.node.data).subscribe(
          (listDataUP) => {
            this.listDataUP = listDataUP;
            this.loadDataLayerUP();
          },
          (error) => {
            this.logErrorHandler(error);
          }
        );
      }
      // If the table is 'assumptions', displays the Advanced dialog on the Assumptions tab. 
      else {
        this.tabsetUP.select('assumptionsUP');
        this.showAdvancedUP();
      }
    }
  }

  // Loads the options for the dropdowns in the UP Manage Data dialog using the layer ID.
  loadDataColumnsUP(event) {
    if (event.node.type.toLowerCase() === 'layer') {
      this.listService.getColumn(event.node.data).subscribe(
        (listManageDataUP) => {
          this.colFieldsNameArrayUP = [];
          listManageDataUP.forEach((data) =>
            this.colFieldsNameArrayUP.push({ name: data })
          );
          this.listManageDataUP = this.colFieldsNameArrayUP;
          this.columnsHeaderUP = event.node.label;
        },
        (error) => {
          this.logErrorHandler(error);
        }
      );
    }
  }

  // Loads the PrimeNG tree element in the Advanced dialog on the Clear Tables tab
  loadTablesUP() {
    if (this.upTablesScenario) {
      this.nodeService.getUPTables(this.upTablesScenario.scenarioId).subscribe(
        (tables) => (this.tablesUP = tables),
        (error) => {
          this.logErrorHandler(error);
        }
      );
    }
  }

  // Shows the confirmDeleteTableUP message
  deleteTableUP(event) {
    this.messageService.add({
      key: 'confirmDeleteTableUP',
      sticky: true,
      severity: 'warn',
      summary: 'Warning!',
      detail:
        'This operation will delete all data from the selected table. This process is irreversible. ' +
        'Confirm to delete, cancel to go back',
    });
  }

  // Sends a request to clear the selected table from its data
  confirmDeleteTableUP() {
    this.messageService.add({
      severity: 'info',
      summary: 'In process!',
      detail: 'Table data is being deleted!',
    });
    this.messageService.clear('confirmDeleteTableUP');
    this.upMiscService
      .deleteTableUP(this.upTablesScenario.scenarioId, this.selectedTable.data)
      .subscribe(
        () => {},
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Table data deleted successfully!',
          });
          this.loadTablesUP();
          this.loadUPLayers();
        }
      );
  }

  // Hides the confirmDeleteTableUP message
  cancelDeleteTableUP() {
    this.messageService.clear('confirmDeleteTableUP');
  }

  // Sends a request to import data through the UP Manage Data dialog
  importDataUP() {
    this.blockDocument();
    this.messageService.add({
      severity: 'info',
      summary: 'In Progress!',
      detail: 'Your operation is being processed.',
    });
    this.columnDataGP = [];
    this.columnFieldsArrayUP.forEach((data) =>
      this.columnDataGP.push(data.name)
    );
    this.dataCopy = {
      layerName: this.selectedLayer.data,
      layerUPName: this.selectedLayerUP.data,
      table: this.columnDataGP,
      tableUP: this.listDataUP,
      scenarioId: this.scenarioManage.scenarioId,
    };
    this.dataCopyService.copyDataUP(this.dataCopy).subscribe(
      () => {},
      (error) => {
        this.unblockDocument();
        this.logErrorHandler(error);
      },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Process completed successfully.',
        });
        this.loadUPLayers();
        this.classificationService.getClassifications().subscribe(
          (clsf) => (this.classifications = clsf),
          (error) => {
            this.logErrorHandler(error);
          }
        );
        this.unblockDocument();
        this.columnFieldsArrayUP = [];
        this.hideManageDataUP();
      }
    );
    this.columnFieldsArrayUP = [];
  }

  // Sends a request to get the list of Scenarios
  getScenarios() {
    this.scenarioService.getScenarios().subscribe(
      (scenarios) => (this.scenarios = scenarios),
      (error) => {
        this.logErrorHandler(error);
      }
    );
  }

  // Shows the Scenario Details and tags the Scenario as not new
  selectScenario(event) {
    this.isNewScenario = false;
    this.scenarioManage = this.cloneScenario(event.data);
    this.editScenario = true;
  }

  // Creates a copy of the selected Scenario
  cloneScenario(s: Scenario): Scenario {
    let scen = {};
    for (let prop in s) {
      scen[prop] = s[prop];
    }
    return scen as Scenario;
  }

  // Sends a request to update the Scenario
  updateScenario() {
    this.scenarioService.putScenario(this.scenarioManage).subscribe(
      () => {
        this.messageService.add({
          severity: 'info',
          summary: 'In process!',
          detail: 'Your scenario is being updated!',
        });
      },
      (error) => {
        this.logErrorHandler(error);
      },
      () => {
        this.scenarioService.getScenarios().subscribe(
          (scenarios) => (this.scenarios = scenarios),
          (error) => {
            this.logErrorHandler(error);
          }
        );
        this.selectedScenarios = [];
        this.scenarioManage = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Scenario updated successfully!',
        });
        this.hideEditScenario();
      }
    );
  }

  // Hides the Scenario Details dialog
  hideEditScenario() {
    this.editScenario = false;
  }

  // Shows the confirmDeleteScenario message
  deleteScenario() {
    this.messageService.clear();
    this.messageService.add({
      key: 'confirmDeleteScenario',
      sticky: true,
      severity: 'warn',
      summary: 'Warning!',
      detail:
        'This operation is irreversible. Confirm to delete, or cancel to go back.',
    });
  }

  // Sends a request to delete the selected Scenario
  confirmDeleteScenario() {
    this.scenarioService.deleteScenario(this.scenarioManage).subscribe(
      () => {
        this.messageService.add({
          severity: 'info',
          summary: 'In process!',
          detail: 'Your scenario is being deleted!',
        });
      },
      (error) => {
        this.logErrorHandler(error);
      },
      () => {
        this.scenarioService.getScenarios().subscribe(
          (scenarios) => (this.scenarios = scenarios),
          (error) => {
            this.logErrorHandler(error);
          }
        );
        this.layers = [];
        this.tablesUP = [];
        this.selectedScenarios = [];
        this.messageService.clear('confirmDeleteScenario');
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Scenario deleted successfully!',
        });
        this.hideEditScenario();
      }
    );
  }

  // Closes the confirmDeleteScenario message
  cancelDeleteScenario() {
    this.messageService.clear('confirmDeleteScenario');
  }

  // Sends a request to get the Assumptions related to the selected Scenario
  loadAssumptions() {
    if (this.asmptScenarioManage) {
      this.assumptionService
        .getAssumptions(this.asmptScenarioManage.scenarioId)
        .subscribe(
          (assumptions) => (this.assumptions = assumptions),
          (error) => {
            this.logErrorHandler(error);
          }
        );
    }
  }

  // Sends a request to upload an assumptions file
  uploadAssumption(event) {
    this.blockDocument();
    this.messageService.add({
      severity: 'info',
      summary: 'In process!',
      detail: 'Your file is being uploaded!',
    });
    this.assumptionService
      .uploadAssumption(this.asmptStudyAreaFile.id, event.files[0])
      .subscribe(
        () => {},
        (error) => {
          this.unblockDocument();
          this.logErrorHandler(error);
        },
        () => {
          if (this.asmptScenarioManage) {
            this.assumptionService
              .getAssumptions(this.asmptScenarioManage.scenarioId)
              .subscribe(
                (asmpt) => (this.assumptions = asmpt),
                (error) => {
                  this.logErrorHandler(error);
                }
              );
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'File uploaded successfully!!',
          });
          this.unblockDocument();
        }
      );
  }

  // Shows the Assumption Detail dialog and tags the selected assumption as not new
  selectAssumption(event) {
    this.isNewAssumption = false;
    this.assumptionManage = this.cloneAssumption(event.data);
    this.editAssumptions = true;
  }

  // Shows the Assumption Detail dialog and tags the selected assumption as new
  addAssumption() {
    this.isNewAssumption = true;
    this.assumptionManage = {} as Assumption;
    this.editAssumptions = true;
  }

  // Sends a request to either save or update an assumption, depending on its tag
  saveAssumption() {
    if (this.isNewAssumption) {
      this.assumptionService.createAssumption(this.assumptionManage).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your assumption is being created!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Assumption created successfully!',
          });
          if (this.asmptScenarioManage) {
            this.assumptionService
              .getAssumptions(this.asmptScenarioManage.scenarioId)
              .subscribe(
                (asmpt) => (this.assumptions = asmpt),
                (error) => {
                  this.logErrorHandler(error);
                }
              );
          }
          this.assumptionManage = null;
          this.editAssumptions = false;
        }
      );
    } else {
      this.assumptionService.updateAssumption(this.assumptionManage).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your assumption is being updated!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Assumption updated successfully!',
          });
          if (this.asmptScenarioManage) {
            this.assumptionService
              .getAssumptions(this.asmptScenarioManage.scenarioId)
              .subscribe(
                (asmpt) => (this.assumptions = asmpt),
                (error) => {
                  this.logErrorHandler(error);
                }
              );
          }
          this.assumptionManage = null;
          this.editAssumptions = false;
        }
      );
    }
  }

  // Creates a copy of the selected assumption
  cloneAssumption(a: Assumption): Assumption {
    let asmpt = {};
    for (let prop in a) {
      asmpt[prop] = a[prop];
    }
    return asmpt as Assumption;
  }

  // Shows the confirmDeleteAssumption message
  deleteAssumption() {
    this.messageService.clear();
    this.messageService.add({
      key: 'confirmDeleteAssumption',
      sticky: true,
      severity: 'warn',
      summary: 'Warning!',
      detail:
        'This operation is irreversible. Confirm to delete, or cancel to go back.',
    });
  }

  // Sends a request to delete an assumption
  confirmDeleteAssumption() {
    this.assumptionService.deleteAssumption(this.assumptionManage).subscribe(
      () =>
        this.messageService.add({
          severity: 'info',
          summary: 'In process!',
          detail: 'Your assumption is being deleted!',
        }),
      (error) => {
        this.logErrorHandler(error);
      },
      () => {
        if (this.asmptScenarioManage) {
          this.assumptionService
            .getAssumptions(this.asmptScenarioManage.scenarioId)
            .subscribe(
              (asmpt) => (this.assumptions = asmpt),
              (error) => {
                this.logErrorHandler(error);
              }
            );
        }
        this.assumptionManage = null;
        this.messageService.clear('confirmDeleteAssumption');
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Assumption deleted successfully!',
        });
        this.editAssumptions = false;
      }
    );
  }

  // Closes the cancelDeleteAssumption
  cancelDeleteAssumption() {
    this.messageService.clear('confirmDeleteAssumption');
  }

  // Shows the Classification Details dialog and tags the classification as not new.
  selectClassification(event) {
    this.isNewClassification = false;
    this.manageClassification = this.cloneClassification(event.data);
    this.editClassification = true;
  }

  // Shows the Classification Details dialog and tags the classifcication as new
  addClassification() {
    this.isNewClassification = true;
    this.manageClassification = {} as Classification;
    this.editClassification = true;
  }

  // Sends a request to save or update the selected classification according to its tag
  saveClassification() {
    if (this.isNewClassification) {
      this.classificationService
        .postClassifications(this.manageClassification)
        .subscribe(
          () =>
            this.messageService.add({
              severity: 'info',
              summary: 'In process!',
              detail: 'Your module is being created!',
            }),
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Module created successfully!',
            });
            this.classificationService.getClassifications().subscribe(
              (clsf) => (this.classifications = clsf),
              (error) => {
                this.logErrorHandler(error);
              }
            );
            this.manageClassification = null;
            this.editClassification = false;
          }
        );
    } else {
      this.classificationService
        .putClassifications(this.manageClassification)
        .subscribe(
          () =>
            this.messageService.add({
              severity: 'info',
              summary: 'In process!',
              detail: 'Your module is being updated!',
            }),
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Module updated successfully!',
            });
            this.classificationService.getClassifications().subscribe(
              (clsf) => (this.classifications = clsf),
              (error) => {
                this.logErrorHandler(error);
              }
            );
            this.manageClassification = null;
            this.editClassification = false;
          }
        );
    }
  }

  // Creates a copy of the selected Classification
  cloneClassification(c: Classification): Classification {
    let clsf = {};
    for (let prop in c) {
      clsf[prop] = c[prop];
    }
    return clsf as Classification;
  }

  // Shows the confirmDeleteClassification message
  deleteClassification() {
    this.messageService.clear();
    this.messageService.add({
      key: 'confirmDeleteClassification',
      sticky: true,
      severity: 'warn',
      summary: 'Warning!',
      detail:
        'This operation is irreversible. Confirm to delete, or cancel to go back.',
    });
  }

  // Sends a request to delete the selected classification
  confirmDeleteClassification() {
    this.classificationService
      .deleteClassifications(this.manageClassification)
      .subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your module is being deleted!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.classificationService.getClassifications().subscribe(
            (clsf) => (this.classifications = clsf),
            (error) => {
              this.logErrorHandler(error);
            }
          );
          this.manageClassification = null;
          this.messageService.clear('confirmDeleteClassification');
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Module deleted successfully!',
          });
          this.editClassification = false;
        }
      );
  }

  // Closes the confirmDeleteClassification message
  cancelDeleteClassification() {
    this.messageService.clear('confirmDeleteClassification');
  }

  // Shows the Module Details dialog and tags the module as not new
  selectModule(event) {
    this.isNewModule = false;
    this.manageModules = this.cloneModule(event.data);
    this.editModule = true;
  }

  // Sends a request to update the selected module
  saveModule() {
    if (this.isNewModule) {
      this.moduleService.postModule(this.manageModules).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your module is being created!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Module created successfully!',
          });
          this.indSelectItems = [];
          this.moduleService.getModules().subscribe(
            (indicators) => {
              this.indicators = indicators;
              this.modules = indicators;
            },
            (error) => {
              this.logErrorHandler(error);
            },
            () => {
              this.indicators.forEach((indicator) => {
                this.indSelectItems.push({
                  label: indicator.label,
                  value: indicator,
                });
              });
            }
          );
          this.manageModules = null;
          this.editModule = false;
        }
      );
    } else {
      this.moduleService.putModule(this.manageModules).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your module is being updated!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Module updated successfully!',
          });
          this.indSelectItems = [];
          this.moduleService.getModules().subscribe(
            (indicators) => {
              this.indicators = indicators;
              this.modules = indicators;
            },
            (error) => {
              this.logErrorHandler(error);
            },
            () => {
              this.indicators.forEach((indicator) => {
                this.indSelectItems.push({
                  label: indicator.label,
                  value: indicator,
                });
              });
            }
          );
          this.manageModules = null;
          this.editModule = false;
        }
      );
    }
  }

  // Creates a copy of the selected module
  cloneModule(m: Module): Module {
    let mdl = {};
    for (let prop in m) {
      mdl[prop] = m[prop];
    }
    return mdl as Module;
  }

  // Shows the confirmDeleteModule message
  deleteModule() {
    this.messageService.clear();
    this.messageService.add({
      key: 'confirmDeleteModule',
      sticky: true,
      severity: 'warn',
      summary: 'Warning!',
      detail:
        'This operation is irreversible. Confirm to delete, or cancel to go back.',
    });
  }

  // Sends a request to delete the selected module
  confirmDeleteModule() {
    this.moduleService.deleteModule(this.manageModules).subscribe(
      () =>
        this.messageService.add({
          severity: 'info',
          summary: 'In process!',
          detail: 'Your module is being deleted!',
        }),
      (error) => {
        this.logErrorHandler(error);
      },
      () => {
        this.indSelectItems = [];
        this.moduleService.getModules().subscribe(
          (indicators) => {
            this.indicators = indicators;
            this.modules = indicators;
          },
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.indicators.forEach((indicator) => {
              this.indSelectItems.push({
                label: indicator.label,
                value: indicator,
              });
            });
          }
        );
        this.manageModules = null;
        this.messageService.clear('confirmDeleteModule');
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Module deleted successfully!',
        });
        this.editModule = false;
      }
    );
  }

  // Closes the confirmDeleteModule message
  cancelDeleteModule() {
    this.messageService.clear('confirmDeleteModule');
  }

  // Shows the Indicator Details dialog and tags the selected indicator as not new
  selectIndicator(event) {
    this.isNewIndicator = false;
    this.manageIndicators = this.cloneIndicator(event.data);
    this.editIndicator = true;
  }

  // Shows the Indicator Details dialog and tags the selected indicator as new
  addIndicator() {
    this.isNewIndicator = true;
    this.manageIndicators = {} as IndUp;
    this.editIndicator = true;
  }

  // Sends a request to save or update an indicator according to its tag
  saveIndicator() {
    if (this.isNewIndicator) {
      this.moduleService.postIndicators(this.manageIndicators).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your indicator is being created!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Indicator created successfully!',
          });
          this.indsEditResult = [];
          this.moduleService.getIndicators().subscribe(
            (inds) => {
              this.inds = inds;
              inds.forEach((ind) =>
                this.indsEditResult.push({
                  value: ind.id,
                  label: ind.indicator,
                })
              );
            },
            (error) => {
              this.logErrorHandler(error);
            }
          );
          this.manageIndicators = null;
          this.editIndicator = false;
        }
      );
    } else {
      this.moduleService.putIndicators(this.manageIndicators).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your indicator is being updated!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Indicator updated successfully!',
          });
          this.indsEditResult = [];
          this.moduleService.getIndicators().subscribe(
            (inds) => {
              this.inds = inds;
              inds.forEach((ind) =>
                this.indsEditResult.push({
                  value: ind.id,
                  label: ind.indicator,
                })
              );
            },
            (error) => {
              this.logErrorHandler(error);
            }
          );
          this.manageIndicators = null;
          this.editIndicator = false;
        }
      );
    }
  }

  // Creates a copy of the selected Indicator
  cloneIndicator(i: IndUp): IndUp {
    let ind = {};
    for (let prop in i) {
      ind[prop] = i[prop];
    }
    return ind as IndUp;
  }

  // Shows the confirmDeleteIndicator message
  deleteIndicator() {
    this.messageService.clear();
    this.messageService.add({
      key: 'confirmDeleteIndicator',
      sticky: true,
      severity: 'warn',
      summary: 'Warning!',
      detail:
        'This operation is irreversible. Confirm to delete, or cancel to go back.',
    });
  }

  // Sends a request to delete the selected indicator
  confirmDeleteIndicator() {
    this.moduleService.deleteIndicators(this.manageIndicators).subscribe(
      () =>
        this.messageService.add({
          severity: 'info',
          summary: 'In process!',
          detail: 'Your indicator is being deleted!',
        }),
      (error) => {
        this.logErrorHandler(error);
      },
      () => {
        this.indsEditResult = [];
        this.moduleService.getIndicators().subscribe(
          (inds) => {
            this.inds = inds;
            inds.forEach((ind) =>
              this.indsEditResult.push({ value: ind.id, label: ind.indicator })
            );
          },
          (error) => {
            this.logErrorHandler(error);
          }
        );
        this.manageIndicators = null;
        this.messageService.clear('confirmDeleteIndicator');
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Indicator deleted successfully!',
        });
        this.editIndicator = false;
      }
    );
  }

  // Closes the confirmDeleteIndicator message
  cancelDeleteIndicator() {
    this.messageService.clear('confirmDeleteIndicator');
  }

  // Shows the Results Labeling Details dialog and tags the label as not new
  selectIndicatorResult(event) {
    this.isNewIndResult = false;
    this.manageIndResults = this.cloneIndicatorResult(event.data);
    this.editIndResult = true;
  }

  // Shows the Results Labeling Details dialog and tags the label as new
  addIndicatorResult() {
    this.isNewIndResult = true;
    this.manageIndResults = {} as IndResult;
    this.editIndResult = true;
  }

  // Sends a request to save or update a label according to its tag
  saveIndicatorResult() {
    if (this.isNewIndResult) {
      this.moduleService.postIndicatorResults(this.manageIndResults).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your result labeling is being created!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Result labeling created successfully!',
          });
          this.moduleService.getIndicatorResults().subscribe(
            (indRes) => (this.indsResult = indRes),
            (error) => {
              this.logErrorHandler(error);
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
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your result labeling is being updated!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Result labeling updated successfully!',
          });
          this.moduleService.getIndicatorResults().subscribe(
            (indRes) => (this.indsResult = indRes),
            (error) => {
              this.logErrorHandler(error);
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

  // Creates a copy of the selected label
  cloneIndicatorResult(i: IndResult): IndResult {
    let ind = {};
    for (let prop in i) {
      ind[prop] = i[prop];
    }
    return ind as IndResult;
  }

  // Shows the confirmDeleteIndicatorResult message
  deleteIndicatorResult() {
    this.messageService.clear();
    this.messageService.add({
      key: 'confirmDeleteIndicatorResult',
      sticky: true,
      severity: 'warn',
      summary: 'Warning!',
      detail:
        'This operation is irreversible. Confirm to delete, or cancel to go back.',
    });
  }

  // Sends a request to delete the selected label
  confirmDeleteIndicatorResult() {
    this.moduleService.deleteIndicatorResults(this.manageIndResults).subscribe(
      () =>
        this.messageService.add({
          severity: 'info',
          summary: 'In process!',
          detail: 'Your result labeling is being deleted!',
        }),
      (error) => {
        this.logErrorHandler(error);
      },
      () => {
        this.moduleService.getIndicatorResults().subscribe(
          (indRes) => (this.indsResult = indRes),
          (error) => {
            this.logErrorHandler(error);
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
          detail: 'Result labeling deleted successfully!',
        });
        this.editIndResult = false;
      }
    );
  }

  // Closes the confirmDeleteIndicatorResult message
  cancelDeleteIndicatorResult() {
    this.messageService.clear('confirmDeleteIndicatorResult');
  }

  // Sends a request to install the module from the uploaded file.
  installModule(event) {
    this.blockDocument();
    this.moduleService.installModule(event.files[0]).subscribe(
      () =>
        this.messageService.add({
          severity: 'info',
          summary: 'In process!',
          detail: 'Your module is being installed!',
        }),
      (error) => {
        this.logErrorHandler(error);
      },
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Module installed successfully!',
        });
        this.indSelectItems = [];
        this.moduleService.getModules().subscribe(
          (indicators) => {
            this.indicators = indicators;
            this.modules = indicators;
          },
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.indicators.forEach((indicator) => {
              this.indSelectItems.push({
                label: indicator.label,
                value: indicator,
              });
            });
          }
        );
        this.unblockDocument();
      }
    );
  }

  /**
   * Functions for ST
   */
  // Reverses color scale
  reverseColorScaleST() {
    this.scaleColorsST = this.scaleColorsST.reverse();
    this.colors = chroma.scale(this.scaleColorsST);
  }

  // Changes to fix or free scale
  changeScaleModeST(event) {
    this.scaleNumbersST = []
    if(event.checked) {
      this.scaleNumbersST = ['Min', '', '', '', '', '', '', '', '', 'Max'];
    } else {
      this.scaleNumbersST = ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];
    }
  }

  // Closes the accordion element of the main ST dialog
  closeAccordionST() {
    this.accordionST = -1;
  }

  // Opens the accordion element of the main ST dialog
  openAccordionST() {
    this.accordionST = 0;
  }

  // Shows the color scale dialog
  showColorScaleST() {
    this.displayColorScaleST = true;
  }

  // Hides the color scale dialog
  hideColorScaleST() {
    this.displayColorScaleST = false;
  }

  // Shows the main ST dialog and loads important variables to run its calculations
  showST() {
    this.upAct = false;
    this.stAct = true;
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

  // Shows the main ST dialog without loading anything else
  showNoLoadST() {
    this.displayST = true;
  }

  // Shows the Advanced dialog for ST
  showDataST() {
    this.displayDataST = true;
  }

  // Shows the Save Heatmap dialog
  showSaveHeatmap() {
    this.displaySaveHeatmap = true;
  }

  // Hides the main ST dialog
  hideST() {
    this.displayST = false;
  }

  // Hides the Save Heatmap dialog
  hideSaveHeatmap() {
    this.displaySaveHeatmap = false;
  }

  // Hides the Advanced dialog for ST
  hideDataST() {
    this.displayDataST = false;
  }

  // Sends a request to get the study areas for ST
  loadSTStudyArea() {
    let privStdArea = [];
    let pubStdArea = [];
    let stdAreaArray = [];
    this.layersService.getStudyAreas().subscribe(
      (studyArea) => {
        privStdArea = studyArea;
      },
      (error) => {
        this.logErrorHandler(error);
      },
      () => {
        stdAreaArray = stdAreaArray.concat(privStdArea);
        this.layersService.getPublicStudyAreas().subscribe(
          (studyArea) => {
            pubStdArea = studyArea;
          },
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            stdAreaArray = stdAreaArray.concat(pubStdArea);
            this.studyAreaST = stdAreaArray;
            this.stdAreaLayer = stdAreaArray;
            this.stdAreaFilter = stdAreaArray;
          }
        );
      }
    );
  }

  // Sends requests to get the normalization and operation methods for ST
  loadSTMethods() {
    this.layersService.getNormalizationMethods().subscribe(
      (normMethod) => {
        this.settingsType = normMethod;
        this.normMethodsSTManage = normMethod;
      },
      (error) => {
        this.logErrorHandler(error);
      }
    );
    this.layersService.getJoinMethods().subscribe(
      (joinType) => {
        this.joinType = joinType;
        this.joinMethodsSTManage = joinType;
      },
      (error) => {
        this.logErrorHandler(error);
      },
      () => {
        this.joinMethod = this.joinType[0];
      }
    );
    this.methodService.getStaticNormMethod().subscribe(
      (norms) => {
        norms.forEach((n) =>
          this.staticNormST.push({ value: n.id, label: n.label })
        );
      },
      (error) => {
        this.logErrorHandler(error);
      }
    );
    this.methodService.getStaticJoinMethod().subscribe(
      (joins) => {
        joins.forEach((j) =>
          this.staticJoinST.push({ value: j.id, label: j.label })
        );
      },
      (error) => {
        this.logErrorHandler(error);
      }
    );
  }

  // Sends a request o load tables for a study area using a study area ID
  loadSTTables() {
    this.nodeService.getSTTables(this.stdAreaSTDistances.id).then(
      (tablesST) => {
        this.tablesST = tablesST;
      },
      (error) => {
        this.logErrorHandler(error);
      }
    );
  }

  // Sends a request to get the layers for the Register Layers/Filters PrimeNG tree element
  loadDataLayerST() {
    this.nodeService.getLayersST().then((layers) => {
      this.layersDataST = layers;
      this.filtersDataST = layers;
    });
  }

  // Sends a request to get the required fields columns for the Copy Data module for ST
  loadSTDistancesColumns(event) {
    this.listService.getSTDistancesColumn(event.node.data).subscribe(
      (listDataST) => {
        this.listDataDistancesST = listDataST;
      },
      (error) => {
        this.logErrorHandler(error);
      }
    );
  }

  // Sends a request to fill the dropdowns for the Copy Data module for ST
  loadSTDataDistanceColumns(event) {
    if (event.node.type.toLowerCase() !== 'directory') {
      this.listService.getSTColumnWithId(event.node.data).subscribe(
        (listManageDataST) => {
          this.colFieldsNameArrayST = [];
          this.layerSTId = null;
          listManageDataST.forEach((data) =>
            this.colFieldsNameArrayST.push({ name: data })
          );
          this.layerSTId = event.node.data;
          this.listManageDistanceST = this.colFieldsNameArrayST;
          this.columnHeaderDistancesST = event.node.label;
        },
        (error) => {
          this.logErrorHandler(error);
        }
      );
    } else {
      this.colFieldsNameArrayST = [];
      this.layerSTId = null;
      this.listManageDistanceST = null;
      this.columnHeaderDistancesST = '';
    }
  }

  // Sends a request to get the required fields for the Register Layers/Filters tab in the Advanced dialog for ST
  loadSTColumns() {
    this.listService.getSTColumn().subscribe(
      (listDataST) => {
        this.listDataST = listDataST;
      },
      (error) => {
        this.logErrorHandler(error);
      }
    );
    this.listService.getSTColumnFilters().subscribe(
      (listDataST) => {
        this.listFiltersDataST = listDataST;
        this.loadDataLayerST();
      },
      (error) => {
        this.logErrorHandler(error);
      }
    );
  }

  // Sends a request to fill the dropdown elements for the Register Layers tab in the Advanced dialog for ST
  loadDataColumnST(event) {
    if (event.node.type.toLowerCase() !== 'directory') {
      let layerId = event.node.data.toString();
      let directory = event.node.parent.data.toString();
      this.tmpLayerId = event.node.data.toString();
      if(directory.includes("my_data")) {
        layerId = layerId.replace("priv_","");
        this.listService.getSTColumnWithId(layerId).subscribe(
          (listManageDataST) => {
            this.colFieldsNameArrayST = [];
            this.layerSTId = null;
            listManageDataST.forEach((data) =>
              this.colFieldsNameArrayST.push({ name: data })
            );
            this.layerSTId = layerId;
            this.listManageDataST = this.colFieldsNameArrayST;
            this.columnsHeaderST = event.node.label;
          },
          (error) => {
            this.logErrorHandler(error);
          }
        );
      } else if(directory.includes("public_data")) {
        layerId = layerId.replace("pub_","");
        this.listService.getSTPublicColumnWithId(layerId).subscribe(
          (listManageDataST) => {
            this.colFieldsNameArrayST = [];
            this.layerSTId = null;
            listManageDataST.forEach((data) =>
              this.colFieldsNameArrayST.push({ name: data })
            );
            this.layerSTId = layerId;
            this.listManageDataST = this.colFieldsNameArrayST;
            this.columnsHeaderST = event.node.label;
          },
          (error) => {
            this.logErrorHandler(error);
          }
        );
      }
    } else {
      this.colFieldsNameArrayST = [];
      this.layerSTId = null;
      this.listManageDataST = null;
      this.columnsHeaderST = '';
    }
  }

  // Sends a request to fill the dropdown elements for the Register Filters tab in the Advanced dialog for ST
  loadDataColumnFiltersST(event) {
    if (event.node.type.toLowerCase() !== 'directory') {
      let layerId = event.node.data.toString();
      let directory = event.node.parent.data.toString();
      this.tmpLayerId = event.node.data.toString();
      if(directory.includes("my_data")) {
        layerId = layerId.replace("priv_","");
        this.listService.getSTColumnFiltersWithId(layerId).subscribe(
          (listManageDataFiltersST) => {
            this.colFieldsNameArrayST = [];
            this.filterSTId = null;
            listManageDataFiltersST.forEach((data) =>
              this.colFieldsNameArrayST.push({ name: data })
            );
            this.filterSTId = event.node.data;
            this.listManageDataFiltersST = this.colFieldsNameArrayST;
            this.columnsHeaderFiltersST = event.node.label;
          },
          (error) => {
            this.logErrorHandler(error);
          }
        );
      } else if(directory.includes("public_data")) {
        layerId = layerId.replace("pub_","");
        this.listService.getSTPublicColumnWithId(layerId).subscribe(
          (listManageDataFiltersST) => {
            this.colFieldsNameArrayST = [];
            this.filterSTId = null;
            listManageDataFiltersST.forEach((data) =>
              this.colFieldsNameArrayST.push({ name: data })
            );
            this.filterSTId = event.node.data;
            this.listManageDataFiltersST = this.colFieldsNameArrayST;
            this.columnsHeaderFiltersST = event.node.label;
          },
          (error) => {
            this.logErrorHandler(error);
          }
        );
      }




    } else {
      this.colFieldsNameArrayST = [];
      this.filterSTId = null;
      this.listManageDataFiltersST = null;
      this.columnsHeaderFiltersST = '';
    }
  }

  // Sends a request to copy data from the selected layer into the distance module
  importDataST() {
    if (this.stdAreaSTDistances != null) {
      this.blockDocument();
      this.messageService.add({
        severity: 'info',
        summary: 'In Progress!',
        detail: 'Your operation is being processed.',
      });
      this.columnDataGP = [];
      this.columnFieldsArrayST.forEach((data) =>
        this.columnDataGP.push(data.name)
      );
      this.dataCopyST = {
        layerName: this.selDistanceLayerST.data,
        layerSTName: this.selTableST.data,
        table: this.columnDataGP,
        tableST: this.listDataDistancesST,
        studyAreaId: this.stdAreaSTDistances.id,
      };
      this.dataCopyService.copyDataST(this.dataCopyST).subscribe(
        (data) => {
          this.dataCopyST = {
            layerName: data.layerName,
            layerSTName: data.layerSTName,
            table: data.table,
            tableST: data.tableST,
            studyAreaId: data.studyAreaId,
          };
        },
        (error) => {
          this.unblockDocument();
          this.logErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Process completed successfully.',
          });
          this.unblockDocument();
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Please select a study area!',
      });
    }
  }

  // Sends a request to copy layer data into ST as a Layer
  matchLayersST() {
    if (this.layerSTId && this.layerSTLabel && this.layerSTField.name) {
      this.blockDocument();
      this.messageService.add({
        severity: 'info',
        summary: 'In Progress!',
        detail: 'Your operation is being processed.',
      });
      if(this.tmpLayerId.includes("priv_")) {
        
        this.matchLayer = {
          layerId: this.tmpLayerId.replace("priv_",""),
          layerLabel: this.layerSTLabel,
          field: this.layerSTField.name,
          mmuCode: this.layerSTMMU.name,
        };
        this.dataCopyService.copyLayersST(this.matchLayer).subscribe(
          (data) => {
            this.matchLayer = {
              layerId: data.layerId,
              layerLabel: data.layerLabel,
              field: data.field,
              mmuCode: data.mmuCode,
            };
          },
          (error) => {
            this.unblockDocument();
            this.logErrorHandler(error);
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Process completed successfully.',
            });
            if (this.selectedStudyAreaST) {
              this.loadSTOptions();
            }
            if (this.stdAreaManageLayer) {
              this.layerSTService
                .getLayerST(this.stdAreaManageLayer.id)
                .subscribe(
                  (layers) => (this.layersSTManage = layers),
                  (error) => {
                    this.logErrorHandler(error);
                  }
                );
            }
            this.unblockDocument();
          }
        );
      } else if(this.tmpLayerId.includes("pub_")) {
        this.matchLayer = {
          layerId: this.tmpLayerId.replace("pub_",""),
          layerLabel: this.layerSTLabel,
          field: this.layerSTField.name,
          mmuCode: this.layerSTMMU.name,
        };
        this.dataCopyService.copyPublicLayersST(this.matchLayer).subscribe(
          (data) => {
            this.matchLayer = {
              layerId: data.layerId,
              layerLabel: data.layerLabel,
              field: data.field,
              mmuCode: data.mmuCode,
            };
          },
          (error) => {
            this.unblockDocument();
            this.logErrorHandler(error);
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Process completed successfully.',
            });
            if (this.selectedStudyAreaST) {
              this.loadSTOptions();
            }
            if (this.stdAreaManageLayer) {
              let tmpId = this.stdAreaManageLayer.id.toString();
              let corrId;
              if(tmpId.includes("priv_")) {
                corrId = tmpId.replace("priv_","");
                this.layerSTService.getLayerST(corrId).subscribe(
                  (layers) => {
                    this.layersSTManage = layers;
                  },
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicLayerST(corrId).subscribe(
                      (layers) => {
                        this.layersSTManage = this.layersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              }
              else if(tmpId.includes("pub_")) {
                corrId = tmpId.replace("pub_","");
                this.layerSTService.getLayerSTPubStdArea(corrId).subscribe(
                  (layers) => {
                    this.layersSTManage = layers;
                  },
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicLayerSTPubStdArea(corrId).subscribe(
                      (layers) => {
                        this.layersSTManage = this.layersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              }
            }
            this.unblockDocument();
          }
        );
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'The form is not properly filled.',
      });
    }
  }

  // Sends a request to copy layer data into ST as a Filter
  matchFiltersST() {
    this.blockDocument();
    this.messageService.add({
      severity: 'info',
      summary: 'In Progress!',
      detail: 'Your operation is being processed.',
    });
    if(this.tmpLayerId.includes("priv_")) {
      this.matchFilter = {
        filterId: this.tmpLayerId.replace("priv_",""),
        filterLabel: this.filterSTLabel,
      };
      this.dataCopyService.copyFiltersST(this.matchFilter).subscribe(
        (data) => {
          this.matchFilter = {
            filterId: data.layerId,
            filterLabel: data.layerLabel,
          };
        },
        (error) => {
          this.unblockDocument();
          this.logErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Process completed successfully.',
          });
          if (this.selectedStudyAreaST) {
            this.loadSTOptions();
          }
          if (this.stdAreaManageFilter) {
            let tmpId = this.stdAreaManageFilter.id.toString();
              let corrId;
              if(tmpId.includes("priv_")) {
                corrId = tmpId.replace("priv_","");
                this.layerSTService
                .getFiltersST(this.stdAreaManageFilter.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (lyrs) => (this.filtersSTManage = lyrs),
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicFilterST(corrId).subscribe(
                      (layers) => {
                        this.filtersSTManage = this.filtersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              } else if(tmpId.includes("pub_")) {
                corrId = tmpId.replace("pub_","");
                this.layerSTService
                .getFilterSTPubStdArea(this.stdAreaManageFilter.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (lyrs) => (this.filtersSTManage = lyrs),
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicFilterSTPubStdArea(corrId).subscribe(
                      (layers) => {
                        this.filtersSTManage = this.filtersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              }
          }
          this.unblockDocument();
        }
      );
    } else if(this.tmpLayerId.includes("pub_")) {
      this.matchFilter = {
        filterId: this.tmpLayerId.replace("pub_",""),
        filterLabel: this.filterSTLabel,
      };
      this.dataCopyService.copyPublicFiltersST(this.matchFilter).subscribe(
        (data) => {
          this.matchFilter = {
            filterId: data.layerId,
            filterLabel: data.layerLabel,
          };
        },
        (error) => {
          this.unblockDocument();
          this.logErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Process completed successfully.',
          });
          if (this.selectedStudyAreaST) {
            this.loadSTOptions();
          }
          if (this.stdAreaManageFilter) {
            let tmpId = this.stdAreaManageFilter.id.toString();
              let corrId;
              if(tmpId.includes("priv_")) {
                corrId = tmpId.replace("priv_","");
                this.layerSTService
                .getFiltersST(this.stdAreaManageFilter.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (lyrs) => (this.filtersSTManage = lyrs),
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicFilterST(corrId).subscribe(
                      (layers) => {
                        this.filtersSTManage = this.filtersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              } else if(tmpId.includes("pub_")) {
                corrId = tmpId.replace("pub_","");
                this.layerSTService
                .getFilterSTPubStdArea(this.stdAreaManageFilter.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (lyrs) => (this.filtersSTManage = lyrs),
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicFilterSTPubStdArea(corrId).subscribe(
                      (layers) => {
                        this.filtersSTManage = this.filtersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              }
          }
          this.unblockDocument();
        }
      );
    }
  }

  // Sends requests to load Layers, Settings and Filters pertaining to the selected study area
  loadSTOptions() {
    if (this.selectedStudyAreaST) {
      this.layerSettings = [];
      this.selectedLayersST = [];
      this.selSetting = [];
      this.settingsString = '';
      this.layersService.getLayers(this.selectedStudyAreaST.id).subscribe(
        (layers) => (this.layerSettings = layers),
        (error) => {
          this.logErrorHandler(error);
        }, () => {
          this.layerSettings.forEach(
            stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
          );
        }
      );
      this.filterList = [];
      this.selectedFiltersST = [];
      this.layersService.getFilters(this.selectedStudyAreaST.id).subscribe(
        (filters) => (this.filterList = filters),
        (error) => { 
          this.logErrorHandler(error);
        }
      );
    }
  }

  // Sends a request to evaluate the selected Layers and Filters
  evaluateLayer() {
    this.stResult = true;
    this.selectedFiltersArrayST = [];
    this.selectedFiltersST.forEach((fltr) =>
      this.selectedFiltersArrayST.push(+fltr)
    );
    if (this.selSetting.length == 0 || this.selSetting == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Please select at least one layer.',
      });
    } else if (!this.joinMethod) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Please select a join method.',
      });
    } else {
      this.blockDocument();
      this.settingsString = '';
      this.selectedLayersST = [];
      this.selSetting.forEach((setting) => {
        this.selectedLayersST.push(setting.st_layer_id);
      });
      this.selSetting.forEach(
        (stng) => (stng.smaller_better = stng.smaller_better ? 1 : 0)
      );
      this.settingsString = JSON.stringify(this.selSetting);
      this.stEvaluationService
        .postLayer(
          this.selectedStudyAreaST.id,
          this.selectedLayersST,
          this.selectedFiltersArrayST,
          this.settingsString,
          this.joinMethod.value
        )
        .subscribe(
          (data) => {
            this.geojsonObject = data[0];
            this.fullGeojson = data;
          },
          (error) => {
            this.unblockDocument();
            this.stResult = true;
            this.logErrorHandler(error);
          },
          () => {
            this.printGeoJSON();
          }
        );
    }
  }

  // Sends a request to start the distance evaluation
  evaluateDistances() {
    let interval;
    let stdAreaEval = this.stdAreaSTEvalDist.id;
    this.messageService.add({
      severity: 'info',
      summary: 'In Progress!',
      detail: 'Your operation is being processed.',
    });
    this.stEvaluationService.postStdArea(stdAreaEval).subscribe(
      () => {},
      (error) => {
        this.unblockDocument();
        this.logErrorHandler(error);
      },
      () => {
        interval = setInterval(
          () => this.getStatusST(interval, stdAreaEval),
          5000
        );
      }
    );
  }

  // Sends a request to get the current status of the distance evaluation process
  getStatusST(i, sa) {
    let statusFlag = false;
    this.stEvaluationService.statusEvaluateST(sa).subscribe(
      (sts) => {
        this.statusST = sts;
      },
      () => {},
      () => {
        if (this.statusST.length > 0) {
          this.clearEvaluation();
          this.showEvaluation();
          this.statusST.forEach((s) => {
            this.procHtml +=
              '<div class="ui-md-4">' +
              s.event +
              '</div><div class="ui-md-2">' +
              s.layer_id +
              '</div><div class="ui-md-2">' +
              s.created_on +
              '</div><div class="ui-md-4">' +
              s.value +
              '</div>';
            if (
              s.event.toLowerCase() === 'all distances finished' ||
              s.value.toLowerCase() === 'all distances finished'
            ) {
              statusFlag = true;
            }
          });
          if (statusFlag) {
            clearInterval(i);
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Distance evaluation completed!',
            });
            this.getSTDistanceLayers(sa);
          }
        }
      }
    );
  }

  // Sends a request to get the distance layers generated by the distance module
  getSTDistanceLayers(sa) {
    this.stEvaluationService.getDistanceLayers(sa).subscribe(
      (layers) => (this.distanceLayerST = layers),
      (error) => {
        this.logErrorHandler(error);
      },
      () => {
        this.distanceLayerST.forEach((lyr) => {
          setTimeout(() => {
            Oskari.getSandbox()
              .findRegisteredModuleInstance('MyPlacesImport')
              .getService()
              .addLayerToService(lyr, false);
            Oskari.getSandbox()
              .findRegisteredModuleInstance('MyPlacesImport')
              .getTab()
              .refresh();
          }, 500);
        });
        this.loadSTStudyArea();
      }
    );
  }

  // Prints the result from the ST evaluation process into the map
  printGeoJSON() {
    let geoVals = [];
    if (this.geojsonObject['features'] !== null) {
      const heatmapStdArea = this.selectedStudyAreaST.id;
      this.geojsonObject['features'].forEach(feature => {
        geoVals.push(feature.properties.value);
      });
      const set = new Set(geoVals);
      geoVals = [];
      geoVals = [...set];
      geoVals.sort((a, b) => a - b);
      this.oskariHeatmap = {
        name: '',
        study_area: heatmapStdArea,
        crs: this.geojsonObject.crs.properties.name,
        description: '',
        source: '',
        style: '',
        geojson: JSON.stringify({ 0: this.geojsonObject }),
      };
      this.layerOptions = {
        layerId: 'UH_OUTPUT',
        layerInspireName: 'Contagion Hotspots',
        layerOrganizationName: 'World Bank Group',
        showLayer: true,
        opacity: 85,
        layerName: 'Contagion Hotspots',
        layerDescription: 'Displays predicted contagion hotspots.',
        layerPermissions: {
          publish: 'publication_permission_ok',
        },
        centerTo: true,
        optionalStyles: [],
      };
      if(this.isFreeScaleST) {
        this.colors = this.colors.domain([geoVals[0], geoVals[geoVals.length - 1]]);
        this.filterRangeST[0] = geoVals[0],
        this.filterRangeST[1] = geoVals[geoVals.length - 1];
      } else {
        this.colors = this.colors.domain([0,100]);
      }
      try {
        this.valuesST.forEach((val) => {
          if (val >= this.filterRangeST[0] && val <= this.filterRangeST[1]) {
            this.layerOptions['optionalStyles'].push({
              property: { key: 'value', value: val },
              stroke: {
                color: this.colors(val).toString(),
              },
              fill: {
                color: this.colors(val).toString(),
              },
            });
          } else {
            this.layerOptions['optionalStyles'].push({
              property: { key: 'value', value: val },
              stroke: {
                color: 'transparent',
              },
              fill: {
                color: 'transparent',
              },
            });
          }
        });
        Oskari.getSandbox().postRequestByName('VectorLayerRequest', [
          this.layerOptions,
        ]);
        Oskari.getSandbox().postRequestByName(
          'MapModulePlugin.RemoveFeaturesFromMapRequest',
          [null, null, 'UH_OUTPUT']
        );
        Oskari.getSandbox().postRequestByName(this.rn, [
          this.geojsonObject,
          this.layerOptions,
        ]);
        this.stResult = false;
        this.closeAccordionST();
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Process completed successfully!',
        });
        this.unblockDocument();
        this.oskariHeatmap['style'] = JSON.stringify(this.layerOptions['optionalStyles']);
        console.log(this.oskariHeatmap);
      } catch(e) {
        this.unblockDocument();
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail:
            'Error: ' + e,
        });
      }
      
    } else {
      this.unblockDocument();
      this.closeAccordionST();
      this.stResult = true;
      this.messageService.add({
        severity: 'info',
        summary: 'Success',
        detail:
          'Process completed successfully, but no results were generated.',
      });
      Oskari.getSandbox().postRequestByName(
        'MapModulePlugin.RemoveFeaturesFromMapRequest',
        [null, null, 'UH_OUTPUT']
      );
    }
  }

  // Adjusts the results from the ST evaluation process to show values according to the subset by score slider
  filterGeoJSON(event) {
    if (this.geojsonObject != null && this.geojsonObject['features'] != null) {
      this.layerOptions = {
        layerId: 'UH_OUTPUT',
        layerInspireName: 'Contagion Hotspots',
        layerOrganizationName: 'World Bank Group',
        showLayer: true,
        opacity: 85,
        layerName: 'Contagion Hotspots',
        layerDescription: 'Displays predicted contagion hotspots.',
        layerPermissions: {
          publish: 'publication_permission_ok',
        },
        centerTo: true,
        optionalStyles: [],
      };
      this.valuesST.forEach((val) => {
        if (val >= event.values[0] && val <= event.values[1]) {
          this.layerOptions['optionalStyles'].push({
            property: { key: 'value', value: val },
            stroke: {
              color: this.colors(val).toString(),
            },
            fill: {
              color: this.colors(val).toString(),
            },
          });
        } else {
          this.layerOptions['optionalStyles'].push({
            property: { key: 'value', value: val },
            stroke: {
              color: 'transparent',
            },
            fill: {
              color: 'transparent',
            },
          });
        }
      });
      Oskari.getSandbox().postRequestByName('VectorLayerRequest', [
        this.layerOptions,
      ]);
      Oskari.getSandbox().postRequestByName(
        'MapModulePlugin.RemoveFeaturesFromMapRequest',
        [null, null, 'UH_OUTPUT']
      );
      Oskari.getSandbox().postRequestByName(this.rn, [
        this.geojsonObject,
        this.layerOptions,
      ]);
      this.oskariHeatmap['style'] = JSON.stringify(this.layerOptions['optionalStyles']);
      console.log(this.oskariHeatmap);
    }
  }

  // Sends a request to save the current heatmap as a layer in the geoportal
  saveHeatmap() {
    this.messageService.add({
      severity: 'info',
      summary: 'In Progress!',
      detail: 'Your operation is being processed.',
    });
    this.blockDocument();
    this.heatmapService.saveHeatmap(this.oskariHeatmap).subscribe(
      (res) => (this.oskariResponse = res),
      (error) => {
        this.unblockDocument();
        this.logErrorHandler(error);
      },
      () => {
        this.unblockDocument();
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Process completed successfully!',
        });
        this.hideSaveHeatmap();
        Oskari.getSandbox()
          .findRegisteredModuleInstance('MyPlacesImport')
          .getService()
          .addLayerToService(this.oskariResponse, false);
        Oskari.getSandbox()
          .findRegisteredModuleInstance('MyPlacesImport')
          .getTab()
          .refresh();
        this.loadSTStudyArea();
      }
    );
  }

  // Sends a request to load the registered layers for the selected study area
  loadManageLayers() {
    if (this.stdAreaManageLayer) {
      let tmpId = this.stdAreaManageLayer.id.toString();
      let corrId;
      if(tmpId.includes("priv_")) {
        corrId = tmpId.replace("priv_","");
        this.layerSTService.getLayerST(corrId).subscribe(
          (layers) => {
            this.layersSTManage = layers;
          },
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.layerSTService.getPublicLayerST(corrId).subscribe(
              (layers) => {
                this.layersSTManage = this.layersSTManage.concat(layers);
              },
              (error) => {
                this.logErrorHandler(error);
              },
            );
          }
        );
      }
      else if(tmpId.includes("pub_")) {
        corrId = tmpId.replace("pub_","");
        this.layerSTService.getLayerSTPubStdArea(corrId).subscribe(
          (layers) => {
            this.layersSTManage = layers;
          },
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.layerSTService.getPublicLayerSTPubStdArea(corrId).subscribe(
              (layers) => {
                this.layersSTManage = this.layersSTManage.concat(layers);
              },
              (error) => {
                this.logErrorHandler(error);
              },
            );
          }
        );
      }
    }
  }

  /* loadManagePublicLayers() {
    if (this.stdAreaManagePublicLayer) {
      let tmpId = this.stdAreaManagePublicLayer.id.toString();
      let corrId;
      if(tmpId.includes("priv_")) {
        corrId = tmpId.replace("priv_","");
        this.layerSTService.getLayerST(corrId).subscribe(
          (layers) => (this.layersSTManage = layers),
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.layerSTService.getLayerSTPubStdArea(corrId).subscribe(
              (layers) => {
                this.layersSTManage = this.layersSTManage.concat(layers);
              },
              (error) => {
                this.logErrorHandler(error);
              }
            );
          }
        );
      }
      else if(tmpId.includes("pub_")) {
        corrId = tmpId.replace("pub_","");
        this.layerSTService.getPublicLayerST(corrId).subscribe(
          (layers) => (this.layersSTManage = layers),
          (error) => {
            this.logErrorHandler(error);
          }
        );
      }
    }
  } */

  // Sends a request to load the registered filters for the selected study area
  loadManageFilters() {
    if (this.stdAreaManageFilter) {
      let tmpId = this.stdAreaManageFilter.id.toString();
      let corrId;
      if(tmpId.includes("priv_")) {
        corrId = tmpId.replace("priv_","");
        this.layerSTService.getFiltersST(corrId).subscribe(
          (layers) => {
            this.filtersSTManage = layers;
          },
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.layerSTService.getPublicFilterST(corrId).subscribe(
              (layers) => {
                this.filtersSTManage = this.filtersSTManage.concat(layers);
              },
              (error) => {
                this.logErrorHandler(error);
              },
            );
          }
        );
      }
      else if(tmpId.includes("pub_")) {
        corrId = tmpId.replace("pub_","");
        this.layerSTService.getFilterSTPubStdArea(corrId).subscribe(
          (layers) => {
            this.filtersSTManage = layers;
          },
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.layerSTService.getPublicFilterSTPubStdArea(corrId).subscribe(
              (layers) => {
                this.filtersSTManage = this.filtersSTManage.concat(layers);
              },
              (error) => {
                this.logErrorHandler(error);
              },
            );
          }
        );
      }
    }
  }

  // Sends a request to load the registered settings for the selected study area
  loadManageSettings() {
    if (this.stdAreaManageSetting) {
      let tmpId = this.stdAreaManageSetting.id.toString();
      let corrId;
      if(tmpId.includes("priv_")) {
        corrId = tmpId.replace("priv_","");
        this.settingsService.getSettings(corrId).subscribe(
          (settings) => (this.settingsSTManage = settings),
          (error) => {
            this.logErrorHandler(error);
          }, () => {
            this.settingsService.getPublicSettings(corrId).subscribe(
              (settings) => {
                this.settingsSTManage = this.settingsSTManage.concat(settings)
              },
              (error) => {
                this.logErrorHandler(error);
              }, () => {
                this.settingsSTManage.forEach(
                  stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                );
              }
            );
          }
        );
      }
      else if(tmpId.includes("pub_")) {
        corrId = tmpId.replace("pub_","");
        this.settingsService.getSettings(corrId).subscribe(
          (settings) => (this.settingsSTManage = settings),
          (error) => {
            this.logErrorHandler(error);
          }, () => {
            this.settingsService.getPublicSettings(corrId).subscribe(
              (settings) => {
                this.settingsSTManage = this.settingsSTManage.concat(settings)
              },
              (error) => {
                this.logErrorHandler(error);
              }, () => {
                this.settingsSTManage.forEach(
                  stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                );
              }
            );
          }
        );
      }
      /* this.settingsService.getSettings(this.stdAreaManageSetting.id).subscribe(
        (settings) => (this.settingsSTManage = settings),
        (error) => {
          this.logErrorHandler(error);
        }, () => {
          this.settingsSTManage.forEach(
            stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
          );
        }
      ); */
    }
  }

  // Shows the Layer Details dialog and tags the selected layer as not new
  selectLayer(event) {
    this.isNewLayer = false;
    this.manageLayer = this.cloneLayer(event.data);
    let cpLayer = event.data;
    if(!isUndefined(cpLayer.user_layer_id)) {
      let tmpId = cpLayer.user_layer_id;
      this.listService.getSTColumnWithId(tmpId).subscribe(
        (columns) => {
          this.colFieldsNameArrayST = [];
          columns.forEach((data) =>
            this.colFieldsNameArrayST.push({ name: data })
          );
          this.selLayerColumns = this.colFieldsNameArrayST;
        },
        (error) => {
          this.logErrorHandler(error);
        }
      );
    } else if(!isUndefined(cpLayer.public_layer_id)) {
      let tmpId = cpLayer.public_layer_id;
      this.listService.getSTPublicColumnWithId(tmpId).subscribe(
        (columns) => {
          this.colFieldsNameArrayST = [];
          columns.forEach((data) =>
            this.colFieldsNameArrayST.push({ name: data })
          );
          this.selLayerColumns = this.colFieldsNameArrayST;
        },
        (error) => {
          this.logErrorHandler(error);
        }
      );
    }
    this.editLayers = true;
  }

  // Sends a request to save the selected layer
  saveLayer() {
    if (this.isNewLayer) {
      if(!isUndefined(this.manageLayer.user_layer_id)) {
        this.layerSTService.createLayerST(this.manageLayer).subscribe(
          () =>
            this.messageService.add({
              severity: 'info',
              summary: 'In process!',
              detail: 'Your layer is being created!',
            }),
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Layer created successfully!',
            });
            if (this.stdAreaManageSetting) {
              this.settingsService
                .getSettings(this.stdAreaManageSetting.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (stngs) => (this.settingsSTManage = stngs),
                  (error) => {
                    this.logErrorHandler(error);
                  }, () => {
                    this.settingsSTManage.forEach(
                      stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                    );
                  }
                );
            }
            if (this.stdAreaManageLayer) {
              let tmpId = this.stdAreaManageLayer.id.toString();
              let corrId;
              if(tmpId.includes("priv_")) {
                corrId = tmpId.replace("priv_","");
                this.layerSTService.getLayerST(corrId).subscribe(
                  (layers) => {
                    this.layersSTManage = layers;
                  },
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicLayerST(corrId).subscribe(
                      (layers) => {
                        this.layersSTManage = this.layersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              }
              else if(tmpId.includes("pub_")) {
                corrId = tmpId.replace("pub_","");
                this.layerSTService.getLayerSTPubStdArea(corrId).subscribe(
                  (layers) => {
                    this.layersSTManage = layers;
                  },
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicLayerSTPubStdArea(corrId).subscribe(
                      (layers) => {
                        this.layersSTManage = this.layersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              }
            }
            if (this.selectedStudyAreaST) {
              this.layersService.getLayers(this.selectedStudyAreaST.id.toString().replace("pub_","").replace("priv_","")).subscribe(
                (lyrs) => (this.layerSettings = lyrs),
                (error) => {
                  this.logErrorHandler(error);
                }, () => {
                  this.layerSettings.forEach(
                    stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                  );
                }
              );
            }
            this.editLayers = false;
          }
        );
      } else if(!isUndefined(this.manageLayer.public_layer_id)) {
        this.layerSTService.createPublicLayerST(this.manageLayer).subscribe(
          () =>
            this.messageService.add({
              severity: 'info',
              summary: 'In process!',
              detail: 'Your layer is being created!',
            }),
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Layer created successfully!',
            });
            if (this.stdAreaManageSetting) {
              this.settingsService
                .getSettings(this.stdAreaManageSetting.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (stngs) => (this.settingsSTManage = stngs),
                  (error) => {
                    this.logErrorHandler(error);
                  }, () => {
                    this.settingsSTManage.forEach(
                      stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                    );
                  }
                );
            }
            if (this.stdAreaManageLayer) {
              let tmpId = this.stdAreaManageLayer.id.toString();
              let corrId;
              if(tmpId.includes("priv_")) {
                corrId = tmpId.replace("priv_","");
                this.layerSTService.getLayerST(corrId).subscribe(
                  (layers) => {
                    this.layersSTManage = layers;
                  },
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicLayerST(corrId).subscribe(
                      (layers) => {
                        this.layersSTManage = this.layersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              }
              else if(tmpId.includes("pub_")) {
                corrId = tmpId.replace("pub_","");
                this.layerSTService.getLayerSTPubStdArea(corrId).subscribe(
                  (layers) => {
                    this.layersSTManage = layers;
                  },
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicLayerSTPubStdArea(corrId).subscribe(
                      (layers) => {
                        this.layersSTManage = this.layersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              }
            }
            if (this.selectedStudyAreaST) {
              this.layersService.getLayers(this.selectedStudyAreaST.id.toString().replace("pub_","").replace("priv_","")).subscribe(
                (lyrs) => (this.layerSettings = lyrs),
                (error) => {
                  this.logErrorHandler(error);
                }, () => {
                  this.layerSettings.forEach(
                    stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                  );
                }
              );
            }
            this.editLayers = false;
          }
        );
      }
    } else {
      if(!isUndefined(this.manageLayer.user_layer_id)) {
        this.layerSTService.updateLayerST(this.manageLayer).subscribe(
          () =>
            this.messageService.add({
              severity: 'info',
              summary: 'In process!',
              detail: 'Your layer is being updated!',
            }),
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Layer updated successfully!',
            });
            if (this.stdAreaManageSetting) {
              this.settingsService
                .getSettings(this.stdAreaManageSetting.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (stngs) => (this.settingsSTManage = stngs),
                  (error) => {
                    this.logErrorHandler(error);
                  }, () => {
                    this.settingsSTManage.forEach(
                      stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                    );
                  }
                );
            }
            if (this.stdAreaManageLayer) {
              this.layerSTService
                .getLayerST(this.stdAreaManageLayer.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (lyrs) => (this.layersSTManage = lyrs),
                  (error) => {
                    this.logErrorHandler(error);
                  }
                );
            }
            if (this.selectedStudyAreaST) {
              this.layersService.getLayers(this.selectedStudyAreaST.id.toString().replace("pub_","").replace("priv_","")).subscribe(
                (lyrs) => (this.layerSettings = lyrs),
                (error) => {
                  this.logErrorHandler(error);
                }, () => {
                  this.layerSettings.forEach(
                    stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                  );
                }
              );
            }
            this.manageLayer = null;
            this.editLayers = false;
          }
        );
      } else if(!isUndefined(this.manageLayer.public_layer_id)) {
        this.layerSTService.updatePublicLayerST(this.manageLayer).subscribe(
          () =>
            this.messageService.add({
              severity: 'info',
              summary: 'In process!',
              detail: 'Your layer is being updated!',
            }),
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Layer updated successfully!',
            });
            if (this.stdAreaManageSetting) {
              this.settingsService
                .getSettings(this.stdAreaManageSetting.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (stngs) => (this.settingsSTManage = stngs),
                  (error) => {
                    this.logErrorHandler(error);
                  }, () => {
                    this.settingsSTManage.forEach(
                      stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                    );
                  }
                );
            }
            if (this.stdAreaManageLayer) {
              let tmpId = this.stdAreaManageLayer.id.toString();
              let corrId;
              if(tmpId.includes("priv_")) {
                corrId = tmpId.replace("priv_","");
                this.layerSTService.getLayerST(corrId).subscribe(
                  (layers) => {
                    this.layersSTManage = layers;
                  },
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicLayerST(corrId).subscribe(
                      (layers) => {
                        this.layersSTManage = this.layersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              }
              else if(tmpId.includes("pub_")) {
                corrId = tmpId.replace("pub_","");
                this.layerSTService.getLayerSTPubStdArea(corrId).subscribe(
                  (layers) => {
                    this.layersSTManage = layers;
                  },
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicLayerSTPubStdArea(corrId).subscribe(
                      (layers) => {
                        this.layersSTManage = this.layersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              }
            }
            if (this.selectedStudyAreaST) {
              this.layersService.getLayers(this.selectedStudyAreaST.id.toString().replace("pub_","").replace("priv_","")).subscribe(
                (lyrs) => (this.layerSettings = lyrs),
                (error) => {
                  this.logErrorHandler(error);
                }, () => {
                  this.layerSettings.forEach(
                    stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                  );
                }
              );
            }
            this.manageLayer = null;
            this.editLayers = false;
          }
        );
      }
    }
  }

  // Creates a copy of the selected layer
  cloneLayer(l: LayerST): LayerST {
    let lyr = {};
    for (let prop in l) {
      lyr[prop] = l[prop];
    }
    return lyr as LayerST;
  }

  // Shows the confirmDeleteLayer message
  deleteLayer() {
    this.messageService.clear();
    this.messageService.add({
      key: 'confirmDeleteLayer',
      sticky: true,
      severity: 'warn',
      summary: 'Warning!',
      detail:
        'This operation is irreversible. Confirm to delete, or cancel to go back.',
    });
  }

  // Sends a request to delete the selected layer
  confirmDeleteLayer() {
    if(!isUndefined(this.manageLayer.user_layer_id)) {
      this.layerSTService.deleteLayerST(this.manageLayer).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your layer is being deleted!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.manageLayer = null;
          this.messageService.clear('confirmDeleteLayer');
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Layer deleted successfully!',
          });
          if (this.stdAreaManageSetting) {
            this.settingsService
              .getSettings(this.stdAreaManageSetting.id.toString().replace("pub_","").replace("priv_",""))
              .subscribe(
                (stngs) => (this.settingsSTManage = stngs),
                (error) => {
                  this.logErrorHandler(error);
                }, () => {
                  this.settingsSTManage.forEach(
                    stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                  );
                }
              );
          }
          if (this.stdAreaManageLayer) {
            let tmpId = this.stdAreaManageLayer.id.toString();
            let corrId;
            if(tmpId.includes("priv_")) {
              corrId = tmpId.replace("priv_","");
              this.layerSTService.getLayerST(corrId).subscribe(
                (layers) => {
                  this.layersSTManage = layers;
                },
                (error) => {
                  this.logErrorHandler(error);
                },
                () => {
                  this.layerSTService.getPublicLayerST(corrId).subscribe(
                    (layers) => {
                      this.layersSTManage = this.layersSTManage.concat(layers);
                    },
                    (error) => {
                      this.logErrorHandler(error);
                    },
                  );
                }
              );
            }
            else if(tmpId.includes("pub_")) {
              corrId = tmpId.replace("pub_","");
              this.layerSTService.getLayerSTPubStdArea(corrId).subscribe(
                (layers) => {
                  this.layersSTManage = layers;
                },
                (error) => {
                  this.logErrorHandler(error);
                },
                () => {
                  this.layerSTService.getPublicLayerSTPubStdArea(corrId).subscribe(
                    (layers) => {
                      this.layersSTManage = this.layersSTManage.concat(layers);
                    },
                    (error) => {
                      this.logErrorHandler(error);
                    },
                  );
                }
              );
            }
          }
          if (this.selectedStudyAreaST) {
            this.layersService.getLayers(this.selectedStudyAreaST.id.toString().replace("pub_","").replace("priv_","")).subscribe(
              (layers) => (this.layerSettings = layers),
              (error) => {
                this.logErrorHandler(error);
              }, () => {
                this.layerSettings.forEach(
                  stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                );
              }
            );
          }
          this.editLayers = false;
        }
      );
    } else if(!isUndefined(this.manageLayer.public_layer_id)) {
      this.layerSTService.deletePublicLayerST(this.manageLayer).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your layer is being deleted!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.manageLayer = null;
          this.messageService.clear('confirmDeleteLayer');
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Layer deleted successfully!',
          });
          if (this.stdAreaManageSetting) {
            this.settingsService
              .getSettings(this.stdAreaManageSetting.id.toString().replace("pub_","").replace("priv_",""))
              .subscribe(
                (stngs) => (this.settingsSTManage = stngs),
                (error) => {
                  this.logErrorHandler(error);
                }, () => {
                  this.settingsSTManage.forEach(
                    stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                  );
                }
              );
          }
          if (this.stdAreaManageLayer) {
            let tmpId = this.stdAreaManageLayer.id.toString();
            let corrId;
            if(tmpId.includes("priv_")) {
              corrId = tmpId.replace("priv_","");
              this.layerSTService.getLayerST(corrId).subscribe(
                (layers) => {
                  this.layersSTManage = layers;
                },
                (error) => {
                  this.logErrorHandler(error);
                },
                () => {
                  this.layerSTService.getPublicLayerST(corrId).subscribe(
                    (layers) => {
                      this.layersSTManage = this.layersSTManage.concat(layers);
                    },
                    (error) => {
                      this.logErrorHandler(error);
                    },
                  );
                }
              );
            }
            else if(tmpId.includes("pub_")) {
              corrId = tmpId.replace("pub_","");
              this.layerSTService.getLayerSTPubStdArea(corrId).subscribe(
                (layers) => {
                  this.layersSTManage = layers;
                },
                (error) => {
                  this.logErrorHandler(error);
                },
                () => {
                  this.layerSTService.getPublicLayerSTPubStdArea(corrId).subscribe(
                    (layers) => {
                      this.layersSTManage = this.layersSTManage.concat(layers);
                    },
                    (error) => {
                      this.logErrorHandler(error);
                    },
                  );
                }
              );
            }
          }
          if (this.selectedStudyAreaST) {
            this.layersService.getLayers(this.selectedStudyAreaST.id).subscribe(
              (layers) => (this.layerSettings = layers),
              (error) => {
                this.logErrorHandler(error);
              }, () => {
                this.layerSettings.forEach(
                  stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                );
              }
            );
          }
          this.editLayers = false;
        }
      );
    }
  }

  // Closes the confirmDeleteLayer message
  cancelDeleteLayer() {
    this.messageService.clear('confirmDeleteLayer');
  }

  // Shows the Filter Details dialog and marks the selected filter as not new
  selectFilter(event) {
    this.isNewFilter = false;
    this.manageFilter = this.cloneFilter(event.data);
    this.editFilters = true;
  }

  // Sends a request to update the selected filter
  saveFilter() {
    if (this.isNewFilter) {
      if(!isUndefined(this.manageFilter.user_layer_id)) {
        this.layerSTService.createFilterST(this.manageFilter).subscribe(
          () =>
            this.messageService.add({
              severity: 'info',
              summary: 'In process!',
              detail: 'Your layer is being created!',
            }),
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Layer created successfully!',
            });
            if (this.stdAreaManageSetting) {
              this.settingsService
                .getSettings(this.stdAreaManageSetting.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (stngs) => (this.settingsSTManage = stngs),
                  (error) => {
                    this.logErrorHandler(error);
                  }, () => {
                    this.settingsSTManage.forEach(
                      stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                    );
                  }
                );
            }
            if (this.stdAreaManageFilter) {
              let tmpId = this.stdAreaManageFilter.id.toString();
              let corrId;
              if(tmpId.includes("priv_")) {
                corrId = tmpId.replace("priv_","");
                this.layerSTService
                .getFiltersST(this.stdAreaManageFilter.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (lyrs) => (this.filtersSTManage = lyrs),
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicFilterST(corrId).subscribe(
                      (layers) => {
                        this.filtersSTManage = this.filtersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              } else if(tmpId.includes("pub_")) {
                corrId = tmpId.replace("priv_","");
                this.layerSTService
                .getFilterSTPubStdArea(this.stdAreaManageFilter.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (lyrs) => (this.filtersSTManage = lyrs),
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicFilterSTPubStdArea(corrId).subscribe(
                      (layers) => {
                        this.filtersSTManage = this.filtersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              }
            }
            if (this.selectedStudyAreaST) {
              this.layersService.getFilters(this.selectedStudyAreaST.id.toString().replace("pub_","").replace("priv_","")).subscribe(
                (lyrs) => (this.layerSettings = lyrs),
                (error) => {
                  this.logErrorHandler(error);
                }, () => {
                  this.layerSettings.forEach(
                    stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                  );
                }
              );
            }
            this.editLayers = false;
          }
        );
      } else if(!isUndefined(this.manageLayer.public_layer_id)) {
        this.layerSTService.createPublicLayerST(this.manageLayer).subscribe(
          () =>
            this.messageService.add({
              severity: 'info',
              summary: 'In process!',
              detail: 'Your layer is being created!',
            }),
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Layer created successfully!',
            });
            if (this.stdAreaManageSetting) {
              this.settingsService
                .getSettings(this.stdAreaManageSetting.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (stngs) => (this.settingsSTManage = stngs),
                  (error) => {
                    this.logErrorHandler(error);
                  }, () => {
                    this.settingsSTManage.forEach(
                      stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                    );
                  }
                );
            }
            if (this.stdAreaManageFilter) {
              let tmpId = this.stdAreaManageFilter.id.toString();
              let corrId;
              if(tmpId.includes("priv_")) {
                corrId = tmpId.replace("priv_","");
                this.layerSTService
                .getFiltersST(this.stdAreaManageFilter.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (lyrs) => (this.filtersSTManage = lyrs),
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicFilterST(corrId).subscribe(
                      (layers) => {
                        this.filtersSTManage = this.filtersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              } else if(tmpId.includes("pub_")) {
                corrId = tmpId.replace("pub_","");
                this.layerSTService
                .getFilterSTPubStdArea(this.stdAreaManageFilter.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (lyrs) => (this.filtersSTManage = lyrs),
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicFilterSTPubStdArea(corrId).subscribe(
                      (layers) => {
                        this.filtersSTManage = this.filtersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              }
            }
            if (this.selectedStudyAreaST) {
              this.layersService.getLayers(this.selectedStudyAreaST.id.toString().replace("pub_","").replace("priv_","")).subscribe(
                (lyrs) => (this.layerSettings = lyrs),
                (error) => {
                  this.logErrorHandler(error);
                }, () => {
                  this.layerSettings.forEach(
                    stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                  );
                }
              );
            }
            this.editLayers = false;
          }
        );
      }
    } else {
      if(!isUndefined(this.manageFilter.user_layer_id)) {
        this.layerSTService.updateFilterST(this.manageFilter).subscribe(
          () =>
            this.messageService.add({
              severity: 'info',
              summary: 'In process!',
              detail: 'Your filter is being updated!',
            }),
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Filter updated successfully!',
            });
            if (this.stdAreaManageFilter) {
              let tmpId = this.stdAreaManageFilter.id.toString();
              let corrId;
              if(tmpId.includes("priv_")) {
                corrId = tmpId.replace("priv_","");
                this.layerSTService
                .getFiltersST(this.stdAreaManageFilter.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (lyrs) => (this.filtersSTManage = lyrs),
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicFilterST(corrId).subscribe(
                      (layers) => {
                        this.filtersSTManage = this.filtersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              } else if(tmpId.includes("pub_")) {
                corrId = tmpId.replace("pub_","");
                this.layerSTService
                .getFilterSTPubStdArea(this.stdAreaManageFilter.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (lyrs) => (this.filtersSTManage = lyrs),
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicFilterSTPubStdArea(corrId).subscribe(
                      (layers) => {
                        this.filtersSTManage = this.filtersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              }
            }
            if (this.selectedStudyAreaST) {
              this.layersService
                .getFilters(this.selectedStudyAreaST.id)
                .subscribe(
                  (flts) => (this.filterList = flts),
                  (error) => {
                    this.logErrorHandler(error);
                  }
                );
            }
            this.manageFilter = null;
            this.editFilters = false;
          }
        );
      }
      else if(!isUndefined(this.manageFilter.public_layer_id)) {
        this.layerSTService.updatePublicFilterST(this.manageFilter).subscribe(
          () =>
            this.messageService.add({
              severity: 'info',
              summary: 'In process!',
              detail: 'Your filter is being updated!',
            }),
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Filter updated successfully!',
            });
            if (this.stdAreaManageFilter) {
              let tmpId = this.stdAreaManageFilter.id.toString();
              let corrId;
              if(tmpId.includes("priv_")) {
                corrId = tmpId.replace("priv_","");
                this.layerSTService
                .getFiltersST(this.stdAreaManageFilter.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (lyrs) => (this.filtersSTManage = lyrs),
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicFilterST(corrId).subscribe(
                      (layers) => {
                        this.filtersSTManage = this.filtersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              } else if(tmpId.includes("pub_")) {
                corrId = tmpId.replace("pub_","");
                this.layerSTService
                .getFilterSTPubStdArea(this.stdAreaManageFilter.id.toString().replace("pub_","").replace("priv_",""))
                .subscribe(
                  (lyrs) => (this.filtersSTManage = lyrs),
                  (error) => {
                    this.logErrorHandler(error);
                  },
                  () => {
                    this.layerSTService.getPublicFilterSTPubStdArea(corrId).subscribe(
                      (layers) => {
                        this.filtersSTManage = this.filtersSTManage.concat(layers);
                      },
                      (error) => {
                        this.logErrorHandler(error);
                      },
                    );
                  }
                );
              }
            }
            if (this.selectedStudyAreaST) {
              this.layersService
                .getFilters(this.selectedStudyAreaST.id)
                .subscribe(
                  (flts) => (this.filterList = flts),
                  (error) => {
                    this.logErrorHandler(error);
                  }
                );
            }
            this.manageFilter = null;
            this.editFilters = false;
          }
        );
      }
    }
  }

  // Creates a copy of the selected filter
  cloneFilter(l: LayerST): LayerST {
    let lyr = {};
    for (let prop in l) {
      lyr[prop] = l[prop];
    }
    return lyr as LayerST;
  }

  // Shows the confirmDeleteFilter message
  deleteFilter() {
    this.messageService.clear();
    this.messageService.add({
      key: 'confirmDeleteFilter',
      sticky: true,
      severity: 'warn',
      summary: 'Warning!',
      detail:
        'This operation is irreversible. Confirm to delete, or cancel to go back.',
    });
  }

  // Sends a request to delete the selected filter
  confirmDeleteFilter() {
    if(!isUndefined(this.manageFilter.user_layer_id)) {
      this.layerSTService.deleteFilterST(this.manageFilter).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your filter is being deleted!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.manageFilter = null;
          this.messageService.clear('confirmDeleteFilter');
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Filter deleted successfully!',
          });
          if (this.stdAreaManageSetting) {
            this.settingsService
              .getSettings(this.stdAreaManageSetting.id.toString().replace("pub_","").replace("priv_",""))
              .subscribe(
                (stngs) => (this.settingsSTManage = stngs),
                (error) => {
                  this.logErrorHandler(error);
                }, () => {
                  this.settingsSTManage.forEach(
                    stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                  );
                }
              );
          }
          if (this.stdAreaManageFilter) {
            let tmpId = this.stdAreaManageFilter.id.toString();
            let corrId;
            if(tmpId.includes("priv_")) {
              corrId = tmpId.replace("priv_","");
              this.layerSTService.getFiltersST(corrId).subscribe(
                (layers) => {
                  this.filtersSTManage = layers;
                },
                (error) => {
                  this.logErrorHandler(error);
                },
                () => {
                  this.layerSTService.getPublicFilterST(corrId).subscribe(
                    (layers) => {
                      this.filtersSTManage = this.filtersSTManage.concat(layers);
                    },
                    (error) => {
                      this.logErrorHandler(error);
                    },
                  );
                }
              );
            }
            else if(tmpId.includes("pub_")) {
              corrId = tmpId.replace("pub_","");
              this.layerSTService.getFilterSTPubStdArea(corrId).subscribe(
                (layers) => {
                  this.filtersSTManage = layers;
                },
                (error) => {
                  this.logErrorHandler(error);
                },
                () => {
                  this.layerSTService.getPublicFilterSTPubStdArea(corrId).subscribe(
                    (layers) => {
                      this.filtersSTManage = this.filtersSTManage.concat(layers);
                    },
                    (error) => {
                      this.logErrorHandler(error);
                    },
                  );
                }
              );
            }
          }
          if (this.selectedStudyAreaST) {
            this.layersService.getFilters(this.selectedStudyAreaST.id).subscribe(
              (fltr) => (this.filterList = fltr),
              (error) => {
                this.logErrorHandler(error);
              }
            );
          }
          this.editFilters = false;
        }
      );
    } else if(!isUndefined(this.manageFilter.public_layer_id)) {
      this.layerSTService.deletePublicFilterST(this.manageFilter).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your filter is being deleted!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.manageFilter = null;
          this.messageService.clear('confirmDeleteFilter');
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Filter deleted successfully!',
          });
          if (this.stdAreaManageSetting) {
            this.settingsService
              .getSettings(this.stdAreaManageSetting.id.toString().replace("pub_","").replace("priv_",""))
              .subscribe(
                (stngs) => (this.settingsSTManage = stngs),
                (error) => {
                  this.logErrorHandler(error);
                }, () => {
                  this.settingsSTManage.forEach(
                    stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                  );
                }
              );
          }
          if (this.stdAreaManageFilter) {
            let tmpId = this.stdAreaManageFilter.id.toString();
            let corrId;
            if(tmpId.includes("priv_")) {
              corrId = tmpId.replace("priv_","");
              this.layerSTService.getFiltersST(corrId).subscribe(
                (layers) => {
                  this.filtersSTManage = layers;
                },
                (error) => {
                  this.logErrorHandler(error);
                },
                () => {
                  this.layerSTService.getPublicFilterST(corrId).subscribe(
                    (layers) => {
                      this.filtersSTManage = this.filtersSTManage.concat(layers);
                    },
                    (error) => {
                      this.logErrorHandler(error);
                    },
                  );
                }
              );
            }
            else if(tmpId.includes("pub_")) {
              corrId = tmpId.replace("pub_","");
              this.layerSTService.getFilterSTPubStdArea(corrId).subscribe(
                (layers) => {
                  this.filtersSTManage = layers;
                },
                (error) => {
                  this.logErrorHandler(error);
                },
                () => {
                  this.layerSTService.getPublicFilterSTPubStdArea(corrId).subscribe(
                    (layers) => {
                      this.filtersSTManage = this.filtersSTManage.concat(layers);
                    },
                    (error) => {
                      this.logErrorHandler(error);
                    },
                  );
                }
              );
            }
          }
          if (this.selectedStudyAreaST) {
            this.layersService.getFilters(this.selectedStudyAreaST.id).subscribe(
              (fltr) => (this.filterList = fltr),
              (error) => {
                this.logErrorHandler(error);
              }
            );
          }
          this.editFilters = false;
        }
      );
    }
  }

  // Closes the confirmDeleteFilter message
  cancelDeleteFilter() {
    this.messageService.clear('confirmDeleteFilter');
  }

  // Shows the Normalization Method Details dialog and tags the selected normMethod as not new
  selectNormMethod(event) {
    this.isNewNormMethod = false;
    this.manageNormMethod = this.cloneNormMethod(event.data);
    this.editNormMethod = true;
  }

  // Shows the Normalization Method Details dialog and tags the selected normMethod as new
  addNormMethod() {
    this.isNewNormMethod = true;
    this.manageNormMethod = {} as NormalizationMethod;
    this.editNormMethod = true;
  }

  // Sends a request to save or update the selected normMethod according to its tag
  saveNormMethod() {
    if (this.isNewNormMethod) {
      this.methodService
        .createNormalizationMethod(this.manageNormMethod)
        .subscribe(
          () =>
            this.messageService.add({
              severity: 'info',
              summary: 'In process!',
              detail: 'Your method is being created!',
            }),
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Method created successfully!',
            });
            this.methodService.getNormalizationMethods().subscribe(
              (method) => {
                this.normMethodsSTManage = method;
                this.settingsType = method;
              },
              (error) => {
                this.logErrorHandler(error);
              }
            );
            this.manageNormMethod = null;
            this.editNormMethod = false;
          }
        );
    } else {
      this.methodService
        .updateNormalizationMethod(this.manageNormMethod)
        .subscribe(
          () =>
            this.messageService.add({
              severity: 'info',
              summary: 'In process!',
              detail: 'Your method is being updated!',
            }),
          (error) => {
            this.logErrorHandler(error);
          },
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: 'Method updated successfully!',
            });
            this.methodService.getNormalizationMethods().subscribe(
              (method) => {
                this.normMethodsSTManage = method;
                this.settingsType = method;
              },
              (error) => {
                this.logErrorHandler(error);
              }
            );
            this.manageNormMethod = null;
            this.editNormMethod = false;
          }
        );
    }
  }

  // Creates a copy of the selected normMethod
  cloneNormMethod(n: NormalizationMethod): NormalizationMethod {
    let nrm = {};
    for (let prop in n) {
      nrm[prop] = n[prop];
    }
    return nrm as NormalizationMethod;
  }

  // Shows the confirmDeleteNormMethod message
  deleteNormMethod() {
    this.messageService.clear();
    this.messageService.add({
      key: 'confirmDeleteNormMethod',
      sticky: true,
      severity: 'warn',
      summary: 'Warning!',
      detail:
        'This operation is irreversible. Confirm to delete, or cancel to go back.',
    });
  }

  // Sends a request to delete the selected normMethod
  confirmDeleteNormMethod() {
    this.methodService
      .deleteNormalizationMethod(this.manageNormMethod)
      .subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your method is being deleted!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.manageNormMethod = null;
          this.messageService.clear('confirmDeleteNormMethod');
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Method deleted successfully!',
          });
          this.methodService.getNormalizationMethods().subscribe(
            (method) => {
              this.normMethodsSTManage = method;
              this.settingsType = method;
            },
            (error) => {
              this.logErrorHandler(error);
            }
          );
          this.editNormMethod = false;
        }
      );
  }

  // Closes the confirmDeleteNormMethod message
  cancelDeleteNormMethod() {
    this.messageService.clear('confirmDeleteNormMethod');
  }

  // Shows the Operation Method Details dialog and tags the selected joinMethod as not new
  selectJoinMethod(event) {
    this.isNewJoinMethod = false;
    this.manageJoinMethod = this.cloneJoinMethod(event.data);
    this.editJoinMethod = true;
  }

  // Shows the Operation Method Details dialog and tags the selected joinMethod as new
  addJoinMethod() {
    this.isNewJoinMethod = true;
    this.manageJoinMethod = {} as NormalizationMethod;
    this.editJoinMethod = true;
  }

  // Sends a request to save or update the selected joinMethod according to its tag
  saveJoinMethod() {
    if (this.isNewJoinMethod) {
      this.methodService.createJoinMethod(this.manageJoinMethod).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your method is being created!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Method created successfully!',
          });
          this.manageJoinMethod = null;
          this.methodService.getJoinMethods().subscribe(
            (method) => {
              this.joinMethodsSTManage = method;
              this.joinType = method;
            },
            (error) => {
              this.logErrorHandler(error);
            }
          );
          this.editJoinMethod = false;
        }
      );
    } else {
      this.methodService.updateJoinMethod(this.manageJoinMethod).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your method is being updated!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Method updated successfully!',
          });
          this.methodService.getJoinMethods().subscribe(
            (method) => {
              this.joinMethodsSTManage = method;
              this.joinType = method;
            },
            (error) => {
              this.logErrorHandler(error);
            }
          );
          this.manageJoinMethod = null;
          this.editJoinMethod = false;
        }
      );
    }
  }

  // Creates a copy of the selected joinMethod
  cloneJoinMethod(n: NormalizationMethod): NormalizationMethod {
    let nrm = {};
    for (let prop in n) {
      nrm[prop] = n[prop];
    }
    return nrm as NormalizationMethod;
  }

  // Shows the confirmDeleteJoinMethod message
  deleteJoinMethod() {
    this.messageService.clear();
    this.messageService.add({
      key: 'confirmDeleteJoinMethod',
      sticky: true,
      severity: 'warn',
      summary: 'Warning!',
      detail:
        'This operation is irreversible. Confirm to delete, or cancel to go back.',
    });
  }

  // Sends a request to delete the selected joinMethod
  confirmDeleteJoinMethod() {
    this.methodService.deleteJoinMethod(this.manageJoinMethod).subscribe(
      () =>
        this.messageService.add({
          severity: 'info',
          summary: 'In process!',
          detail: 'Your method is being deleted!',
        }),
      (error) => {
        this.logErrorHandler(error);
      },
      () => {
        this.manageJoinMethod = null;
        this.messageService.clear('confirmDeleteJoinMethod');
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Method deleted successfully!',
        });
        this.methodService.getJoinMethods().subscribe(
          (method) => {
            this.joinMethodsSTManage = method;
            this.joinType = method;
          },
          (error) => {
            this.logErrorHandler(error);
          }
        );
        this.editJoinMethod = false;
      }
    );
  }

  // Closes the confirmDeleteJoinMethod message
  cancelDeleteJoinMethod() {
    this.messageService.clear('confirmDeleteJoinMethod');
  }

  // Shows the Settings Details dialog. According to its state in the database, it's tagged either as either default or not
  selectSettings(event) {
    this.isNewSetting = false;
    this.manageSetting = this.cloneSettings(event.data);
    if (this.manageSetting.id === 0) {
      this.isDefaultSetting = true;
    } else {
      this.isDefaultSetting = false;
    }
    this.editSettings = true;
  }

  // Sends a request to save settings according to its default status.
  saveSettings() {
    if (this.isNewSetting || this.isDefaultSetting) {
      this.manageSetting.smaller_better = this.manageSetting.smaller_better
        ? 1
        : 0;
      this.settingsService.postSettings(this.manageSetting).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your settings are being created!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Settings created successfully!',
          });
          this.settingsService
            .getSettings(this.stdAreaManageSetting.id)
            .subscribe(
              (stngs) => (this.settingsSTManage = stngs),
              (error) => {
                this.logErrorHandler(error);
              }, () => {
                this.settingsSTManage.forEach(
                  stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                );
              }
            );
          if (this.selectedStudyAreaST) {
            this.layersService.getLayers(this.selectedStudyAreaST.id).subscribe(
              (layers) => (this.layerSettings = layers),
              (error) => {
                this.logErrorHandler(error);
              }, () => {
                this.layerSettings.forEach(
                  stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                );
              }
            );
          }
          this.manageSetting = null;
          this.editSettings = false;
        }
      );
    } else {
      this.manageSetting.smaller_better = this.manageSetting.smaller_better
        ? 1
        : 0;
      this.settingsService.putSettings(this.manageSetting).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your settings are being updated!',
          }),
        (error) => {
          this.logErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Settings updated successfully!',
          });
          this.settingsService
            .getSettings(this.stdAreaManageSetting.id)
            .subscribe(
              (stngs) => (this.settingsSTManage = stngs),
              (error) => {
                this.logErrorHandler(error);
              }, () => {
                this.settingsSTManage.forEach(
                  stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                );
              }
            );
          if (this.selectedStudyAreaST) {
            this.layersService.getLayers(this.selectedStudyAreaST.id).subscribe(
              (layers) => (this.layerSettings = layers),
              (error) => {
                this.logErrorHandler(error);
              }, () => {
                this.layerSettings.forEach(
                  stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                );
              }
            );
          }
          this.manageSetting = null;
          this.editSettings = false;
        }
      );
    }
  }

  // Creates a copy of the selected settings
  cloneSettings(s: Settings): Settings {
    let stng = {};
    for (let prop in s) {
      stng[prop] = s[prop];
    }
    return stng as Settings;
  }

  // Shows the confirmDeleteSettings message
  deleteSettings() {
    this.messageService.clear();
    this.messageService.add({
      key: 'confirmDeleteSettings',
      sticky: true,
      severity: 'warn',
      summary: 'Warning!',
      detail:
        'This operation is irreversible. Confirm to delete, or cancel to go back.',
    });
  }

  // Sends a request to delete the selected settings
  confirmDeleteSettings() {
    this.settingsService.deleteSettings(this.manageSetting).subscribe(
      () =>
        this.messageService.add({
          severity: 'info',
          summary: 'In process!',
          detail: 'Your settings are being deleted!',
        }),
      (error) => {
        this.logErrorHandler(error);
      },
      () => {
        this.manageSetting = null;
        this.messageService.clear('confirmDeleteSettings');
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Settings deleted successfully!',
        });
        this.settingsService
          .getSettings(this.stdAreaManageSetting.id)
          .subscribe(
            (stngs) => (this.settingsSTManage = stngs),
            (error) => {
              this.logErrorHandler(error);
            }, () => {
              this.settingsSTManage.forEach(
                stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
              );
            }
          );
        if (this.selectedStudyAreaST) {
          this.layersService.getLayers(this.selectedStudyAreaST.id).subscribe(
            (layers) => (this.layerSettings = layers),
            (error) => {
              this.logErrorHandler(error);
            }, () => {
              this.layerSettings.forEach(
                stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
              );
            }
          );
        }
        this.editSettings = false;
      }
    );
  }

  // Closes the confirmDeleteSettings message
  cancelDeleteSettings() {
    this.messageService.clear('confirmDeleteSettings');
  }

  constructor(
    private nodeService: NodeService,
    private listService: ListService,
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
    private wfsUptService: WfsUptService,
    private shareLayerService: ShareLayersService,
    private roleService: RoleService
  ) {
    // Sets values for the UP Results graph.
    this.resultOptionsUP = {
      legend: {
        position: 'top',
        labels: {
          fontColor: '#ffffff',
        },
      },
      title: {
        display: true,
        text: 'Scenario Comparisons',
        fontColor: '#fff',
      },
      scale: {
        gridLines: {
          color: '#ffffff',
          lineWidth: 0.7,
        },
        angleLines: {
          display: true,
        },
        ticks: {
          beginAtZero: true,
          min: 0,
          max: 100,
          stepSize: 50,
          display: false,
        },
        pointLabels: {
          fontSize: 11,
          fontColor: '#ffffff',
        },
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
          title: function (tooltipItem, data) {
            return 'Values';
          },
        },
      },
    };
  }

  ngOnInit() {
    // Sets up the initial state of a number of variables used by the UPT
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
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' },
      { field: 'is_base', header: 'Is baseline?' },
    ];
    this.colsAssumption = [
      { field: 'name', header: 'Name' },
      { field: 'category', header: 'Category' },
      { field: 'value', header: 'Value' },
      { field: 'units', header: 'Units' },
      { field: 'description', header: 'Description' },
      { field: 'source', header: 'Source' },
    ];
    this.colsClassification = [
      { field: 'name', header: 'Name' },
      { field: 'category', header: 'Category' },
      { field: 'fclass', header: 'F-class' },
    ];
    this.colsModules = [
      { field: 'name', header: 'Name' },
      { field: 'label', header: 'Label' },
      { field: 'description', header: 'Description' },
    ];
    this.colsIndicators = [{ field: 'indicator', header: 'Indicator' }];
    this.colsIndResults = [
      { field: 'label', header: 'Label' },
      { field: 'units', header: 'units' },
      { field: 'language', header: 'Language' },
      { field: 'up_indicators_id', header: 'Indicator' },
    ];
    this.colsLayersSettings = [
      { field: 'label', header: 'Layer' },
      { field: 'normalization_method', header: 'Normalization Method' },
      { field: 'range_min', header: 'Lowest Value' },
      { field: 'range_max', header: 'Highest Value' },
      { field: 'weight', header: 'Weight' },
      { field: 'smaller_better', header: 'Smaller better?' },
    ];
    this.colsSetting = [
      { field: 'label', header: 'Layer' },
      { field: 'normalization_method', header: 'Normalization Method' },
      { field: 'range_min', header: 'Lowest Value' },
      { field: 'range_max', header: 'Highest Value' },
      { field: 'weight', header: 'Weight' },
      { field: 'smaller_better', header: 'Smaller better?' },
      { field: 'id', header: 'Is saved?' },
    ];
    this.colsLayer = [
      { field: 'st_layer_label', header: 'Layer Label' },
      { field: 'layer_field', header: 'Layer Value' },
      { field: 'layer_mmu_code', header: 'MMU ID' },
    ];
    this.colsFilter = [{ field: 'st_filter_label', header: 'Filter Label' }];
    this.colsNormMethod = [
      { field: 'label', header: 'Label' },
      { field: 'language', header: 'Language' },
      { field: 'value', header: 'Method' },
    ];
    this.colsJoinMethod = [
      { field: 'label', header: 'Label' },
      { field: 'language', header: 'Language' },
      { field: 'value', header: 'Method' },
    ];
    for (let i = 0; i <= 100; i++) {
      this.valuesST.push(i);
    }
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

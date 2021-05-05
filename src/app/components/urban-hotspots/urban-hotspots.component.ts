import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NodeService } from 'src/app/services/node/NodeService';
import { TreeNode, MessageService, SelectItem } from 'primeng/api';
import { ListService } from 'src/app/services/list/list.service';
import { Column } from 'src/app/domain/column';
import { Layer } from 'src/app/interfaces/layer';
import { Observable } from 'rxjs';
import { LayerService } from 'src/app/services/layer/layer.service';
import { DataCopy } from 'src/app/interfaces/data-copy';
import { DataCopyService } from 'src/app/services/data-copy/data-copy.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { Settings } from 'src/app/interfaces/settings';
import { MatchLayer } from 'src/app/interfaces/match-layer';
import { NormalizationMethod } from '../../interfaces/normalization-method';
import { StEvaluationService } from 'src/app/services/st-evaluation.service';
import chroma from 'chroma-js';
import { LayerST } from 'src/app/interfaces/layer-st';
import { LayerSTService } from 'src/app/services/layerST/layer-st.service';
import { MethodService } from 'src/app/services/method/method.service';
import { UpColumn } from 'src/app/interfaces/up-column';
import { StColumn } from 'src/app/interfaces/st-column';
import { Status } from 'src/app/interfaces/status';
import { Heatmap } from 'src/app/interfaces/heatmap';
import { HeatmapService } from 'src/app/services/heatmap.service';

declare var Oskari: any;
@Component({
  selector: 'app-urban-hotspots',
  templateUrl: './urban-hotspots.component.html',
  styleUrls: ['./urban-hotspots.component.scss'],
  providers: [MessageService],
})
export class UrbanHotspotsComponent implements OnInit {

  @Output() logErrorHandler: EventEmitter<string> = new EventEmitter();
  blockedDocument = false;
  @Output() clearEvaluation: EventEmitter<any> = new EventEmitter();
  @Output() showEvaluation: EventEmitter<any> = new EventEmitter();
  @Output() hideEvaluation: EventEmitter<any> = new EventEmitter();
  @Input() evalHtml: string;
  @Output() evalHtmlChange: EventEmitter<string> = new EventEmitter();
  @Input() isAdmin: boolean;

  // Cols for managing objects
  colsLayersSettings: any[];
  colsLayer: any[];
  colsFilter: any[];
  colsSetting: any[];
  colsManageSetting: any[];
  colsNormMethod: any[];
  colsJoinMethod: any[];

  columnDataGP: string[] = [];

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

  // Properties for range sliders
  filterRangeST: number[];

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
    '#5E4FA2',
    '#3288BD',
    '#66C2A5',
    '#ABDDA4',
    '#E6F598',
    '#FEE08B',
    '#FDAE61',
    '#F46D43',
    '#D53E4F',
    '#9E0142',
    '#630000',
  ];

  // Color scaling for the heatmap
  colors = chroma.scale(this.scaleColorsST);

  // Numbers used for the color scale dialog
  scaleNumbersST: any[] = ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];

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
   * Functions for ST
   */
  startUH() {
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

  // Reverses color scale
  reverseColorScaleST() {
    const rev = [...this.scaleColorsST].reverse();
    this.scaleColorsST = rev;
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
    this.layersService.getStudyAreas().subscribe(
      (studyArea) => {
        this.studyAreaST = studyArea;
        this.stdAreaLayer = studyArea;
        this.stdAreaFilter = studyArea;
      },
      (error) => {
        this.showErrorHandler(error);
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
        this.showErrorHandler(error);
      }
    );
    this.layersService.getJoinMethods().subscribe(
      (joinType) => {
        this.joinType = joinType;
        this.joinMethodsSTManage = joinType;
      },
      (error) => {
        this.showErrorHandler(error);
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
        this.showErrorHandler(error);
      }
    );
    this.methodService.getStaticJoinMethod().subscribe(
      (joins) => {
        joins.forEach((j) =>
          this.staticJoinST.push({ value: j.id, label: j.label })
        );
      },
      (error) => {
        this.showErrorHandler(error);
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
        this.showErrorHandler(error);
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
        this.showErrorHandler(error);
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
          this.showErrorHandler(error);
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
        this.showErrorHandler(error);
      }
    );
    this.listService.getSTColumnFilters().subscribe(
      (listDataST) => {
        this.listFiltersDataST = listDataST;
        this.loadDataLayerST();
      },
      (error) => {
        this.showErrorHandler(error);
      }
    );
  }

  // Sends a request to fill the dropdown elements for the Register Layers tab in the Advanced dialog for ST
  loadDataColumnST(event) {
    if (event.node.type.toLowerCase() !== 'directory') {
      this.listService.getSTColumnWithId(event.node.data).subscribe(
        (listManageDataST) => {
          this.colFieldsNameArrayST = [];
          this.layerSTId = null;
          listManageDataST.forEach((data) =>
            this.colFieldsNameArrayST.push({ name: data })
          );
          this.layerSTId = event.node.data;
          this.listManageDataST = this.colFieldsNameArrayST;
          this.columnsHeaderST = event.node.label;
        },
        (error) => {
          this.showErrorHandler(error);
        }
      );
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
      this.listService.getSTColumnFiltersWithId(event.node.data).subscribe(
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
          this.showErrorHandler(error);
        }
      );
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
          this.showErrorHandler(error);
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
      this.matchLayer = {
        layerId: this.layerSTId,
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
          this.showErrorHandler(error);
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
                  this.showErrorHandler(error);
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
    this.matchFilter = {
      filterId: this.filterSTId,
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
        this.showErrorHandler(error);
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
          this.layerSTService
            .getFiltersST(this.stdAreaManageFilter.id)
            .subscribe(
              (layers) => (this.filtersSTManage = layers),
              (error) => {
                this.showErrorHandler(error);
              }
            );
        }
        this.unblockDocument();
      }
    );
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
          this.showErrorHandler(error);
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
          this.showErrorHandler(error);
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
    if (this.selSetting.length === 0 || this.selSetting == null) {
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
            this.showErrorHandler(error);
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
    const stdAreaEval = this.stdAreaSTEvalDist.id;
    this.messageService.add({
      severity: 'info',
      summary: 'In Progress!',
      detail: 'Your operation is being processed.',
    });
    this.stEvaluationService.postStdArea(stdAreaEval).subscribe(
      () => {},
      (error) => {
        this.unblockDocument();
        this.showErrorHandler(error);
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
          this.clearDistancesConsole();
          this.showDistancesConsole();
          this.statusST.forEach((s) => {
            this.evalHtml +=
              '<div class="ui-md-4">' +
              s.event +
              '</div><div class="ui-md-2">' +
              s.layer_id +
              '</div><div class="ui-md-2">' +
              s.created_on +
              '</div><div class="ui-md-4">' +
              s.value +
              '</div>';
            this.evalHtmlChange.emit(this.evalHtml);
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
        this.showErrorHandler(error);
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
        layerId: 'ST_VECTOR_LAYER',
        layerInspireName: 'Inspire theme name',
        layerOrganizationName: 'Organization name',
        showLayer: true,
        opacity: 85,
        layerName: 'Index Values',
        layerDescription: 'Displays index values of Suitability evaluations.',
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
          [null, null, 'ST_VECTOR_LAYER']
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
        [null, null, 'ST_VECTOR_LAYER']
      );
    }
  }

  // Adjusts the results from the ST evaluation process to show values according to the subset by score slider
  filterGeoJSON(event) {
    if (this.geojsonObject != null && this.geojsonObject['features'] != null) {
      this.layerOptions = {
        layerId: 'ST_VECTOR_LAYER',
        layerInspireName: 'Inspire theme name',
        layerOrganizationName: 'Organization name',
        showLayer: true,
        opacity: 60,
        layerName: 'Index Values',
        layerDescription: 'Displays index values of Suitability evaluations.',
        layerPermissions: {
          publish: 'publication_permission_ok',
        },
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
        [null, null, 'ST_VECTOR_LAYER']
      );
      Oskari.getSandbox().postRequestByName(this.rn, [
        this.geojsonObject,
        this.layerOptions,
      ]);
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
        this.showErrorHandler(error);
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
      this.layerSTService.getLayerST(this.stdAreaManageLayer.id).subscribe(
        (layers) => (this.layersSTManage = layers),
        (error) => {
          this.showErrorHandler(error);
        }
      );
    }
  }

  // Sends a request to load the registered filters for the selected study area
  loadManageFilters() {
    if (this.stdAreaManageFilter) {
      this.layerSTService.getFiltersST(this.stdAreaManageFilter.id).subscribe(
        (filters) => (this.filtersSTManage = filters),
        (error) => {
          this.showErrorHandler(error);
        }
      );
    }
  }

  // Sends a request to load the registered settings for the selected study area
  loadManageSettings() {
    if (this.stdAreaManageSetting) {
      this.settingsService.getSettings(this.stdAreaManageSetting.id).subscribe(
        (settings) => (this.settingsSTManage = settings),
        (error) => {
          this.showErrorHandler(error);
        }, () => {
          this.settingsSTManage.forEach(
            stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
          );
        }
      );
    }
  }

  // Shows the Layer Details dialog and tags the selected layer as not new
  selectLayer(event) {
    this.isNewLayer = false;
    this.manageLayer = this.cloneLayer(event.data);
    this.listService.getSTColumnWithId(event.data.user_layer_id).subscribe(
      (columns) => {
        this.colFieldsNameArrayST = [];
        columns.forEach((data) =>
          this.colFieldsNameArrayST.push({ name: data })
        );
        this.selLayerColumns = this.colFieldsNameArrayST;
      },
      (error) => {
        this.showErrorHandler(error);
      }
    );
    this.editLayers = true;
  }

  // Sends a request to save the selected layer
  saveLayer() {
    if (this.isNewLayer) {
      this.layerSTService.createLayerST(this.manageLayer).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your layer is being created!',
          }),
        (error) => {
          this.showErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Layer created successfully!',
          });
          if (this.stdAreaManageSetting) {
            this.settingsService
              .getSettings(this.stdAreaManageSetting.id)
              .subscribe(
                (stngs) => (this.settingsSTManage = stngs),
                (error) => {
                  this.showErrorHandler(error);
                }, () => {
                  this.settingsSTManage.forEach(
                    stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                  );
                }
              );
          }
          if (this.stdAreaManageLayer) {
            this.layerSTService
              .getLayerST(this.stdAreaManageLayer.id)
              .subscribe(
                (lyrs) => (this.layersSTManage = lyrs),
                (error) => {
                  this.showErrorHandler(error);
                }
              );
          }
          if (this.selectedStudyAreaST) {
            this.layersService.getLayers(this.selectedStudyAreaST.id).subscribe(
              (lyrs) => (this.layerSettings = lyrs),
              (error) => {
                this.showErrorHandler(error);
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
    } else {
      this.layerSTService.updateLayerST(this.manageLayer).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your layer is being updated!',
          }),
        (error) => {
          this.showErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Layer updated successfully!',
          });
          if (this.stdAreaManageSetting) {
            this.settingsService
              .getSettings(this.stdAreaManageSetting.id)
              .subscribe(
                (stngs) => (this.settingsSTManage = stngs),
                (error) => {
                  this.showErrorHandler(error);
                }, () => {
                  this.settingsSTManage.forEach(
                    stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                  );
                }
              );
          }
          if (this.stdAreaManageLayer) {
            this.layerSTService
              .getLayerST(this.stdAreaManageLayer.id)
              .subscribe(
                (lyrs) => (this.layersSTManage = lyrs),
                (error) => {
                  this.showErrorHandler(error);
                }
              );
          }
          if (this.selectedStudyAreaST) {
            this.layersService.getLayers(this.selectedStudyAreaST.id).subscribe(
              (lyrs) => (this.layerSettings = lyrs),
              (error) => {
                this.showErrorHandler(error);
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
    this.layerSTService.deleteLayerST(this.manageLayer).subscribe(
      () =>
        this.messageService.add({
          severity: 'info',
          summary: 'In process!',
          detail: 'Your layer is being deleted!',
        }),
      (error) => {
        this.showErrorHandler(error);
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
            .getSettings(this.stdAreaManageSetting.id)
            .subscribe(
              (stngs) => (this.settingsSTManage = stngs),
              (error) => {
                this.showErrorHandler(error);
              }, () => {
                this.settingsSTManage.forEach(
                  stng => stng.normalization_method = stng.normalization_method === 1 ? 3 : stng.normalization_method
                );
              }
            );
        }
        this.layerSTService.getLayerST(this.stdAreaManageLayer.id).subscribe(
          (lyrs) => (this.layersSTManage = lyrs),
          (error) => {
            this.showErrorHandler(error);
          }
        );
        if (this.selectedStudyAreaST) {
          this.layersService.getLayers(this.selectedStudyAreaST.id).subscribe(
            (layers) => (this.layerSettings = layers),
            (error) => {
              this.showErrorHandler(error);
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
      this.layerSTService.createFilterST(this.manageFilter).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your filter is being created!',
          }),
        (error) => {
          this.showErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Filter created successfully!',
          });
          if (this.stdAreaManageFilter) {
            this.layerSTService
              .getFiltersST(this.stdAreaManageFilter.id)
              .subscribe(
                (fltr) => (this.filtersSTManage = fltr),
                (error) => {
                  this.showErrorHandler(error);
                }
              );
          }
          if (this.selectedStudyAreaST) {
            this.layersService
              .getFilters(this.selectedStudyAreaST.id)
              .subscribe(
                (flts) => (this.filterList = flts),
                (error) => {
                  this.showErrorHandler(error);
                }
              );
          }
          this.manageFilter = null;
          this.editFilters = false;
        }
      );
    } else {
      this.layerSTService.updateFilterST(this.manageFilter).subscribe(
        () =>
          this.messageService.add({
            severity: 'info',
            summary: 'In process!',
            detail: 'Your filter is being updated!',
          }),
        (error) => {
          this.showErrorHandler(error);
        },
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Filter updated successfully!',
          });
          if (this.stdAreaManageFilter) {
            this.layerSTService
              .getFiltersST(this.stdAreaManageFilter.id)
              .subscribe(
                (fltr) => (this.filtersSTManage = fltr),
                (error) => {
                  this.showErrorHandler(error);
                }
              );
          }
          if (this.selectedStudyAreaST) {
            this.layersService
              .getFilters(this.selectedStudyAreaST.id)
              .subscribe(
                (flts) => (this.filterList = flts),
                (error) => {
                  this.showErrorHandler(error);
                }
              );
          }
          this.manageFilter = null;
          this.editFilters = false;
        }
      );
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
    this.layerSTService.deleteFilterST(this.manageFilter).subscribe(
      () =>
        this.messageService.add({
          severity: 'info',
          summary: 'In process!',
          detail: 'Your filter is being deleted!',
        }),
      (error) => {
        this.showErrorHandler(error);
      },
      () => {
        this.manageFilter = null;
        this.messageService.clear('confirmDeleteFilter');
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Filter deleted successfully!',
        });
        this.layerSTService.getFiltersST(this.stdAreaManageFilter.id).subscribe(
          (fltr) => (this.filtersSTManage = fltr),
          (error) => {
            this.showErrorHandler(error);
          }
        );
        if (this.selectedStudyAreaST) {
          this.layersService.getFilters(this.selectedStudyAreaST.id).subscribe(
            (fltr) => (this.filterList = fltr),
            (error) => {
              this.showErrorHandler(error);
            }
          );
        }
        this.editFilters = false;
      }
    );
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
            this.showErrorHandler(error);
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
                this.showErrorHandler(error);
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
            this.showErrorHandler(error);
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
                this.showErrorHandler(error);
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
          this.showErrorHandler(error);
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
              this.showErrorHandler(error);
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
          this.showErrorHandler(error);
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
              this.showErrorHandler(error);
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
          this.showErrorHandler(error);
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
              this.showErrorHandler(error);
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
        this.showErrorHandler(error);
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
            this.showErrorHandler(error);
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
          this.showErrorHandler(error);
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
                this.showErrorHandler(error);
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
                this.showErrorHandler(error);
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
          this.showErrorHandler(error);
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
                this.showErrorHandler(error);
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
                this.showErrorHandler(error);
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
    for (const prop in s) {
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
        this.showErrorHandler(error);
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
              this.showErrorHandler(error);
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
              this.showErrorHandler(error);
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

  showErrorHandler(error) {
    this.logErrorHandler.emit(error);
  }

  // PrimeNG document blocking.
  blockDocument() {
    this.blockedDocument = true;
  }

  // PrimeNG document unblocking.
  unblockDocument() {
    this.blockedDocument = false;
  }

  clearDistancesConsole() {
    this.clearEvaluation.emit(null);
  }

  showDistancesConsole() {
    this.showEvaluation.emit(null);
  }

  hideDistancesConsole() {
    this.hideEvaluation.emit(null);
  }

  // Closes the confirmDeleteSettings message
  cancelDeleteSettings() {
    this.messageService.clear('confirmDeleteSettings');
  }

  constructor(private nodeService: NodeService,
              private listService: ListService,
              private layersService: LayerService,
              private dataCopyService: DataCopyService,
              private settingsService: SettingsService,
              private messageService: MessageService,
              private stEvaluationService: StEvaluationService,
              private layerSTService: LayerSTService,
              private methodService: MethodService,
              private heatmapService: HeatmapService,) { }

  ngOnInit() {
    this.layerSTId = null;
    this.accordionST = 0;
    this.layerSTLabel = '';
    this.layerSTField = null;
    this.selectedStudyAreaST = null;
    this.selectedFiltersST = [];
    this.filterRangeST = [0, 100];
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
  }

}

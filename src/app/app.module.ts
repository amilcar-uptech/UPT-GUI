import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { ToolsSidebarComponent } from './components/tools-sidebar/tools-sidebar.component';
import {ColorPickerModule} from 'primeng/colorpicker';
import {ChartModule} from 'primeng/chart';
import {ButtonModule} from 'primeng/button';
import {SidebarModule} from 'primeng/sidebar';
import {DialogModule} from 'primeng/dialog';
import {SliderModule} from 'primeng/slider';
import {TreeModule} from 'primeng/tree';
import {TreeDragDropService} from 'primeng/api';
import {OrderListModule} from 'primeng/orderlist';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {MultiSelectModule} from 'primeng/multiselect';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {SpinnerModule} from 'primeng/spinner';
import {AccordionModule} from 'primeng/accordion';
import {ToastModule} from 'primeng/toast';
import {FieldsetModule} from 'primeng/fieldset';
import {FileUploadModule} from 'primeng/fileupload';
import {MenubarModule} from 'primeng/menubar';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { NgxDonutChartModule } from 'ngx-doughnut-chart';
import {BlockUIModule} from 'primeng/blockui';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {TooltipModule} from 'primeng/tooltip';
import {KeyFilterModule} from 'primeng/keyfilter';
import {InputSwitchModule} from 'primeng/inputswitch';
import { MessageService } from './services/message/MessageService';
import { NodeService } from './services/node/NodeService';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ToggleButtonModule} from 'primeng/togglebutton';
import { HttpClient, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { ListService } from './services/list/list.service';
import { SquareKilometersPipe } from './custom-pipes/square-kilometers.pipe';
import { NormMethodPipe } from './custom-pipes/norm-method.pipe';
import { DependenciesPipe } from './custom-pipes/dependencies.pipe';
import { StaticMethodPipe } from './custom-pipes/static-method.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ToolsSidebarComponent,
    SquareKilometersPipe,
    NormMethodPipe,
    DependenciesPipe,
    StaticMethodPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    NgbModule,
    ColorPickerModule,
    ChartModule,
    ButtonModule,
    SidebarModule,
    DialogModule,
    SliderModule,
    MenubarModule,
    NgxDonutChartModule,
    TreeModule,
    OrderListModule,
    DropdownModule,
    TableModule,
    DynamicDialogModule,
    MultiSelectModule,
    CheckboxModule,
    InputTextModule,
    SpinnerModule,
    AccordionModule,
    ToastModule,
    FieldsetModule,
    UiSwitchModule,
    FileUploadModule,
    BlockUIModule,
    ProgressSpinnerModule,
    OverlayPanelModule,
    TooltipModule,
    KeyFilterModule,
    InputSwitchModule,
    InputTextareaModule,
    ToggleButtonModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-CSRF-TOKEN'
    })
  ],
  providers: [
    TreeDragDropService,
    MessageService,
    NodeService,
    ListService,
    HttpClient
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }

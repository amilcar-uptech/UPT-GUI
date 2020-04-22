import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import {MenuItem} from 'primeng/api';
import { RoleService } from './services/role.service';
import { ToolsSidebarComponent } from './components/tools-sidebar/tools-sidebar.component';

// declare var __session_active: boolean;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]
})

export class AppComponent implements OnInit {
  oskariUrl = '/Oskari/dist/1.1.1/geoportal';
  dispLay = false;
  title = 'UPT-GUI-app';
  urbPerActive: boolean;
  suitabilityActive: boolean;
  uptWindow: Window & {
    __session_active?: boolean
  };
  hasUPTRole = false;

  @ViewChild('tools',  {static: false}) tools: ToolsSidebarComponent;

  constructor(private messageService: MessageService,
              private roleService: RoleService) {
    this.urbPerActive = false;
    this.suitabilityActive = false;
    this.uptWindow = window;
  }

  upStatus() {
    if (this.tools.hasUPTRole) {
      this.urbPerActive = true;
      this.suitabilityActive = false;
      this.tools.upAct = true;
      this.tools.stAct = false;
      this.tools.showUP();
      this.tools.hideColorScaleST();
      this.tools.hideST();
      this.tools.hideDataST();
    } else {
      this.promptPermission();
    }
  }

  promptLogin() {
    this.messageService.add({ key: 'login', severity: 'error', summary: 'Error!', detail: 'Please login to use tools.'});
  }

  promptPermission() {
    this.messageService.add({ key: 'login', severity: 'error', summary: 'Error!', detail: 'You do not have permission to use the UTP'});
  }

  stStatus() {
    if (this.tools.hasUPTRole) {
      this.suitabilityActive = true;
      this.urbPerActive = false;
      this.tools.stAct = true;
      this.tools.upAct = false;
      this.tools.showST();
      this.tools.hideUP();
      this.tools.hideAssumptions();
    } else {
      this.promptPermission();
    }
  }

  closePlugin() {
    this.urbPerActive = false;
    this.suitabilityActive = false;
    this.tools.hideUP();
    this.tools.hideColorScaleST();
    this.tools.hideST();
    this.tools.hideAssumptions();
    this.tools.hideDataST();
  }

  ngOnInit() {
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToolsSidebarComponent } from './components/tools-sidebar/tools-sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]
})

export class AppComponent implements OnInit {
  // URL for the directory where most assets will be found
  oskariUrl = '/Oskari/dist/wbidp/geoportal';
  title = 'UPT-GUI-app';
  // Status of UPT
  urbPerActive: boolean;
  suitabilityActive: boolean;
  // Looks for the a login session.
  uptWindow: Window & {
    __session_active?: boolean
  };
  // Looks for a role that contains 'UPT'
  hasUPTRole = false;

  // Used to access variables and methods from tools-sidebar.component
  @ViewChild('tools',  {static: false}) tools: ToolsSidebarComponent;

  constructor(private messageService: MessageService) {
    this.urbPerActive = false;
    this.suitabilityActive = false;
    this.uptWindow = window;
  }

  // Activates UP and hides dialogs related to ST
  upStatus() {
    if (this.tools.hasUPTRole) {
      this.urbPerActive = true;
      this.suitabilityActive = false;
      this.tools.upAct = true;
      this.tools.stAct = false;
      this.tools.showUP();
      this.tools.urbanHotspots.hideColorScaleST();
      this.tools.urbanHotspots.hideST();
      this.tools.urbanHotspots.hideDataST();
    } else {
      this.promptPermission();
    }
  }

  // Sends a message to user if no login session is active
  promptLogin() {
    this.messageService.add({ key: 'login', severity: 'error', summary: 'Error!', detail: 'Please login to use tools.'});
  }

  // Sends a message to user if no UPT 
  promptPermission() {
    this.messageService.add({ key: 'login', severity: 'error', summary: 'Error!', detail: 'You do not have permission to use the UPT'});
  }

  // Activates ST and hides dialogs related to UP
  stStatus() {
    if (this.tools.hasUPTRole) {
      this.suitabilityActive = true;
      this.urbPerActive = false;
      this.tools.stAct = true;
      this.tools.upAct = false;
      this.tools.showST();
      this.tools.urbanPerformance.hideUP();
      this.tools.urbanPerformance.hideAdvancedUP();
    } else {
      this.promptPermission();
    }
  }

  // Closes either of the active UPT
  closePlugin() {
    this.urbPerActive = false;
    this.suitabilityActive = false;
    this.tools.urbanPerformance.hideUP();
    this.tools.urbanHotspots.hideColorScaleST();
    this.tools.urbanHotspots.hideST();
    this.tools.urbanPerformance.hideAdvancedUP();
    this.tools.urbanHotspots.hideDataST();
    this.tools.upAct = false;
    this.tools.stAct = false;
  }

  ngOnInit() {
  }
}

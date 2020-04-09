import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import {MenuItem} from 'primeng/api';

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
  constructor(private messageService: MessageService) {
    this.urbPerActive = false;
    this.suitabilityActive = false;
    this.uptWindow = window;
  }

  upStatus() {
    this.urbPerActive = true;
    this.suitabilityActive = false;
  }

  promptLogin() {
    this.messageService.add({ key: 'login', severity: 'error', summary: 'Error!', detail: 'Please login to use tools.'});
  }

  stStatus() {
    this.suitabilityActive = true;
    this.urbPerActive = false;
  }

  closePlugin() {
    this.urbPerActive = false;
    this.suitabilityActive = false;
  }

  ngOnInit() {
  }
}

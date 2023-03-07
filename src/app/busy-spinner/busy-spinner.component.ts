import { Component, OnInit } from '@angular/core';
import {CoordinatorService} from '../_services/coordinator.service';

@Component({
  selector: 'app-busy-spinner',
  templateUrl: './busy-spinner.component.html',
  styleUrls: ['./busy-spinner.component.scss']
})
export class BusySpinnerComponent implements OnInit {
  isBusy: boolean;

  constructor(private coordinatorService: CoordinatorService) { }

  ngOnInit(): void {
    this.coordinatorService.appBusyEmitter.subscribe((value: boolean) => {
      this.isBusy = value;
    });
  }

}

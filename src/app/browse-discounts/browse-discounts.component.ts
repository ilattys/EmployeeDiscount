import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDiscountDialogComponent } from '../add-discount-dialog/add-discount-dialog.component';
import { Router } from '@angular/router';
import { GenericNameModel } from '../_models/generic-name.model';
import { EmployeeDiscountEvent } from '../_models/employee-discount.model';
import { AuthService } from '../_services/auth.service';
import { CoordinatorService } from '../_services/coordinator.service';

@Component({
  selector: 'app-browse-discounts',
  templateUrl: './browse-discounts.component.html',
  styleUrls: ['./browse-discounts.component.scss']
})
export class BrowseDiscountsComponent implements OnInit {

  responseDiscountEvent: EmployeeDiscountEvent[];
  startDate: any;
  userMessage: string;

  constructor(public dialog: MatDialog, private coordinatorService: CoordinatorService,
              private authService: AuthService, private router: Router) {

    this.responseDiscountEvent = [];
    this.userMessage = '';
  }

  ngOnInit(): void {
    debugger
    this.getCurrentEvents();
  }

  openDialog(): void {
    this.dialog.open(AddDiscountDialogComponent);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  viewEvent(discountEvent): void {
    this.coordinatorService.discountEvent = discountEvent;
    this.router.navigateByUrl('addDiscount').then();
  }

  private getCurrentEvents(): void {
    this.coordinatorService.appBusyEmitter.emit(true);

    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    const startDate = this.coordinatorService.formatDate(date.toLocaleDateString(), 'T00:00:00.000Z');
    const request = this.coordinatorService.buildGetEventsRequest(undefined, undefined, startDate); // get all events within year

    console.log(JSON.stringify(request));
    this.coordinatorService.getEvents(request).subscribe(events => {
      if (events.length) {
        console.log(events);
        this.responseDiscountEvent = [];
        events.forEach(e => {
          e.description = this.trimDescription(e.description);
          this.responseDiscountEvent.push(e);
          },
          this.coordinatorService.appBusyEmitter.emit(false));
        }
      else {
        this.userMessage = 'No Employee Discount Events Found';
        this.coordinatorService.appBusyEmitter.emit(false);
        }
      },
      (error => {
        console.log(error);
        this.coordinatorService.appBusyEmitter.emit(false);
        this.userMessage = 'Timeout Error';
      }));
  }

  private trimDescription(description): any {
    const currentEntry = (description as string).split(' ');
    let desc = '';
    for (let i = 0; i < currentEntry.length - 1; i++){
      desc += currentEntry[i] + ' ';
    }
    return desc;
  }

  public navigateToCorporatePortalLanding() {
    this.authService.navigateToCorporatePortalLanding();
  }

  navigateToCorporatePortalLoginAndClearSession() {
    sessionStorage.clear();
    this.authService.navigateToCorporatePortalLogin();
  }

}

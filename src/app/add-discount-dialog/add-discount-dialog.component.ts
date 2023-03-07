import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DepartmentSettingsModel } from '../_models/department-settings.model';
import { AuthService } from '../_services/auth.service';
import { CoordinatorService } from '../_services/coordinator.service';
import {Definitions, EmployeeDiscountEvent} from '../_models/employee-discount.model';

@Component({
  selector: 'app-add-discount-dialog',
  templateUrl: './add-discount-dialog.component.html',
  styleUrls: ['./add-discount-dialog.component.scss']
})
export class AddDiscountDialogComponent implements OnInit {

  @ViewChild('csvReader') csvReader: any;
  public departmentSettings: any[] = [];
  public discountType: any;
  private discountEvent: EmployeeDiscountEvent;

  constructor(public dialog: MatDialog, private router: Router,
              private coordinatorService: CoordinatorService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.departmentSettings = [];
  }

  uploadListener($event: any): any {
    const files = $event.files;
    if (this.isValidCSVFile(files[0])) {
      const file = $event.files[0];
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        const csvData = fileReader.result;
        const discountEntryArray = (csvData as string).split(/\r\n|\n/);
        if (this.validateCSVHeaders(discountEntryArray[9]) && this.validateCSVDates(discountEntryArray[6])){
          this.discountEvent = this.buildDiscountEvent(discountEntryArray, 5);
          this.coordinatorService.saveDiscountEvent(this.discountEvent);
          this.dialog.closeAll();
          this.router.navigateByUrl('addDiscount').then();
        }
        else {
          this.coordinatorService.log('error', 'Invalid Excel Sheet Format');
          this.dialog.closeAll();
        }
      };
      fileReader.onerror = () => {
        this.coordinatorService.log('error', 'An Error Occurred While Reading File');
      };
    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }
  // revisit logic with new data model
  private buildDiscountEvent(discountEntryArray: any, headerLength: number): EmployeeDiscountEvent {
    const discountEvent = new EmployeeDiscountEvent();
    let departmentSettings : DepartmentSettingsModel[];
    let definitionSettings : Definitions[];
    const definition = new Definitions();
    discountEvent.definitions = [];
    departmentSettings = [];
    definitionSettings = [];
    for (let i = 10; i < discountEntryArray.length; i++) {
      const currentEntry = (discountEntryArray[i] as string).split(',');
      if (currentEntry.length > headerLength) {
        const departmentSetting = new DepartmentSettingsModel();
        departmentSetting.deptNo = Number(currentEntry[0].trim());
        departmentSetting.deptName = currentEntry[1].trim();
        departmentSetting.female = this.isValueTrue(currentEntry[2]);
        departmentSetting.male = this.isValueTrue(currentEntry[3]);
        departmentSetting.half = this.isValueTrue(currentEntry[4]);
        departmentSettings.push(departmentSetting);
      }
    }

    definition.definitionDepartments = departmentSettings;
    definition.description = 'Extra Employee Discount';
    definition.bookingDepartment = '972';
    definition.discount = .2;
    definitionSettings.push(definition);
    definitionSettings.push(null);              // keep up consistency of always having two definitions

    discountEvent.definitions = definitionSettings;
    discountEvent.discountType = this.getDiscountType(discountEntryArray[3]);
    discountEvent.description = discountEvent.discountType;
    discountEvent.startDate = this.getDiscountStartDate(discountEntryArray[6]);
    discountEvent.endDate = this.getDiscountEndDate(discountEntryArray[6]);
    discountEvent.status = 'pending-review';
    discountEvent.eventId = undefined;
    discountEvent.createUser = this.authService.getUserId();
    discountEvent.updateUser = this.authService.getUserId();

    return discountEvent;
  }

  getDiscountType(discountEntryArray: any): any {
    const currentEntry = (discountEntryArray as string).split(',');
    return currentEntry[0];
  }

  getDiscountStartDate(discountEntryArray: any): any {
    const currentEntry = (discountEntryArray as string).split(',');
    return this.coordinatorService.formatDate(currentEntry[0], 'T00:00:00.000Z');
  }
  getDiscountEndDate(discountEntryArray: any): any {
    const currentEntry = (discountEntryArray as string).split(',');
    return this.coordinatorService.formatDate(currentEntry[2], 'T23:59:59.000Z');
  }

  isValueTrue(currentEntry: string): boolean {
    if (currentEntry.length === 1 || currentEntry === 'x' || currentEntry === 'X') {
      return true;
    }
    else {
      return false;
    }
  }

  isValidCSVFile(file: any): any {
    return file.name.endsWith('.csv');
  }

  fileReset = () => {
    this.csvReader.nativeElement.value = '';
    this.departmentSettings = [];
  }

  private validateCSVHeaders(discountEntryArray): boolean {
    const currentEntry = (discountEntryArray as string).split(',');
    const validHeaders = ['Dept', 'DeptName', 'Female', 'Male', 'Half'];

    if (JSON.stringify(currentEntry) === JSON.stringify(validHeaders)){
      return true;
    }
    else {
      return false;
    }
  }

  private validateCSVDates(discountEntryArray): boolean {
    const currentEntry = (discountEntryArray as string).split(',');
    if (currentEntry[0] === 'undefined' || currentEntry[2] === 'undefined'){
      return false;
    }
    return true;
  }
}

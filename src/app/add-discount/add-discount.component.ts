import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDepartmentDialogComponent } from '../add-department-dialog/add-department-dialog.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { EmployeeDiscountEvent } from '../_models/employee-discount.model';
import { AuthService } from '../_services/auth.service';
import { DatePipe } from '@angular/common';
import { CoordinatorService } from '../_services/coordinator.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-add-discount',
  templateUrl: './add-discount.component.html',
  styleUrls: ['./add-discount.component.scss']
})
export class AddDiscountComponent implements OnInit, AfterViewInit {

  deptNo: any;
  deptName: any;
  male: any;
  female: any;
  halfDiscount: any;
  defId: any;
  discountEvent: EmployeeDiscountEvent;
  summaryCols: string[];

  extraDiscountDataSource: MatTableDataSource<any>;
  traditionalDiscountDataSource: MatTableDataSource<any>;

  @ViewChild('extraDiscountPaginator') extraDiscountPaginator: MatPaginator;
  @ViewChild('traditionalDiscountPaginator') traditionalDiscountPaginator: MatPaginator;

  constructor(private coordinatorService: CoordinatorService, public dialog: MatDialog,
              private router: Router, private authService: AuthService) {

    this.discountEvent = new EmployeeDiscountEvent();
  }

  ngOnInit(): void {
    if (this.coordinatorService.discountEvent) {
      this.getDiscountEvent();
      this.initCols();
    }
    else {
      this.router.navigateByUrl('browseDiscounts').then(() => {
        window.location.reload();
      });
    }
  }

  ngAfterViewInit() {
    this.extraDiscountDataSource.paginator = this.extraDiscountPaginator;

    if (!this.importFromExcel()) {
      this.traditionalDiscountDataSource.paginator = this.traditionalDiscountPaginator;
    }
  }

  getDiscountEvent(): void {
    this.discountEvent = this.coordinatorService.discountEvent;
    this.defId = this.discountEvent.definitions[0].defId;
    this.extraDiscountDataSource = new MatTableDataSource(this.discountEvent.definitions[0].definitionDepartments);
    if (!this.importFromExcel()){
      this.traditionalDiscountDataSource = new MatTableDataSource(this.discountEvent.definitions[1].definitionDepartments);
    }
  }

  getSelectedDiscountType(discountType: any): string {
    if (discountType === 'wardrobeDiscount'){
      return 'Wardrobe Discount';
    }
    else if (discountType === 'extraDiscount') {
      return 'Extra Employee Discount';
    }
    else {
      return discountType;
    }
  }

  initCols(): void {
    if (this.discountEvent.description.trim() === 'WARDROBE DISCOUNT'){
      this.summaryCols = ['deptNo', 'deptName', 'halfDiscount', 'female', 'male', 'trash'];
      return;
    }
    this.summaryCols = ['deptNo', 'deptName', 'halfDiscount', 'trash'];
  }

  editDepartmentHalfSetting(department: any, value: any): void {
    department.half = value.checked;
    this.discountEvent.definitions.find(x => x.defId === department.defId).definitionDepartments
      .find(x => x.deptNo === department.deptNo);
  }

  editDepartmentFemaleSetting(department: any, value: any): void {
    department.female = value.checked;
    this.discountEvent.definitions.find(x => x.defId === department.defId).definitionDepartments
      .find(x => x.deptNo === department.deptNo);
  }

  editDepartmentMaleSetting(department: any, value: any): void {
    department.male = value.checked;
    this.discountEvent.definitions.find(x => x.defId === department.defId).definitionDepartments
      .find(x => x.deptNo === department.deptNo);
  }

  deleteDepartmentSetting(department: any, rowid: any): void {
    this.discountEvent.definitions[0].definitionDepartments.splice(rowid, 1);
    this.discountEvent.definitions[0].definitionDepartments = this.discountEvent.definitions[0].definitionDepartments.filter((value, key) => {
      return value.deptNo != department.deptNo
    });
    this.extraDiscountDataSource = new MatTableDataSource(this.discountEvent.definitions[0].definitionDepartments);
    this.extraDiscountDataSource.paginator = this.extraDiscountPaginator;
  }

  openAddDepartmentDialog(): any {
    const dialogRef = this.dialog.open(AddDepartmentDialogComponent, {
      width: '650px',
      data: {
        deptNo: this.deptNo, deptName: this.deptName, male: this.male, female: this.female, half: this.halfDiscount
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.deptNo != undefined){
        this.addDepartment(result);
      }
    });
  }

  addDepartment(result: any): void {
    result.deptNo = Number(result.deptNo);
    result.defId = this.defId;
    const prevDeptIndex = this.findPreviousIndex(result);
    if (this.discountEvent.definitions[0]){
      if (this.discountEvent.definitions[0].definitionDepartments.find(x => x.deptNo === result.deptNo)){
        this.coordinatorService.log('error', 'Settings Exists for Department ' + result.deptNo);
        return;
      }
      else {
        this.discountEvent.definitions[0].definitionDepartments.splice(prevDeptIndex,0,result)
      }
    }
    else {
      this.discountEvent.definitions[0].definitionDepartments = [];
      this.discountEvent.definitions[0].definitionDepartments.splice(prevDeptIndex,0,result)
    }

    this.extraDiscountDataSource = new MatTableDataSource(this.discountEvent.definitions[0].definitionDepartments);
    this.extraDiscountDataSource.paginator = this.extraDiscountPaginator;
    this.coordinatorService.log('success', 'Department ' + result.deptNo + ' Settings Added');
  }

  findPreviousIndex(result): number{
    let index;
    for (const dept in this.discountEvent.definitions[0].definitionDepartments){
      const de = this.discountEvent.definitions[0].definitionDepartments[dept];
    if (de.deptNo > result.deptNo){
      index = this.discountEvent.definitions[0].definitionDepartments.findIndex(x => x.deptNo === de.deptNo);
        break;
      }
    }

    return index;
  }

  onStartDateChange(event: MatDatepickerInputEvent<any>): void {
    this.discountEvent.startDate = this.coordinatorService.formatDate(event.value.toLocaleDateString(), 'T05:00:00.000Z');  // ui hack
  }

  onEndDateChange(event: MatDatepickerInputEvent<any>): void {
    this.discountEvent.endDate = this.coordinatorService.formatDate(event.value.toLocaleDateString(), 'T23:59:59.000Z');
  }

  submitDiscountEvent(): void {
    if (!this.verifyEvent()){
      debugger
      return;
    }

    this.discountEvent.createUser = 'lattiia'; // this.authService.getUserId();
    this.discountEvent.updateUser = 'lattiia'; // this.authService.getUserId();
    this.discountEvent.definitions[0].defId = undefined;
    this.discountEvent.eventId = undefined;
    this.discountEvent.status = 'committed';
    this.discountEvent.discountType = this.coordinatorService.formatDiscountType(this.discountEvent.discountType);
    this.coordinatorService.saveDiscountEvent(this.discountEvent);
    this.router.navigateByUrl('browseDiscounts').then(() => {
      window.location.reload();
    });
  }

  verifyEvent(): boolean {
    if (!this.discountEvent.definitions[0].definitionDepartments){
      this.coordinatorService.log('error', 'Must Add Department Settings');
      return false;
    }
    if (this.discountEvent.startDate > this.discountEvent.endDate){
      this.coordinatorService.log('error', 'Start date must begin before End date');
      return false;
    }
    return true;
  }

  updateDiscountEvent(): void {
    const date = new Date();
    const pipe = new DatePipe('en-US');
    const currentDate = pipe.transform(date, 'yyyy-MM-dd');

    if (this.discountEvent.startDate < currentDate){
      debugger
      this.coordinatorService.log('error', 'Unable to update past event');
    }
    else if (!this.verifyEvent()){
      return;
    }
    else {
      this.discountEvent.updateUser = this.authService.getUserId();
      this.coordinatorService.saveDiscountEvent(this.discountEvent);
      this.router.navigateByUrl('browseDiscounts').then(() => {
        window.location.reload();
      });
    }

  }

  deleteDiscountEvent(): void {
    const request = this.coordinatorService.buildDeleteRequest(
      this.discountEvent.eventId, this.discountEvent.definitions[0].defId, this.discountEvent.definitions[1].defId);
    this.coordinatorService.deleteEvent(request);
    this.router.navigateByUrl('browseDiscounts').then(() => {
      window.location.reload();
    });
  }

  exportExcel(): void {
    if (this.discountEvent.definitions[0] === null || undefined){
      this.coordinatorService.log('error', 'Department Settings Are Empty');
      return;
    }
    const pipe = new DatePipe('en-US');
    this.discountEvent.startDate = pipe.transform(this.discountEvent.startDate, 'M/d/yyyy');
    this.discountEvent.endDate = pipe.transform(this.discountEvent.endDate, 'M/d/yyyy');
    this.coordinatorService.downloadFile(this.discountEvent);
    this.discountEvent.startDate = this.coordinatorService.formatDate(this.discountEvent.startDate, 'T00:00:00.000Z');
    this.discountEvent.endDate = this.coordinatorService.formatDate(this.discountEvent.endDate,'T23:59:59.000Z');
  }

  importFromExcel() {
    if (this.discountEvent.definitions[1] === null){
      return true;
    }
    return false;
  }

  public  navigateToBrowseDiscounts() {
    this.authService.navigateToBrowseDiscounts();
  }

  copyEventToProduction() {
    this.discountEvent.createUser = this.authService.getUserId();
    this.discountEvent.status = 'committed';
    this.discountEvent.eventId = undefined;
    this.discountEvent.discountType = this.coordinatorService.formatDiscountType(this.discountEvent.discountType);
    this.coordinatorService.copyEventToProd(this.discountEvent);
    this.router.navigateByUrl('browseDiscounts').then(() => {
      window.location.reload();
    });

  }

  true45Discount(value: any) {
    this.discountEvent.true45 = value.checked;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}

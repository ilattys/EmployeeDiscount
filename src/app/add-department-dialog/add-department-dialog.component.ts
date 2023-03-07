import { Component, Inject, OnInit, ViewChild} from '@angular/core';
import { DepartmentSettingsModel } from '../_models/department-settings.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoordinatorService } from '../_services/coordinator.service';

export interface DeptDialog {
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-add-department-dialog',
  templateUrl: './add-department-dialog.component.html',
  styleUrls: ['./add-department-dialog.component.scss']
})
export class AddDepartmentDialogComponent implements OnInit {
  @ViewChild('deptName') dept: any;

  public color = 'primary';
  wardrobeDiscount: boolean;

  deptHeader: DeptDialog[];

  constructor( public dialogRef: MatDialogRef<AddDepartmentDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public data: DepartmentSettingsModel,
               private coordinatorService: CoordinatorService) {}

  ngOnInit(): void {
    const discountType = this.coordinatorService.getDiscountType();
    if (discountType === 'wardrobeDiscount') {
      this.wardrobeDiscount = true;
      this.deptHeader = [
        {text: 'Number', cols: 1, rows: 1},
        {text: 'Half', cols: 1, rows: 1},
        {text: 'Female', cols: 1, rows: 1},
        {text: 'Male', cols: 1, rows: 1},
      ];
    }
    else {
      this.deptHeader = [
        {text: 'Number', cols: 1, rows: 1},
        {text: 'Half', cols: 1, rows: 1}
      ];
    }
  }

  closeDialog(): void {
    this.dialogRef.close(this.data);
  }

  getDepartment(): void {
    if (this.data.deptNo){
      const request = {
        deptNo: Number(this.data.deptNo)
      };
      this.coordinatorService.getDeptName(request).subscribe(deptName  => {
        if (deptName){
          this.data.deptName = deptName.valueOf().deptName;
          this.closeDialog();
        }
      },
        (error => {
          console.log(error);
          this.coordinatorService.log('error', 'Unable to Find Department Name');
        }));
    }
  }

  verifySettings(): void {
    if (this.data.deptNo === undefined || this.data.deptNo === ''){
      this.coordinatorService.log('error', 'Enter Department Number');
      return;
    }
    else {
      this.getDepartment();
    }
  }
}

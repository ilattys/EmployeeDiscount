import { DepartmentSettingsModel } from './department-settings.model';

export class EmployeeDiscountEvent {
  public eventId?: any;
  public description: any;
  public discountType: any;
  public startDate: any;
  public endDate: any;
  public globalEvent?: any;
  public status: any;
  public createUser?: any;
  public createDateTime?: any;
  public updateUser?: any;
  public updateDateTime?: any;
  public definitions: Definitions[];
  public true45: boolean;
}

export class Definitions {
  public defId?: any;
  public eventId?: any;
  public promotionNum: any;
  public discountType: any;
  public description: any;
  public discount: any;
  public discountTarget: any;
  public bookingDepartment: any;
  public EvaluationOrder: any;
  public definitionDepartments: DepartmentSettingsModel[];
}

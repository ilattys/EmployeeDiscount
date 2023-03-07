import { EventEmitter, Injectable } from '@angular/core';
import { MessageService as PrimeMessageService } from 'primeng/api';
import { EmployeeDiscountEvent } from '../_models/employee-discount.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CoordinatorService {

  constructor(private primeMessage: PrimeMessageService, private http: HttpClient, private authService: AuthService ) {
    this.appBusyEmitter = new EventEmitter<boolean>();
  }

  messages: string[] = [];
  public discountEvent: EmployeeDiscountEvent;
  public appBusyEmitter: EventEmitter<boolean>;

  saveDiscountEvent(discountEvent): void {
    debugger
    this.discountEvent = new EmployeeDiscountEvent();
    this.discountEvent = discountEvent;
    // create new event
    if (this.discountEvent.eventId === undefined && this.discountEvent.status === 'committed'){
      const url = this.buildUrl('NewEmployeeDiscountEvent');
      const request = this.buildNewEventRequest(discountEvent);
      this.commitDiscountEvent(url, request);
    }
    // update current event
    else if (this.discountEvent.eventId && this.discountEvent.definitions[0].defId) {
      const url = this.buildUrl('UpdateEmployeeDiscountEvent');
      const request = this.buildNewEventRequest(discountEvent);
      this.updateDiscountEvent(url, request);
    }
  }

  // api calls
  commitDiscountEvent(url: string, request: EmployeeDiscountEvent): void {
    this.http.post<any>(url, request).subscribe(
      (response) => {
        this.log('success', 'Event Saved');
        console.log(response);
      },
      (error => {
        console.log(error);
      })
    );
  }
  getEvents(request): Observable<EmployeeDiscountEvent[]> {
    const url = this.buildUrl('GetEmployeeDiscountEventSummaries');
    return this.http.post<EmployeeDiscountEvent[]>(url, request);
  }
  updateDiscountEvent(updateUrl: string, discountEvent): void {
    this.http.post<any>(updateUrl, discountEvent).subscribe(
      (response) => {
        this.log('success', 'Event Updated');
        console.log(response);
      },
      (error => {
        console.log(error);
      })
    );
  }
  deleteEvent(request): void {
    const url = this.buildUrl('DeleteEmployeeDiscountEvent');
    this.http.delete<any>(url, request).subscribe(
      (response) => {
        this.log('success', 'Event Deleted');
        console.log(response);
      },
      (error => {
        console.log(error);
      })
    );
  }
  copyEventToProd(discountEvent: EmployeeDiscountEvent) {
    this.discountEvent = new EmployeeDiscountEvent();
    this.discountEvent = discountEvent;
    const url = this.buildUrl('CopyEmployeeDiscountEventToProd');
    const request = this.buildNewEventRequest(discountEvent);

    this.http.post<any>(url, request).subscribe(
      (response) => {
        console.log(response);
    this.log('success', 'Event Copied To Prod Table');
      },
      (error => {
        console.log(error);
        this.log('error', 'Failed To Copy Event To Prod Table');
      })
    );
  }
  getDeptName(request): any {
    const url = this.buildUrl('GetDepartment');
    return this.http.post(url, request);
  }
  getDiscountType(): string {
    return this.discountEvent.discountType;
  }

  // csv
  downloadFile(discountEvent, filename= 'EmployeeDiscountEvent'): void {
    const csvData = this.ConvertToCSV(discountEvent, ['deptNo', 'deptName', 'female', 'male', 'half']);
    const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    const dwldLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
  ConvertToCSV(discountEvent, headerList): any {
    let str = '';
    // discount settings
    str += 'Employee Discount Definition Form' + '\r\n' + '\r\n';
    str += 'Discount Type' + '\r\n';
    str += this.formatDiscountTypeForCSV(discountEvent.discountType) + '\r\n' + '\r\n';
    str += 'Start Date,,End Date' + '\r\n';
    str += discountEvent.startDate + ',,' + discountEvent.endDate + '\r\n' + '\r\n';
    str += 'Department Settings' + '\r\n';
    str += 'Dept,DeptName,Female,Male,Half' + '\r\n';

    // department settings
    for (let i = 0; i < discountEvent.definitions[0].definitionDepartments.length; i++) {
      if (i == 99){
        debugger
      }
      let line = '';
      for (const index in headerList) {
        const head = headerList[index];
        if (head === 'deptNo' || head === 'deptName'){
          line += discountEvent.definitions[0].definitionDepartments[i][head] + ',';
        }
        else { // convert true/false values to 'x'
          line += this.formatDefinitionValues(discountEvent.definitions[0].definitionDepartments[i][head]) + ',';
        }
      }
      str += line + '\r\n';
    }
    return str;
  }

  // formatting
  private formatDefinitionValues(definitionDepartmentElement): any {
    if (definitionDepartmentElement === true){
      return 'X';
    }
    else{
      return '';
    }
  }
  formatDiscountType(discountType): string{
    if (discountType === 'Wardrobe Discount'){
      return 'wardrobeDiscount';
    }
    else if (discountType === 'Extra Employee Discount'){
      return 'extraDiscount';
    }
    else {
      return discountType;
    }
  }
  private formatDiscountTypeForCSV(discountType: any) {
    if (discountType === 'wardrobeDiscount'){
      return 'Wardrobe Discount';
    }
    else if (discountType === 'extraDiscount'){
      return 'Extra Employee Discount';
    }
    else {
      return discountType;
    }
  }
  formatDate(date: string, time: string): string {
    const currentEntry = (date as string).split('/');
    let month = '';
    let day = '';
    if (currentEntry[0].length === 1){
      month = '0' + currentEntry[0];
    }
    else {
      month = currentEntry[0];
    }
    if (currentEntry[1].length === 1){
      day = '0' + currentEntry[1];
    }
    else {
      day = currentEntry[1];
    }
    const year = currentEntry[2];
    const returnDate = year + '-' + month + '-' + day + time;
    return returnDate;
  }

  // builds
  private buildUrl(controller): string {
    return `http://localhost:61018//api/EmployeeDiscount/` + controller;
    //return 'https://' + this.authService.getEnvironment() + '/CorpCommon/api/EmployeeDiscount/' + controller;
  }
  private buildNewEventRequest(discountEvent): any {
    const request = {
      discountType: discountEvent.discountType,
      startDate: discountEvent.startDate,
      endDate: discountEvent.endDate,
      status: discountEvent.status,
      createUser: discountEvent.createUser,
      updateUser: discountEvent.updateUser,
      eventId: discountEvent.eventId,
      defId: discountEvent.definitions[0].defId,
      definitionDepartments: discountEvent.definitions[0].definitionDepartments,
      true45: discountEvent.true45
    };
    return request;
  }
  buildGetEventsRequest(discountType: any, status: any, startDate: any): EmployeeDiscountEvent {
    const pipe = new DatePipe('en-US');
    const request = new EmployeeDiscountEvent();
    request.discountType = discountType;
    request.status = status;
    request.startDate = pipe.transform(startDate, 'yyyy-MM-dd H:mm:ss');
    return request;
  }
  buildDeleteRequest(eventId, extraDefId, standardDefId): any {
    const request = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        eventId,
        extraDefId,
        standardDefId
      },
    };
    return request;
  }

  // message service
  log(severity: string, details: string): void {
    this.addMessage(severity, 'Employee Discount', details);
  }
  addMessage(severity: string, summary: string, detail: string): void {
    this.messages.push(`(${severity}) ${summary}: ${detail}`);
    this.primeMessage.add({severity, summary, detail});
  }
  clearMessage(): void {
    this.messages = [];
    this.primeMessage.clear();
  }

}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { TableModule} from 'primeng/table';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowseDiscountsComponent } from './browse-discounts/browse-discounts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import { AddDiscountComponent } from './add-discount/add-discount.component';
import { AddDiscountDialogComponent } from './add-discount-dialog/add-discount-dialog.component';
import { AddDepartmentDialogComponent } from './add-department-dialog/add-department-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { DropdownModule } from 'primeng/dropdown';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule} from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CheckboxModule} from 'primeng/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MessageComponent } from './message/message.component';
import { ToastModule } from 'primeng/toast';
import { MessageService as PrimeMessageService } from 'primeng/api';
import { BusySpinnerComponent } from './busy-spinner/busy-spinner.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';


@NgModule({
  declarations: [
    AppComponent,
    BrowseDiscountsComponent,
    AddDiscountComponent,
    AddDiscountDialogComponent,
    AddDepartmentDialogComponent,
    MessageComponent,
    BusySpinnerComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatIconModule,
        MatDialogModule,
        TableModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        DropdownModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRippleModule,
        MatCardModule,
        HttpClientModule,
        MatButtonModule,
        MatTooltipModule,
        CheckboxModule,
        MatGridListModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        ToastModule,
        NgbModule,
        MatTableModule,
        MatExpansionModule,
        MatPaginatorModule,
        MatMenuModule
    ],
  providers: [PrimeMessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }

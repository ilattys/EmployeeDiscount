import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowseDiscountsComponent } from './browse-discounts/browse-discounts.component';
import { AddDiscountDialogComponent } from './add-discount-dialog/add-discount-dialog.component';
import { AddDiscountComponent } from './add-discount/add-discount.component';
import {AuthService} from './_services/auth.service';

const routes: Routes = [
  { path: '', component: BrowseDiscountsComponent, canActivate: [AuthService] },
  { path: 'browseDiscounts', component: BrowseDiscountsComponent },
  { path: 'addDiscountDialog', component: AddDiscountDialogComponent },
  { path: 'addDiscount', component: AddDiscountComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

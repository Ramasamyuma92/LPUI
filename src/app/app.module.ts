import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import { HttpClientModule } from '@angular/common/http'; 
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';

import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';

/* Login Page */

import {IndexComponent} from './index/index.component';
import {ChangePasswordComponent} from './index/change-password.component';
import {ResetPasswordComponent} from './index/reset-password.component';
import {ForgotPasswordComponent} from './index/forgot-password.component';


import {SelectgiftsComponent} from './selectgifts/selectgifts.component';
import { PlaceOrderComponent } from './place-order/place-order.component';
import {VieworderComponent} from './vieworder/vieworder.component';
import {VieworderdetailComponent} from './vieworderdetail/vieworderdetail.component';

import {SelectorgComponent} from './selectorg/selectorg.component';

//Pagination
import {NgxPaginationModule} from 'ngx-pagination';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import {VieworderService} from './service/vieworder.service';
import {ProductlistService} from './service/productlist.service';
import {ClientService} from './service/client.service';
import {PlaceorderService} from './service/placeorder.service';
import {LoginService} from './service/login.service';
import {HeaderService} from './service/header.service';

import {MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatPaginatorModule, MatMenuModule, MatListModule, MatInputModule, MatIconModule, MatExpansionModule, MatDividerModule, MatDialogModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatTooltipModule, MatToolbarModule, MatTabsModule, MatTableModule, MatStepperModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule} from '@angular/material';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatGridListModule} from '@angular/material/grid-list';
import 'hammerjs';
import { AgGridModule } from 'ag-grid-angular';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { FilterPipe } from './filter/filter.pipe';
import { DateFilterPipe } from './filter/dateFilter.pipe';
import { SearchFilterPipe } from './filter/searchFilter.pipe';
import { ProductFilterPipe } from './filter/productFilter.pipe';
import { SearchOrgFilter } from './filter/searchOrganisationFilter.pipe';
import { OrderrByPipe } from './filter/sort.pipe';

import { OrgIndexComponent } from './organisation/org-index/org-index.component';
import { OrgCreateComponent } from './organisation/org-create/org-create.component';
import { OrgEditComponent } from './organisation/org-edit/org-edit.component';
import {OrganisationService} from './service/organisation.service';

import { RecIndexComponent } from './recipient/rec-index/rec-index.component';
import { RecCreateComponent } from './recipient/rec-create/rec-create.component';
import { RecEditComponent } from './recipient/rec-edit/rec-edit.component';
import {RecipientService} from './service/recipient.service';

import { ProductIndexComponent } from './products/product-list/product-index.component';
import { ProductCreateComponent } from './products/product-create/product-create.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';

import {DatePipe} from '@angular/common';

import { CsvImportComponent } from './csv-import/csv-import.component';
import { CsvImportService } from './service/csv-import.service';

import { OrderPaymentComponent } from './order-payment/order-payment.component';

import { UserIdleModule } from 'angular-user-idle';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SelectgiftsComponent,
    FooterComponent,
    IndexComponent,
    PlaceOrderComponent,
    VieworderComponent,
    VieworderdetailComponent,
    SelectorgComponent,
    FilterPipe,
    SearchFilterPipe,
    ProductFilterPipe,
    SearchOrgFilter,
    DateFilterPipe,
    OrderrByPipe,
	OrgIndexComponent,
    OrgCreateComponent,
    OrgEditComponent,
    ProductIndexComponent,
    ProductCreateComponent,
    ProductEditComponent,
    RecIndexComponent,
    RecCreateComponent,
    RecEditComponent,
	CsvImportComponent,
	ChangePasswordComponent,
	ResetPasswordComponent,
	ForgotPasswordComponent,
  OrderPaymentComponent
  ],
  imports: [
    BrowserModule,
    UserIdleModule.forRoot({idle: 3600, timeout: 1, ping: 1}),
    AgGridModule.withComponents([]),
    BsDatepickerModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxPaginationModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule, 
    MatAutocompleteModule,
    Ng4LoadingSpinnerModule.forRoot(),
MatButtonModule,
MatButtonToggleModule,
MatCardModule,
MatCheckboxModule,
MatChipsModule,
MatDatepickerModule,
MatDialogModule,
MatDividerModule,
MatExpansionModule,
MatGridListModule,
MatIconModule,
MatInputModule,
MatListModule,
MatMenuModule,
MatNativeDateModule,
MatPaginatorModule,
MatProgressBarModule,
MatProgressSpinnerModule,
MatRadioModule,
MatRippleModule,
MatSelectModule,
MatSidenavModule,
MatSliderModule,
MatSlideToggleModule,
MatSnackBarModule,
MatSortModule,
MatStepperModule,
MatTableModule,
MatTabsModule,
MatToolbarModule,
MatTooltipModule,
MatMomentDateModule,    


    RouterModule.forRoot([
      {path: '', redirectTo: 'index', pathMatch: 'full'},
      {path: 'selectgifts', component: SelectgiftsComponent},
      {path: 'index', component: IndexComponent},
      {path: 'placeorder', component: PlaceOrderComponent},
      {path: 'order-payment', component: OrderPaymentComponent},
      {path: 'view', component: VieworderComponent},
      {path: 'vieworderdetail/:clientId/:orderID', component: VieworderdetailComponent},
      {path: 'vieworderdetail', component: VieworderdetailComponent},
      {path: 'selectorg', component: SelectorgComponent},
	  {path: 'organization', component: OrgIndexComponent},
      {path: 'organization/create', component: OrgCreateComponent},
      {path: 'organization/edit/:id', component: OrgEditComponent},
      {path: 'product', component: ProductIndexComponent},
      {path: 'product/create', component: ProductCreateComponent},
      {path: 'product/edit/:id', component: ProductEditComponent},
      {path: 'recipientlist/:id', component: RecIndexComponent},
      {path: 'recipient/create/:id', component: RecCreateComponent},
      {path: 'recipient/edit/:id', component: RecEditComponent},
      {path: 'placeorder/:clientId/:orderID', component: PlaceOrderComponent},
	  {path: 'csvimport', component: CsvImportComponent},
	  {path: 'change-password', component: ChangePasswordComponent},
	  {path: 'reset-password', component: ResetPasswordComponent},
	  {path: 'forgot-password', component: ForgotPasswordComponent}
    ])
  ],
  exports: [
    RouterModule,
  ],
  providers: [VieworderService,ProductlistService,ClientService,PlaceorderService,LoginService,HeaderService,OrganisationService,RecipientService,DatePipe, CsvImportService],
  bootstrap: [AppComponent]
})
export class AppModule {}

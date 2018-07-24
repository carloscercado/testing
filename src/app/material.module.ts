import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatCardModule,
  MatSidenavModule,
  MatMenuModule,
  MatIconModule,
  MatGridListModule,
  MatSelectModule,
  MatDividerModule,
  MatListModule,
  MatTooltipModule,
  MatDialogModule,
  MatChipsModule,
  MatRadioModule,
  MatAutocompleteModule,
  MatExpansionModule,
  MatSlideToggleModule,
  MatSliderModule
} from '@angular/material';

const modules = [
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatCardModule,
  MatSidenavModule,
  MatMenuModule,
  MatIconModule,
  MatGridListModule,
  MatSelectModule,
  MatDividerModule,
  MatListModule,
  MatTooltipModule,
  MatDialogModule,
  MatChipsModule,
  MatRadioModule,
  MatAutocompleteModule,
  MatExpansionModule,
  MatSlideToggleModule,
  MatSliderModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule {}

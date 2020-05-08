import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { SectionsModule } from '../sections/sections.module';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    RouterModule,
    SectionsModule,
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent],
  providers: [],
})
export class HomeModule {}

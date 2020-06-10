import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from '../components/components.module';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [CommonModule, BrowserModule, FormsModule, RouterModule, ComponentsModule, ReactiveFormsModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
  providers: []
})
export class HomeModule {}

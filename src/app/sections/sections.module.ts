import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from '../app.routing';
import { LandComponent } from '../land/land.component';
import { LandService } from '../land/land.service';
import { LandSectionComponent } from './land-section/land-section.component';
import { SectionsComponent } from './sections.component';

@NgModule({
  declarations: [SectionsComponent, LandSectionComponent, LandComponent],
  imports: [CommonModule, AppRoutingModule],
  exports: [SectionsComponent, LandComponent],
  providers: [LandService],
})
export class SectionsModule {}

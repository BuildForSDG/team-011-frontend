import { Component, OnInit } from '@angular/core';

import { LandDto } from './land.dto';
import { LandService } from './land.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-land',
  templateUrl: './land.component.html',
  styleUrls: ['./land.component.css'],
})
export class LandComponent implements OnInit {
  land: LandDto;
  constructor(
    private readonly landService: LandService,
    private readonly route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    await this.getLand(id);
  }

  async getLand(id: string) {
    this.land = await this.landService.getLand(id);
  }
}

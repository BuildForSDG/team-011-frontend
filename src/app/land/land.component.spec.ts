import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";

import { LandComponent } from "./land.component";
import { LandService } from "./land.service";

describe("LandComponent", () => {
  let component: LandComponent;
  let fixture: ComponentFixture<LandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LandComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, FormsModule, NgxPaginationModule],
      providers: [LandService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

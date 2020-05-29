import Notiflix from 'notiflix-angular';
import { Component, OnInit } from '@angular/core';
import { LandService } from './land.service';
import { LandDto, CreateLandDto } from './land.dto';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import * as $ from 'jquery';
import { NotifyService } from '../shared/services/notify.service';
@Component({
  selector: 'app-land',
  templateUrl: './land.component.html',
  styleUrls: ['./land.component.css']
})
export class LandComponent implements OnInit {
  lands: LandDto[];
  createLandForm: FormGroup;
  constructor(private landService: LandService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.landService.getLands(0, 10).subscribe(lands => {
      this.lands = lands;
    });
    this.initForm();
  }

  onClickCreate() {
    console.log(this.getFormValidationErrors());
    if (this.createLandForm.invalid) return;
    Notiflix.Loading.Pulse();
    const input: CreateLandDto = this.createLandForm.value;
    this.landService.createLand(input).subscribe((res: LandDto) => {
      $('#landModalCloseBtn').click();
      this.lands.push(res);
      Notiflix.Loading.Remove();
      NotifyService.notify({
        from: 'top',
        align: 'right',
        message: 'Land created successfully',
        notifyType: 'success',
        icon: 'check',
        delay: 3
      });
    });
  }
  getFormValidationErrors() {
    Object.keys(this.createLandForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.createLandForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }
  onClickFileUpload() {
    $('#file').click();
  }
  initForm() {
    this.createLandForm = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(32)]],
      description: [null, Validators.maxLength(32)],
      acres: [null, [Validators.required, Validators.min(1)]],
      shortLocation: [null, [Validators.required, Validators.maxLength(64)]],
      fullLocation: [null, [Validators.required, Validators.maxLength(64)]],
      price: [null, [Validators.required, Validators.min(1)]],
      auctionType: [null, Validators.required],
      installmentType: [null, Validators.required],
      currency: [null, Validators.required],
      photo: [null]
    });
  }
}

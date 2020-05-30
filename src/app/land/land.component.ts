import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import Notiflix from 'notiflix-angular';

import { NotifyService } from '../shared/services/notify.service';
import { CreateLandDto, LandDto } from './land.dto';
import { LandService } from './land.service';

@Component({
  selector: 'app-land',
  templateUrl: './land.component.html',
  styleUrls: ['./land.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LandComponent,
      multi: true
    }
  ]
})
export class LandComponent implements OnInit {
  lands: LandDto[];
  createLandForm: FormGroup;
  updateLandForm: FormGroup;
  private file: File | null = null;
  fileName: string;
  constructor(private landService: LandService, private fb: FormBuilder, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.landService.getLands(0, 10).subscribe(lands => {
      this.lands = lands;
    });
    this.initForm();
  }

  onFileSelect(event: FileList) {
    const file = event && event.item(0);
    this.file = file;
    this.fileName = file.name;
  }
  onClickCreate() {
    // console.log(this.getFormValidationErrors(this.createLandForm));
    if (this.createLandForm.invalid) return;
    Notiflix.Loading.Pulse();
    const input: CreateLandDto = this.createLandForm.value;
    input.photo = this.file;
    const fd = this.toFormData(input);
    this.landService.createLand(fd).subscribe((res: LandDto) => {
      this.lands.push(res);
      this.modalService.dismissAll();
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
  onClickUpdate() {
    // console.log(this.getFormValidationErrors(this.updateLandForm));
    if (this.updateLandForm.invalid) return;
    Notiflix.Loading.Pulse();
    const input: LandDto = this.updateLandForm.value;
    input.photo = this.file;
    if (!input.photo) delete input.photo;
    const fd = this.toFormData(input);

    this.landService.updateLand(input.id, fd).subscribe((res: any) => {
      const index = this.lands.findIndex(v => v.id === res.id);
      this.lands.splice(index, 1, res.land);
      this.modalService.dismissAll();
      Notiflix.Loading.Remove();
      NotifyService.notify({
        from: 'top',
        align: 'right',
        message: 'Land updated successfully',
        notifyType: 'success',
        icon: 'check',
        delay: 3
      });
    });
  }
  onClickAddBtn(createLandModal: TemplateRef<any>) {
    this.createLandForm.reset();
    this.fileName = null;
    this.modalService.open(createLandModal, { centered: true });
  }
  onClickEditBtn(id: string, updateLandModal: TemplateRef<any>) {
    const land = this.lands.find(v => v.id === id);
    this.fileName = null;
    this.updateLandForm.setValue({
      id: land.id,
      title: land.title,
      description: land.description,
      acres: land.acres,
      shortLocation: land.shortLocation,
      fullLocation: land.fullLocation,
      price: land.price,
      auctionType: land.auctionType,
      installmentType: land.installmentType,
      currency: land.currency,
      photo: null
    });
    this.modalService.open(updateLandModal, { centered: true });
  }

  onClickDelete(id: string) {
    Notiflix.Confirm.Init({
      okButtonBackground: '#e71c14',
      titleColor: '#ff0000',
      borderRadius: '10px',
      fontFamily: 'Roboto',
      useGoogleFont: true
    });
    Notiflix.Confirm.Show('Delete Land', 'Are you sure you want to delete this land?', 'Yes', 'No', () => {
      Notiflix.Loading.Pulse('Deleting...');
      this.landService.deleteLand(id).subscribe(res => {
        this.lands = this.lands.filter(v => v.id !== id);
        Notiflix.Loading.Remove();
        NotifyService.notify({
          from: 'top',
          align: 'right',
          message: 'Land removed successfully',
          notifyType: 'success',
          icon: 'check',
          delay: 3
        });
      });
    });
  }

  //#region
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
      photo: [null, this.requiredFileType('png', 'jpg', 'jpeg')]
    });
    this.updateLandForm = this.fb.group({
      id: [Validators.required],
      title: [[Validators.required, Validators.maxLength(32)]],
      description: [Validators.maxLength(32)],
      acres: [[Validators.required, Validators.min(1)]],
      shortLocation: [[Validators.required, Validators.maxLength(64)]],
      fullLocation: [[Validators.required, Validators.maxLength(64)]],
      price: [[Validators.required, Validators.min(1)]],
      auctionType: [Validators.required],
      installmentType: [Validators.required],
      currency: [Validators.required],
      photo: [null, this.requiredFileType('png', 'jpg', 'jpeg')]
    });
  }
  toFormData<T>(formValue: T) {
    const formData = new FormData();

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }

    return formData;
  }
  requiredFileType(...types: string[]) {
    return (control: FormControl) => {
      const file = control.value;
      if (file) {
        const extension = file.split('.')[1].toLowerCase();
        if (!types.find(v => v.toLowerCase() === extension.toLowerCase())) {
          return {
            requiredFileType: true
          };
        }

        return null;
      }

      return null;
    };
  }
  getFormValidationErrors(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      const controlErrors: ValidationErrors = form.get(key).errors;
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

  //#endregion
}

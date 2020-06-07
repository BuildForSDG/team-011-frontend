import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { PaginationInstance } from 'ngx-pagination';
import Notiflix from 'notiflix-angular';

import { NotifyService } from '../shared/services/notify.service';
import { CreateLandDto, LandDto, UpdateLandDto } from './land.dto';
import { LandService } from './land.service';
import { LocalStoreService } from '../shared/services/local-store.service';

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
  landInfo: LandDto;
  createLandForm: FormGroup;
  updateLandForm: FormGroup;
  private file: File | null = null;
  fileName: string;

  pageConfig: PaginationInstance = {
    itemsPerPage: 8,
    currentPage: 1,
    // totalItems: 0,
    id: 'custom'
  };

  constructor(
    private landService: LandService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private localStore: LocalStoreService
  ) {}
  ngOnInit(): void {
    this.localStore.disableCaching();
    this.landService.getUserLands({ skip: 0, limit: 100, auctionType: 'Rent' }).subscribe(res => {
      this.lands = res.items;
    });
    this.initForm();
  }

  onFileSelect = (event: FileList) => {
    const file = event && event.item(0);
    this.file = file;
    this.fileName = file.name;
  };
  onClickTab = (auctionType: 'Rent' | 'Lease') => {
    Notiflix.Loading.Pulse();
    this.pageConfig.currentPage = 1;
    this.localStore.disableCaching();
    this.landService.getUserLands({ skip: 0, limit: 100, auctionType }).subscribe(res => {
      this.lands = res.items;
      Notiflix.Loading.Remove();
    });
  };
  onClickCreate = () => {
    // console.log(this.getFormValidationErrors(this.createLandForm));
    if (this.createLandForm.invalid) return;
    Notiflix.Loading.Pulse();
    const input: CreateLandDto = this.createLandForm.value;

    const inputDto = this.file ? this.toFormData({ ...input, photo: this.file }) : input;
    this.landService.createLand(inputDto).subscribe((res: LandDto) => {
      this.lands.unshift(res);
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
  };
  onClickUpdate = () => {
    // console.log(this.getFormValidationErrors(this.updateLandForm));
    if (this.updateLandForm.invalid) return;
    Notiflix.Loading.Pulse();
    const currPage = this.pageConfig.currentPage;
    const input: UpdateLandDto = this.updateLandForm.value;

    const inputDto = this.file ? this.toFormData({ ...input, photo: this.file }) : input;
    this.landService.updateLand(input.id, inputDto).subscribe((res: LandDto) => {
      const index = this.lands.findIndex(v => v.id === res.id);
      this.lands[index] = res;
      this.pageConfig.currentPage = currPage;
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
  };
  onClickLandInfoBtn = (landInfo: TemplateRef<any>, land: LandDto) => {
    this.landInfo = land;
    this.modalService.open(landInfo, { centered: true });
  };
  onClickAddBtn = (createLandModal: TemplateRef<any>) => {
    this.createLandForm.reset();
    this.file = null;
    this.fileName = null;
    this.modalService.open(createLandModal, { centered: true });
  };
  onClickEditBtn = (id: string, updateLandModal: TemplateRef<any>) => {
    const land = this.lands.find(v => v.id === id);
    this.fileName = null;
    this.updateLandForm.setValue({
      id: land.id,
      description: land.description,
      acres: land.acres,
      shortLocation: land.shortLocation,
      fullLocation: land.fullLocation,
      price: land.price,
      auctionType: land.auctionType,
      installmentType: land.installmentType,
      photo: null
    });
    this.modalService.open(updateLandModal, { centered: true });
  };

  onClickDelete = (id: string) => {
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
  };

  //#region
  initForm = () => {
    this.createLandForm = this.fb.group({
      description: [null, Validators.maxLength(128)],
      acres: [null, [Validators.required, Validators.min(1)]],
      shortLocation: [null, [Validators.required, Validators.maxLength(32)]],
      fullLocation: [null, [Validators.required, Validators.maxLength(512)]],
      price: [null, [Validators.required, Validators.min(1)]],
      auctionType: [null, Validators.required],
      installmentType: [null, Validators.required],
      photo: [null, this.requiredFileType('png', 'jpg', 'jpeg')]
    });
    this.updateLandForm = this.fb.group({
      id: [Validators.required],
      description: [Validators.maxLength(128)],
      acres: [[Validators.required, Validators.min(1)]],
      shortLocation: [[Validators.required, Validators.maxLength(32)]],
      fullLocation: [[Validators.required, Validators.maxLength(512)]],
      price: [[Validators.required, Validators.min(1)]],
      auctionType: [Validators.required],
      installmentType: [Validators.required],
      photo: [null, this.requiredFileType('png', 'jpg', 'jpeg')]
    });
  };
  toFormData = <T>(formValue: T) => {
    const formData = new FormData();

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }
    return formData;
  };
  requiredFileType = (...types: string[]) => {
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
  };
  getFormValidationErrors = (form: FormGroup) => {
    Object.keys(form.controls).forEach(key => {
      const controlErrors: ValidationErrors = form.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  };
  onClickFileUpload = () => $('#file').click();

  //#endregion
}

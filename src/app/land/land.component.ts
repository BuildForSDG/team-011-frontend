import Notiflix from 'notiflix-angular';
import { Component, OnInit, HostListener } from '@angular/core';
import { LandService } from './land.service';
import { LandDto, CreateLandDto } from './land.dto';
import { FormBuilder, FormGroup, Validators, ValidationErrors, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as $ from 'jquery';
import { NotifyService } from '../shared/services/notify.service';
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
  private file: File | null = null;
  fileName: string;
  constructor(private landService: LandService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.landService.getLands(0, 10).subscribe(lands => {
      this.lands = lands;
    });
    this.initForm();
  }

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);
    this.file = file;
    this.fileName = file?.name;
  }
  onClickCreate() {
    console.log(this.getFormValidationErrors());

    if (this.createLandForm.invalid) return;
    Notiflix.Loading.Pulse();
    const input: CreateLandDto = this.createLandForm.value;
    input.photo = this.file;
    const fd = this.toFormData(input);
    console.log(fd);
    this.landService.createLand(fd).subscribe((res: LandDto) => {
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
  onClickFileUpload() {
    $('#file').click();
  }
  toFormData<T>(formValue: T) {
    const formData = new FormData();

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }

    return formData;
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
      photo: [null, [Validators.required, this.requiredFileType('png', 'jpg', 'jpeg')]]
    });
  }
}

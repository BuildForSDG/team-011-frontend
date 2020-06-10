import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import { PaginationInstance } from "ngx-pagination";
import Notiflix from "notiflix-angular";
import { Observable } from "rxjs";
import { share, tap } from "rxjs/operators";

import { LocalStoreService } from "../shared/services/local-store.service";
import { NotifyService } from "../shared/services/notify.service";
import { CreateLandDto, LandDto, LandStatus, PagedRes, UpdateLandDto } from "./land.dto";
import { LandService } from "./land.service";

@Component({
  selector: "app-land",
  templateUrl: "./land.component.html",
  styleUrls: ["./land.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LandComponent,
      multi: true
    }
  ]
})
export class LandComponent implements OnInit {
  landInfo: LandDto;
  createLandForm: FormGroup;
  updateLandForm: FormGroup;
  LandStatus = LandStatus;
  private file: File | null = null;
  fileName: string;

  pageConfig: PaginationInstance = {
    itemsPerPage: 8,
    currentPage: 1,
    // totalItems: 0,
    id: "custom"
  };
  lands$: Observable<PagedRes<LandDto>>;
  cachedPagedLandDto: PagedRes<LandDto>;
  filterType: "Rent" | "Lease" | "Occupied" = "Rent";

  constructor(
    private landService: LandService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private localStore: LocalStoreService
  ) {}
  ngOnInit(): void {
    this.localStore.disableCaching();
    this.filterType = "Rent";
    this.lands$ = this.landService.getUserLands({ skip: 0, limit: 100 }).pipe(
      share(),
      tap(res => {
        this.cachedPagedLandDto = res;
      })
    );
    this.initForm();
  }

  onFileSelect = (event: FileList) => {
    const file = event && event.item(0);
    this.file = file;
    this.fileName = file.name;
  };
  onClickTab = (auctionType: "Rent" | "Lease" | "Occupied") => {
    this.pageConfig.currentPage = 1;
    this.filterType = auctionType;
  };
  filterLands = (lands?: LandDto[]) => {
    if (this.filterType === "Lease") return lands?.filter(x => x.auctionType === "Lease");
    if (this.filterType === "Rent") return lands?.filter(x => x.auctionType === "Rent");
    if (this.filterType === "Occupied") return lands?.filter(x => x.status === LandStatus.Occupied);
  };
  onClickCreate = () => {
    // console.log(this.getFormValidationErrors(this.createLandForm));
    if (this.createLandForm.invalid) return;
    Notiflix.Loading.Pulse();
    const input: CreateLandDto = this.createLandForm.value;

    const inputDto = this.file ? this.toFormData({ ...input, photo: this.file }) : input;
    this.landService
      .createLand(inputDto)
      .pipe(
        tap(x => {
          this.cachedPagedLandDto.items.unshift(x);
          this.filterLands(this.cachedPagedLandDto.items);
          this.onClickTab(x.auctionType);
        })
      )
      .subscribe(() => {
        this.modalService.dismissAll();
        Notiflix.Loading.Remove();
        NotifyService.notify({
          from: "top",
          align: "right",
          message: "Land created successfully",
          notifyType: "success",
          icon: "check",
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
      const index = this.cachedPagedLandDto.items.findIndex(v => v.id === res.id);
      this.cachedPagedLandDto.items[index] = res;
      this.pageConfig.currentPage = currPage;
      this.modalService.dismissAll();
      Notiflix.Loading.Remove();
      NotifyService.notify({
        from: "top",
        align: "right",
        message: "Land updated successfully",
        notifyType: "success",
        icon: "check",
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
  onClickEditBtn = (land: LandDto, updateLandModal: TemplateRef<any>) => {
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
      okButtonBackground: "#e71c14",
      titleColor: "#ff0000",
      borderRadius: "10px",
      fontFamily: "Roboto",
      useGoogleFont: true
    });
    Notiflix.Confirm.Show("Delete Land", "Are you sure you want to delete this land?", "Yes", "No", () => {
      Notiflix.Loading.Pulse("Deleting...");
      this.landService.deleteLand(id).subscribe(() => {
        this.cachedPagedLandDto.items = this.cachedPagedLandDto.items.filter(v => v.id !== id);
        Notiflix.Loading.Remove();
        NotifyService.notify({
          from: "top",
          align: "right",
          message: "Land removed successfully",
          notifyType: "success",
          icon: "check",
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
      photo: [null, this.requiredFileType("png", "jpg", "jpeg")]
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
      photo: [null, this.requiredFileType("png", "jpg", "jpeg")]
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
        const extension = file.split(".")[1].toLowerCase();
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
          console.log("Key control: " + key + ", keyError: " + keyError + ", err value: ", controlErrors[keyError]);
        });
      }
    });
  };
  onClickFileUpload = () => $("#file").click();

  //#endregion
}

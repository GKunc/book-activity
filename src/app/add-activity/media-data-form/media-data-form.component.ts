import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivitiesService, Activity } from 'src/app/common/services/activities/activities.service';

@Component({
  selector: 'media-data-form',
  templateUrl: './media-data-form.component.html',
  styleUrls: ['./media-data-form.component.less']
})
export class MediaDataFormComponent implements OnInit {
  @Input()
  activity: Activity;

  @Input()
  isEditing = false;

  @Input()
  isLoading = false;

  @Input()
  guid: string;

  @Output()
  formSubmitted: EventEmitter<MediaData> = new EventEmitter<MediaData>();

  @Output()
  previousForm: EventEmitter<any> = new EventEmitter<any>();

  submitLabel = "Wyślij";

  uploading: boolean;
  loadingImages = false;

  form = new FormGroup({
    images: new FormControl(null),
  });

  images: File[] = [];

  private fileList: FileList;

  constructor(
    private activitiesService: ActivitiesService) { }

  ngOnInit(): void {
    if (this.activity) {
      this.loadingImages = true;
      for (let i = 0; i < this.activity.nubmerOfImages; i++) {
        this.activitiesService.getPhoto(`${this.activity.guid}-${i}`).subscribe((response) => {
          this.images.push(new File([response], `file-${i}`));
        },
          (e) => console.log("ERROR: ", e),
          () => this.loadingImages = false,
        )
      }
      this.form.controls.images.setValue(this.activity.nubmerOfImages)
    }

    if (this.isEditing) {
      this.submitLabel = "Zapisz";
    }
  }

  previous(): void {
    this.previousForm.emit();
  }

  submit(): void {
    if (this.validateForm()) {
      this.uploadFiles();
      this.formSubmitted.emit({
        images: this.form.controls['images'].value,
        isEditing: this.isEditing,
      })
    }
  }

  filesChange(event) {
    // make sure no duplicates
    // add option to remove
    this.fileList = event.target.files;
    for (let i = 0; i < this.fileList.length; i++) {
      this.images.push(this.fileList[i])
    }
  }

  deleteFile(index: number) {
    this.images.splice(index, 1);
  }


  onFileDropped(files: Array<any>) {
    for (const item of files) {
      this.images.push(item);
    }
  }


  private uploadFiles(): void {
    if (this.images.length > 0) {
      for (let i = 0; i < this.images.length; i++) {
        const file: File = this.images[i];
        const formData: FormData = new FormData();
        formData.append('file', file, `${this.guid}-${i}`);
        this.activitiesService.insertPhoto(formData).subscribe((data) => {
          console.log("DATA:", data);
        });
      }

      this.form.controls['images'].setValue(this.images.length);
    }
  }

  private validateForm(): boolean {
    // if (!this.form.valid) {
    //   Object.values(this.form.controls).forEach(control => {
    //     if (control.invalid) {
    //       control.markAsDirty();
    //       control.updateValueAndValidity({ onlySelf: true });
    //     }
    //   });
    //   return false;
    // }
    return true;
  }
}

export interface MediaData {
  images: number;
  isEditing: boolean;
}

export function instanceOfMediaData(object: any): object is MediaData {
  return ('images' in object);
}


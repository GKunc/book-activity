import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivitiesService } from 'src/app/common/services/activities/activities.service';

@Component({
  selector: 'media-data-form',
  templateUrl: './media-data-form.component.html',
  styleUrls: ['./media-data-form.component.less']
})
export class MediaDataFormComponent {
  @Input()
  isLoading: boolean = false;

  @Input()
  guid: string;

  @Output()
  formSubmitted: EventEmitter<MediaData> = new EventEmitter<MediaData>();

  @Output()
  previousForm: EventEmitter<any> = new EventEmitter<any>();

  uploading: boolean;

  form = new FormGroup({
    images: new FormControl(0),
  });

  images: File[] = [];

  private fileList: FileList;

  constructor(
    private activitiesService: ActivitiesService) { }

  previous(): void {
    this.previousForm.emit();
  }

  submit(): void {
    if (this.validateForm()) {
      this.uploadFiles();
      this.formSubmitted.emit({
        images: this.form.controls.images.value,
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
        let file: File = this.images[i];
        let formData: FormData = new FormData();
        formData.append('file', file, `${this.guid}-${i}`);
        this.activitiesService.insertPhoto(formData).subscribe((data) => {
          console.log("DATA:", data);
        });
      }
      console.log("GUID FILE:", this.guid);

      this.form.controls.images.setValue(this.images.length);
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
}

export function instanceOfMediaData(object: any): object is MediaData {
  return ('images' in object);
}

